import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Level Safety Low (LSL) — ISA 5.1
 * Field-mounted safety low alarm instrument.
 * Circle with "LSL" tag letters.
 * L = Level, S = Safety, L = Low.
 * Trips on low level to protect pumps from dry running.
 */
const LevelSafetyLow: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="LSL"
    mountType="field"
    {...props}
  />
);

export default LevelSafetyLow;
