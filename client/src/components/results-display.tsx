import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestSession } from "@/types/test";
import { ScoreResult } from "@/lib/scoring";

interface ResultsDisplayProps {
  session: TestSession;
  overallResult: ScoreResult;
  individualResults: Record<string, ScoreResult>;
  recommendations: string[];
  onRetakeTest: () => void;
  onDownloadPDF: () => void;
  onShareResults: (platform: string) => void;
}

export function ResultsDisplay({ 
  session, 
  overallResult, 
  individualResults, 
  recommendations,
  onRetakeTest,
  onDownloadPDF,
  onShareResults
}: ResultsDisplayProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'very-high': return 'text-emerald-600';
      case 'high': return 'text-blue-600';
      case 'moderate': return 'text-yellow-600';
      default: return 'text-slate-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-slate-600';
  };

  const testTypeInfo = {
    grapheme: {
      title: 'Letter-Color',
      icon: 'A',
      gradient: 'from-red-400 to-purple-500'
    },
    number: {
      title: 'Number-Color',
      icon: '7',
      gradient: 'from-blue-400 to-green-500'
    },
    sound: {
      title: 'Sound-Color',
      icon: '♪',
      gradient: 'from-yellow-400 to-orange-500'
    }
  };

  return (
    <section>
      <Card className="shadow-lg mb-8">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Your Synesthesia Test Results</h3>
            <p className="text-slate-600">Based on consistency analysis of your responses</p>
          </div>

          {/* Overall Score */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(overallResult.score)}`}>
                    {overallResult.score}
                  </span>
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-900">Synesthesia Likelihood</p>
              <p className={`capitalize ${getConfidenceColor(overallResult.confidence)}`}>
                {overallResult.confidence.replace('-', ' ')} Probability
              </p>
            </div>
          </div>

          {/* Individual Test Results */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(individualResults).map(([testType, result]) => {
              const info = testTypeInfo[testType as keyof typeof testTypeInfo];
              if (!info) return null;

              return (
                <div key={testType} className="bg-slate-50 rounded-xl p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <span className="text-white font-bold text-xl">{info.icon}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{info.title}</h4>
                  <div className={`text-2xl font-bold mb-1 ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{result.interpretation.slice(0, 60)}...</p>
                  {result.dominantColors.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-center space-x-1">
                        {result.dominantColors.slice(0, 3).map((color, index) => (
                          <div 
                            key={index}
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Your dominant color patterns</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interpretation */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              <svg className="w-5 h-5 inline text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              What This Means
            </h4>
            <p className="text-slate-700 mb-4">{overallResult.interpretation}</p>
            
            {recommendations.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Recommendations:</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
                {recommendations.length > 3 && (
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Additional Insights:</h5>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {recommendations.slice(3, 6).map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Share Results */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Share Your Results</h4>
            <div className="flex justify-center space-x-4 mb-6">
              <Button 
                onClick={() => onShareResults('twitter')}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </Button>
              <Button 
                onClick={() => onShareResults('facebook')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              <Button 
                onClick={() => onShareResults('link')}
                variant="outline"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Copy Link
              </Button>
            </div>
            
            <div className="space-x-4">
              <Button variant="outline" onClick={onDownloadPDF}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </Button>
              <Button onClick={onRetakeTest} className="bg-primary text-white hover:bg-indigo-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Take Test Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
