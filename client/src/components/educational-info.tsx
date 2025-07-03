import { Card, CardContent } from "@/components/ui/card";

export function EducationalInfo() {
  const synesthesiaTypes = [
    {
      name: 'Grapheme-Color',
      description: 'Letters and numbers trigger specific colors',
      color: 'bg-red-400'
    },
    {
      name: 'Chromesthesia',
      description: 'Sounds trigger visual color experiences',
      color: 'bg-blue-400'
    },
    {
      name: 'Lexical-Gustatory',
      description: 'Words trigger taste sensations',
      color: 'bg-green-400'
    }
  ];

  return (
    <section>
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Understanding Synesthesia</h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3">What is Synesthesia?</h4>
              <p className="text-slate-600 mb-4">
                Synesthesia is a neurological condition where stimulation of one sensory pathway leads to involuntary experiences in a second sensory pathway. For example, hearing a sound might trigger the visualization of colors.
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Affects approximately 1 in 2,000 people</li>
                <li>• Often runs in families</li>
                <li>• More common in women than men</li>
                <li>• Associated with enhanced creativity</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Types of Synesthesia</h4>
              <div className="space-y-3">
                {synesthesiaTypes.map((type, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 ${type.color} rounded-full flex-shrink-0 mt-0.5`}></div>
                    <div>
                      <p className="font-medium text-slate-900">{type.name}</p>
                      <p className="text-sm text-slate-600">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Research Note */}
          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">
              <svg className="w-5 h-5 inline text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Scientific Note
            </h4>
            <p className="text-slate-600 text-sm">
              This test is based on established research methods but is not a clinical diagnosis. 
              Consistency in color associations is the key indicator of genuine synesthesia. 
              If you scored high, consider participating in formal synesthesia research studies.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
