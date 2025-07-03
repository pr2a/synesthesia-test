import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  allowCustom?: boolean;
  multiple?: boolean;
  selectedColors?: string[];
  onMultipleSelect?: (colors: string[]) => void;
}

export function ColorPicker({ 
  colors, 
  selectedColor, 
  onColorSelect,
  allowCustom = true,
  multiple = false,
  selectedColors = [],
  onMultipleSelect
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState("#000000");

  const handleColorClick = (color: string) => {
    if (multiple && onMultipleSelect) {
      const newSelected = selectedColors.includes(color)
        ? selectedColors.filter(c => c !== color)
        : [...selectedColors, color];
      onMultipleSelect(newSelected);
    } else {
      onColorSelect(color);
    }
  };

  const handleCustomColorSelect = () => {
    if (multiple && onMultipleSelect) {
      const newSelected = selectedColors.includes(customColor)
        ? selectedColors.filter(c => c !== customColor)
        : [...selectedColors, customColor];
      onMultipleSelect(newSelected);
    } else {
      onColorSelect(customColor);
    }
  };

  const isSelected = (color: string) => {
    if (multiple) {
      return selectedColors.includes(color);
    }
    return selectedColor === color;
  };

  return (
    <div className="space-y-6">
      {/* Color Grid */}
      <div className="grid grid-cols-6 md:grid-cols-8 gap-3 max-w-2xl mx-auto">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-xl cursor-pointer border-4 transition-all hover:scale-105 ${
              isSelected(color) 
                ? 'border-slate-900 shadow-lg' 
                : 'border-transparent hover:border-slate-400'
            } ${multiple && isSelected(color) ? 'ring-4 ring-emerald-400' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
            aria-label={`Select color ${color}`}
          >
            {multiple && isSelected(color) && (
              <div className="w-full h-full rounded-lg bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Color Picker */}
      {allowCustom && (
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-500">Don't see the right color?</p>
          <div className="flex items-center justify-center space-x-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-slate-300 cursor-pointer"
              aria-label="Custom color picker"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomColorSelect}
              className="text-sm"
            >
              Use Custom Color
            </Button>
          </div>
        </div>
      )}

      {/* No Color Option for Sound Test */}
      {multiple && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMultipleSelect && onMultipleSelect([])}
            className="text-slate-500 hover:text-slate-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            I don't see any colors
          </Button>
        </div>
      )}
    </div>
  );
}
