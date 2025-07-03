import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ColorPicker } from "@/components/color-picker";
import { TestResponse } from "@/types/test";
import { audioManager } from "@/lib/audio";

interface SoundTestProps {
  items: Array<{ id: string; name: string; audioUrl?: string }>;
  colors: string[];
  onResponse: (response: TestResponse) => void;
  onComplete: () => void;
  onHelp: () => void;
}

export function SoundTest({ items, colors, onResponse, onComplete, onHelp }: SoundTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedColors([]);
  }, [currentIndex]);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleColorSelect = (colors: string[]) => {
    setSelectedColors(colors);
  };

  const handlePlaySound = async () => {
    setIsPlaying(true);
    try {
      const soundGenerator = audioManager.getSoundGenerator(currentItem.id);
      await soundGenerator();
    } catch (error) {
      console.error("Failed to play sound:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    const responseTime = Date.now() - startTime;
    const response: TestResponse = {
      stimulus: currentItem.id,
      response: selectedColors,
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
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sound-Color Visualization Test</h3>
            <p className="text-slate-600">Listen to each sound and select any colors you visualize</p>
            
            {/* Test Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span>Progress</span>
                <span>{currentIndex + 1} of {items.length}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Audio Player Section */}
          <div className="text-center mb-8">
            <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mx-auto flex items-center justify-center mb-6 relative">
              <Button
                onClick={handlePlaySound}
                disabled={isPlaying}
                className="w-20 h-20 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-75"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 002-2V9a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L10.293 4.293A1 1 0 009.586 4H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </Button>
              {/* Sound visualization rings */}
              {isPlaying && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-pink-500 opacity-20 animate-ping"></div>
                  <div className="absolute inset-4 rounded-full border-4 border-pink-400 opacity-30 animate-ping animation-delay-200"></div>
                </>
              )}
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">{currentItem.name}</h4>
            <p className="text-slate-600">Click play and select colors you see or feel</p>
          </div>

          {/* Color Selection (Multiple Choice) */}
          <div className="mb-8">
            <ColorPicker
              colors={colors}
              selectedColors={selectedColors}
              onMultipleSelect={handleColorSelect}
              allowCustom={true}
              multiple={true}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handlePlaySound}
              className="text-slate-500 hover:text-slate-700"
              disabled={isPlaying}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M6.343 6.343a9 9 0 000 12.728m2.829-9.9a5 5 0 000 7.072" />
              </svg>
              Replay Sound
            </Button>
            <div className="space-x-4">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-pink-500 text-white hover:bg-pink-600"
              >
                {currentIndex < items.length - 1 ? 'Next Sound' : 'Complete Test'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
