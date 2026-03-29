'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RiskLevel = 'Low' | 'Medium' | 'High' | null;

interface AssessmentState {
  speechScore: number | null;
  facialScore: number | null;
  cognitiveScore: number | null;
  finalScore: number | null;
  riskLevel: RiskLevel;
  speechCompleted: boolean;
  facialCompleted: boolean;
  cognitiveCompleted: boolean;
  setSpeechScore: (score: number) => void;
  setFacialScore: (score: number) => void;
  setCognitiveScore: (score: number) => void;
  resetAssessment: () => void;
  allCompleted: boolean;
}

const AssessmentContext = createContext<AssessmentState | undefined>(undefined);

// Determine risk level from score
function getRiskLevel(score: number): RiskLevel {
  if (score < 60) return 'High';      // high risk = low score
  if (score <= 75) return 'Medium';
  return 'Low';
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [speechScore, setSpeechScoreState] = useState<number | null>(null);
  const [facialScore, setFacialScoreState] = useState<number | null>(null);
  const [cognitiveScore, setCognitiveScoreState] = useState<number | null>(null);

  const speechCompleted = speechScore !== null;
  const facialCompleted = facialScore !== null;
  const cognitiveCompleted = cognitiveScore !== null;
  const allCompleted = speechCompleted && facialCompleted && cognitiveCompleted;

  // Calculate final score as average
  const finalScore = allCompleted
    ? Math.round(((speechScore ?? 0) + (facialScore ?? 0) + (cognitiveScore ?? 0)) / 3)
    : null;

  const riskLevel: RiskLevel = finalScore !== null ? getRiskLevel(finalScore) : null;

  const setSpeechScore = (score: number) => setSpeechScoreState(score);
  const setFacialScore = (score: number) => setFacialScoreState(score);
  const setCognitiveScore = (score: number) => setCognitiveScoreState(score);

  const resetAssessment = () => {
    setSpeechScoreState(null);
    setFacialScoreState(null);
    setCognitiveScoreState(null);
  };

  return (
    <AssessmentContext.Provider value={{
      speechScore, facialScore, cognitiveScore,
      finalScore, riskLevel,
      speechCompleted, facialCompleted, cognitiveCompleted,
      allCompleted,
      setSpeechScore, setFacialScore, setCognitiveScore,
      resetAssessment,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
