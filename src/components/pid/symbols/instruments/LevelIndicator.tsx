import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Level Indicator (LI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "LI" tag letters.
 * First letter L = Level, second letter I = Indicator.
 */
const LevelIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="LI"
    mountType="field"
    {...props}
  />
);

export default LevelIndicator;
