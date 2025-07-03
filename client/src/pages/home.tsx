import { useState } from "react";
import { useLocation } from "wouter";
import { WelcomeSection } from "@/components/welcome-section";
import { TestSelection } from "@/components/test-selection";
import { EducationalInfo } from "@/components/educational-info";
import { TestType } from "@/types/test";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showTestSelection, setShowTestSelection] = useState(false);

  const handleStartTest = () => {
    setShowTestSelection(true);
  };

  const handleTestSelect = (testType: TestType) => {
    setLocation(`/test?type=${testType}`);
  };

  const handleTakeAllTests = () => {
    setLocation('/test?type=all');
  };

  const handleBack = () => {
    setShowTestSelection(false);
  };

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
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">About</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Research</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showTestSelection ? (
          <>
            <WelcomeSection onStartTest={handleStartTest} />
            <EducationalInfo />
          </>
        ) : (
          <TestSelection 
            onTestSelect={handleTestSelect}
            onTakeAllTests={handleTakeAllTests}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
