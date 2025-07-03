import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ColorPicker } from "@/components/color-picker";
import { TestResponse } from "@/types/test";

interface GraphemeTestProps {
  items: string[];
  colors: string[];
  onResponse: (response: TestResponse) => void;
  onComplete: () => void;
  onHelp: () => void;
}

export function GraphemeTest({ items, colors, onResponse, onComplete, onHelp }: GraphemeTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedColor("");
  }, [currentIndex]);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleNext = () => {
    if (!selectedColor) return;

    const responseTime = Date.now() - startTime;
    const response: TestResponse = {
      stimulus: currentItem,
      response: selectedColor,
      responseTime,
      timestamp: Date.now()
    };

    onResponse(response);

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <section>
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Letter-Color Association Test</h3>
            <p className="text-slate-600">Select the color that feels most natural for each letter</p>
            
            {/* Test Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Progress</span>
                <span>{currentIndex + 1} of {items.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Current Letter Display */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-4 border-2 border-slate-200">
              <span className="text-6xl font-bold text-slate-900">{currentItem}</span>
            </div>
            <p className="text-slate-600">What color do you associate with this letter?</p>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <ColorPicker
              colors={colors}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
              allowCustom={true}
              multiple={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={onHelp}
              className="text-slate-500 hover:text-slate-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Need help?
            </Button>
            <div className="space-x-4">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!selectedColor}
                className="bg-primary text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentIndex < items.length - 1 ? 'Next Letter' : 'Complete Test'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
