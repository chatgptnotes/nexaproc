import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Flow Indicator (FI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "FI" tag letters.
 * First letter F = Flow, second letter I = Indicator.
 */
const FlowIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="FI"
    mountType="field"
    {...props}
  />
);

export default FlowIndicator;
