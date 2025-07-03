import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ResultsDisplay } from "@/components/results-display";
import { EducationalInfo } from "@/components/educational-info";
import { TestSession } from "@/types/test";
import { calculateConsistencyScore, calculateOverallSynesthesiaScore, generateRecommendations } from "@/lib/scoring";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const sessionId = searchParams.get('session');

  // Get test session and results
  const { data: session, isLoading, error } = useQuery<TestSession>({
    queryKey: [`/api/test-session/${sessionId}`],
    enabled: !!sessionId,
  });

  // Calculate detailed results
  const [analysisResults, setAnalysisResults] = useState<{
    overallResult: any;
    individualResults: Record<string, any>;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    if (session?.scores) {
      // Convert basic scores to detailed analysis
      const individualResults: Record<string, any> = {};
      
      Object.entries(session.scores).forEach(([testType, score]) => {
        if (testType !== 'overall' && typeof score === 'number') {
          individualResults[testType] = {
            score,
            interpretation: generateInterpretation(score),
            confidence: getConfidenceLevel(score),
            dominantColors: [] // Would need response data to calculate
          };
        }
      });

      const overallResult = {
        score: session.scores.overall || 0,
        interpretation: generateOverallInterpretation(session.scores.overall || 0, individualResults),
        confidence: getOverallConfidence(individualResults),
        dominantColors: []
      };

      const recommendations = generateRecommendations(overallResult, individualResults);

      setAnalysisResults({
        overallResult,
        individualResults,
        recommendations
      });
    }
  }, [session]);

  const generateInterpretation = (score: number): string => {
    if (score >= 85) return "Very high consistency suggests strong synesthetic associations";
    if (score >= 70) return "High consistency indicates likely synesthetic experiences";
    if (score >= 50) return "Moderate consistency suggests possible synesthetic tendencies";
    if (score >= 30) return "Low consistency indicates limited synesthetic associations";
    return "Very low consistency suggests no significant synesthetic experiences";
  };

  const getConfidenceLevel = (score: number): 'low' | 'moderate' | 'high' | 'very-high' => {
    if (score >= 85) return 'very-high';
    if (score >= 70) return 'high';
    if (score >= 50) return 'moderate';
    return 'low';
  };

  const generateOverallInterpretation = (overallScore: number, individualResults: Record<string, any>): string => {
    const highScoreTests = Object.entries(individualResults).filter(([, result]) => result.score >= 70);
    
    if (highScoreTests.length >= 2) {
      return "Strong evidence for multiple types of synesthesia. Your consistent responses suggest genuine synesthetic experiences.";
    } else if (highScoreTests.length === 1) {
      return `Evidence suggests synesthetic experiences, particularly in ${highScoreTests[0][0]} associations.`;
    } else if (overallScore >= 50) {
      return "Mixed results suggest possible synesthetic tendencies. Further testing recommended.";
    }
    return "Results do not strongly indicate synesthetic experiences.";
  };

  const getOverallConfidence = (individualResults: Record<string, any>): 'low' | 'moderate' | 'high' | 'very-high' => {
    const highConfidenceCount = Object.values(individualResults).filter(
      result => result.confidence === 'high' || result.confidence === 'very-high'
    ).length;
    
    if (highConfidenceCount >= 2) return 'very-high';
    if (highConfidenceCount >= 1) return 'high';
    if (Object.keys(individualResults).length >= 2) return 'moderate';
    return 'low';
  };

  const handleRetakeTest = () => {
    setLocation('/');
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download PDF",
      description: "PDF download functionality would be implemented here.",
    });
  };

  const handleShareResults = (platform: string) => {
    const url = window.location.href;
    const text = `I just took a synesthesia test and got ${analysisResults?.overallResult.score}% likelihood!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'link':
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: "Link Copied",
            description: "Results link copied to clipboard!",
          });
        });
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Failed to load test results. Please check your session link and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-12 w-12 bg-slate-300 mx-auto mb-4"></div>
          <p className="text-slate-600">Processing analysis...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-sm text-slate-600">Test Results</div>
          </div>
        </div>
      </nav>

      {/* Results Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResultsDisplay
          session={session}
          overallResult={analysisResults.overallResult}
          individualResults={analysisResults.individualResults}
          recommendations={analysisResults.recommendations}
          onRetakeTest={handleRetakeTest}
          onDownloadPDF={handleDownloadPDF}
          onShareResults={handleShareResults}
        />
        
        <EducationalInfo />
      </div>
    </div>
  );
}
