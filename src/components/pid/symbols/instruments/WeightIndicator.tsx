import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Weight Indicator (WI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "WI" tag letters.
 * First letter W = Weight/Force, second letter I = Indicator.
 */
const WeightIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="WI"
    mountType="field"
    {...props}
  />
);

export default WeightIndicator;
