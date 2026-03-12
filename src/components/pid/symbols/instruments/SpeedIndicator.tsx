import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Speed Indicator (SI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "SI" tag letters.
 * First letter S = Speed, second letter I = Indicator.
 */
const SpeedIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="SI"
    mountType="field"
    {...props}
  />
);

export default SpeedIndicator;
