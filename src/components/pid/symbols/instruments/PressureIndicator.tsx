import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Pressure Indicator (PI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "PI" tag letters.
 * First letter P = Pressure, second letter I = Indicator.
 */
const PressureIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="PI"
    mountType="field"
    {...props}
  />
);

export default PressureIndicator;
