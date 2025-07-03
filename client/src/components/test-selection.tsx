import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestType } from "@/types/test";

interface TestSelectionProps {
  onTestSelect: (testType: TestType) => void;
  onTakeAllTests: () => void;
  onBack: () => void;
}

export function TestSelection({ onTestSelect, onTakeAllTests, onBack }: TestSelectionProps) {
  const testTypes = [
    {
      id: 'grapheme' as TestType,
      title: 'Letter-Color Test',
      description: 'See if letters and numbers consistently trigger specific color experiences',
      duration: '8-10 minutes',
      icon: 'A',
      gradient: 'from-red-400 to-purple-500'
    },
    {
      id: 'number' as TestType,
      title: 'Number-Color Test', 
      description: 'Explore consistent color associations with numbers and mathematical concepts',
      duration: '6-8 minutes',
      icon: '7',
      gradient: 'from-blue-400 to-green-500'
    },
    {
      id: 'sound' as TestType,
      title: 'Sound-Color Test',
      description: 'Test if sounds, music, or voices trigger visual color experiences',
      duration: '5-7 minutes',
      icon: '♪',
      gradient: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <section>
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Select Your Test Type</h3>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div className="w-16 h-1 bg-slate-200"></div>
              <div className="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div className="w-16 h-1 bg-slate-200"></div>
              <div className="w-8 h-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testTypes.map((test) => (
              <div
                key={test.id}
                className="border-2 border-slate-200 rounded-xl p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onTestSelect(test.id)}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${test.gradient} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-xl">{test.icon}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{test.title}</h4>
                  <p className="text-slate-600 text-sm mb-4">{test.description}</p>
                  <div className="text-xs text-slate-500">
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 mb-4">You can take individual tests or complete all three for comprehensive results</p>
            <div className="space-x-4">
              <Button variant="outline" onClick={onBack}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
              <Button onClick={onTakeAllTests} className="bg-primary text-white hover:bg-indigo-600">
                Take All Tests
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
