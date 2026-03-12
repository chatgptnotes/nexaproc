import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Flow Transmitter (FT) — ISA 5.1
 * Field-mounted instrument. Plain circle with "FT" tag letters.
 * First letter F = Flow, second letter T = Transmitter.
 */
const FlowTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="FT"
    mountType="field"
    {...props}
  />
);

export default FlowTransmitter;
