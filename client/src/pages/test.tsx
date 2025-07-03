import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GraphemeTest } from "@/components/grapheme-test";
import { NumberTest } from "@/components/number-test";
import { SoundTest } from "@/components/sound-test";
import { TestConfig, TestType, TestState, TestResponse } from "@/types/test";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Test() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const testType = searchParams.get('type') as TestType | 'all' || 'grapheme';

  const [testState, setTestState] = useState<TestState>({
    currentTest: testType === 'all' ? 'grapheme' : testType,
    currentQuestionIndex: 0,
    responses: {},
    sessionId: null,
    isComplete: false,
    startTime: Date.now()
  });

  // Get test configuration
  const { data: config, isLoading: configLoading, error: configError } = useQuery<TestConfig>({
    queryKey: ['/api/test-config'],
  });

  // Create test session
  const createSessionMutation = useMutation({
    mutationFn: async (testType: string) => {
      const response = await apiRequest('POST', '/api/test-session', { testType });
      return await response.json();
    },
    onSuccess: (session) => {
      setTestState(prev => ({ ...prev, sessionId: session.sessionId }));
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create test session. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Submit test response
  const submitResponseMutation = useMutation({
    mutationFn: async (response: TestResponse & { sessionId: string; testType: string }) => {
      return await apiRequest('POST', '/api/test-response', response);
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to save response. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Complete test
  const completeTestMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('POST', `/api/test-session/${sessionId}/complete`);
      return await response.json();
    },
    onSuccess: (session) => {
      queryClient.setQueryData([`/api/test-session/${session.sessionId}`], session);
      setLocation(`/results?session=${session.sessionId}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete test. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Create session on mount
  useEffect(() => {
    if (!testState.sessionId) {
      createSessionMutation.mutate(testType);
    }
  }, []);

  const handleResponse = (response: TestResponse) => {
    if (!testState.sessionId || !testState.currentTest) return;

    // Store response locally
    const responseKey = `${testState.currentTest}-${response.stimulus}`;
    setTestState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [responseKey]: response
      }
    }));

    // Submit to server
    submitResponseMutation.mutate({
      ...response,
      sessionId: testState.sessionId,
      testType: testState.currentTest
    });
  };

  const handleTestComplete = () => {
    if (testType === 'all') {
      // Move to next test
      if (testState.currentTest === 'grapheme') {
        setTestState(prev => ({ ...prev, currentTest: 'number', currentQuestionIndex: 0 }));
      } else if (testState.currentTest === 'number') {
        setTestState(prev => ({ ...prev, currentTest: 'sound', currentQuestionIndex: 0 }));
      } else {
        // All tests complete
        if (testState.sessionId) {
          completeTestMutation.mutate(testState.sessionId);
        }
      }
    } else {
      // Single test complete
      if (testState.sessionId) {
        completeTestMutation.mutate(testState.sessionId);
      }
    }
  };

  const handleHelp = () => {
    toast({
      title: "Test Instructions",
      description: "Select the color that feels most natural and automatic for each stimulus. Trust your first instinct.",
    });
  };

  if (configLoading || createSessionMutation.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Failed to load test configuration. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!config || !testState.currentTest) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">SynesthTest</h1>
            </div>
            <div className="text-sm text-slate-600">
              {testType === 'all' ? `Test ${testState.currentTest === 'grapheme' ? '1' : testState.currentTest === 'number' ? '2' : '3'} of 3` : 'Test in Progress'}
            </div>
          </div>
        </div>
      </nav>

      {/* Test Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testState.currentTest === 'grapheme' && (
          <GraphemeTest
            items={config.grapheme.items}
            colors={config.grapheme.colors}
            onResponse={handleResponse}
            onComplete={handleTestComplete}
            onHelp={handleHelp}
          />
        )}
        
        {testState.currentTest === 'number' && (
          <NumberTest
            items={config.number.items}
            colors={config.number.colors}
            onResponse={handleResponse}
            onComplete={handleTestComplete}
            onHelp={handleHelp}
          />
        )}
        
        {testState.currentTest === 'sound' && (
          <SoundTest
            items={config.sound.items}
            colors={config.sound.colors}
            onResponse={handleResponse}
            onComplete={handleTestComplete}
            onHelp={handleHelp}
          />
        )}
      </div>
    </div>
  );
}
