import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Analyzer Indicator (AI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "AI" tag letters.
 * First letter A = Analysis (pH, conductivity, O2, etc.),
 * second letter I = Indicator.
 */
const AnalyzerIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="AI"
    mountType="field"
    {...props}
  />
);

export default AnalyzerIndicator;
