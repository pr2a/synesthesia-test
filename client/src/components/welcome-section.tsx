import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeSectionProps {
  onStartTest: () => void;
}

export function WelcomeSection({ onStartTest }: WelcomeSectionProps) {
  return (
    <section className="text-center mb-12">
      <Card className="shadow-lg">
        <CardContent className="p-8 md:p-12">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Discover Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Synesthetic
              </span>{" "}
              Abilities
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Synesthesia is a fascinating neurological phenomenon where stimulation of one sensory pathway leads to experiences in another. Take our comprehensive test to explore if you experience these unique sensory connections.
            </p>
          </div>

          {/* Scientific Credibility Indicators */}
          <div className="flex justify-center items-center space-x-8 mb-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Research-based</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>15-20 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>10,000+ tested</span>
            </div>
          </div>

          <Button 
            onClick={onStartTest}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Your Test
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
