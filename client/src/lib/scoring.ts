import { TestResponse } from "@/types/test";

export interface ScoreResult {
  score: number;
  interpretation: string;
  confidence: 'low' | 'moderate' | 'high' | 'very-high';
  dominantColors: string[];
}

export function calculateConsistencyScore(responses: TestResponse[]): ScoreResult {
  if (responses.length < 5) {
    return {
      score: 0,
      interpretation: "Insufficient data for analysis",
      confidence: 'low',
      dominantColors: []
    };
  }

  // Group responses by stimulus
  const stimulusGroups: Record<string, string[]> = {};
  responses.forEach(response => {
    const colors = Array.isArray(response.response) ? response.response : [response.response];
    if (!stimulusGroups[response.stimulus]) {
      stimulusGroups[response.stimulus] = [];
    }
    stimulusGroups[response.stimulus].push(...colors);
  });

  // Calculate consistency for each stimulus
  let totalConsistency = 0;
  let stimulusCount = 0;
  const colorFrequency: Record<string, number> = {};

  Object.entries(stimulusGroups).forEach(([stimulus, colors]) => {
    // Count color frequencies for this stimulus
    const colorCounts: Record<string, number> = {};
    colors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
      colorFrequency[color] = (colorFrequency[color] || 0) + 1;
    });

    // Calculate consistency (most frequent color / total responses)
    const maxCount = Math.max(...Object.values(colorCounts));
    const consistency = maxCount / colors.length;
    totalConsistency += consistency;
    stimulusCount++;
  });

  const averageConsistency = stimulusCount > 0 ? totalConsistency / stimulusCount : 0;
  const score = Math.round(averageConsistency * 100);

  // Determine dominant colors
  const sortedColors = Object.entries(colorFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([color]) => color);

  // Generate interpretation
  let interpretation = "";
  let confidence: 'low' | 'moderate' | 'high' | 'very-high' = 'low';

  if (score >= 85) {
    interpretation = "Very high consistency suggests strong synesthetic associations. Your responses show remarkable stability across repeated exposures.";
    confidence = 'very-high';
  } else if (score >= 70) {
    interpretation = "High consistency indicates likely synesthetic experiences. Your color associations appear to be automatic and stable.";
    confidence = 'high';
  } else if (score >= 50) {
    interpretation = "Moderate consistency suggests possible synesthetic tendencies. Some color associations may be genuine, but results are mixed.";
    confidence = 'moderate';
  } else if (score >= 30) {
    interpretation = "Low consistency indicates limited synesthetic associations. Most responses appear to be based on learned or cultural associations.";
    confidence = 'low';
  } else {
    interpretation = "Very low consistency suggests no significant synesthetic experiences. Responses appear random or based on non-perceptual factors.";
    confidence = 'low';
  }

  return {
    score,
    interpretation,
    confidence,
    dominantColors: sortedColors
  };
}

export function calculateOverallSynesthesiaScore(scores: Record<string, ScoreResult>): ScoreResult {
  const validScores = Object.values(scores).filter(result => result.score > 0);
  
  if (validScores.length === 0) {
    return {
      score: 0,
      interpretation: "No valid test data available for analysis.",
      confidence: 'low',
      dominantColors: []
    };
  }

  const averageScore = validScores.reduce((sum, result) => sum + result.score, 0) / validScores.length;
  const score = Math.round(averageScore);

  // Combine dominant colors from all tests
  const allColors = validScores.flatMap(result => result.dominantColors);
  const colorCounts: Record<string, number> = {};
  allColors.forEach(color => {
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  });
  
  const dominantColors = Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color);

  // Determine overall confidence
  const highConfidenceCount = validScores.filter(result => 
    result.confidence === 'high' || result.confidence === 'very-high'
  ).length;
  
  let confidence: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
  if (highConfidenceCount >= 2) {
    confidence = 'very-high';
  } else if (highConfidenceCount >= 1 || validScores.length >= 2) {
    confidence = 'high';
  } else if (validScores.length >= 1) {
    confidence = 'moderate';
  }

  // Generate overall interpretation
  let interpretation = "";
  const testTypes = Object.keys(scores);
  const strongTests = validScores.filter(result => result.score >= 70);

  if (strongTests.length >= 2) {
    interpretation = `Strong evidence for multiple types of synesthesia across ${testTypes.join(', ')} tests. Your consistent responses suggest genuine synesthetic experiences.`;
  } else if (strongTests.length === 1) {
    interpretation = `Evidence suggests synesthetic experiences, particularly in ${Object.keys(scores).find(key => scores[key].score >= 70)} associations. Consider further testing for comprehensive evaluation.`;
  } else if (score >= 50) {
    interpretation = "Mixed results suggest possible synesthetic tendencies. Some color associations may be genuine, but further testing recommended.";
  } else {
    interpretation = "Results do not strongly indicate synesthetic experiences. Color associations appear to be based on learned or cultural factors rather than perceptual experiences.";
  }

  return {
    score,
    interpretation,
    confidence,
    dominantColors
  };
}

export function generateRecommendations(overallResult: ScoreResult, individualResults: Record<string, ScoreResult>): string[] {
  const recommendations: string[] = [];

  if (overallResult.confidence === 'very-high' || overallResult.confidence === 'high') {
    recommendations.push("Consider participating in synesthesia research studies to contribute to scientific understanding.");
    recommendations.push("Connect with synesthesia communities and organizations for support and information.");
    recommendations.push("Explore how your synesthetic experiences might enhance creativity in art, music, or writing.");
  }

  if (overallResult.confidence === 'moderate') {
    recommendations.push("Retake the test in a few weeks to verify consistency of responses.");
    recommendations.push("Pay attention to your sensory experiences in daily life to better understand your perceptions.");
  }

  if (overallResult.score < 50) {
    recommendations.push("Learn more about synesthesia to understand this fascinating neurological phenomenon.");
    recommendations.push("While you may not have synesthesia, you can still appreciate the unique experiences of those who do.");
  }

  // Test-specific recommendations
  Object.entries(individualResults).forEach(([testType, result]) => {
    if (result.score >= 70) {
      if (testType === 'grapheme') {
        recommendations.push("Your strong letter-color associations might be helpful for memory techniques and creative writing.");
      } else if (testType === 'sound') {
        recommendations.push("Your sound-color experiences could enhance musical appreciation and audio-visual art creation.");
      } else if (testType === 'number') {
        recommendations.push("Your number-color associations might assist with mathematical learning and numerical memory.");
      }
    }
  });

  return recommendations;
}
