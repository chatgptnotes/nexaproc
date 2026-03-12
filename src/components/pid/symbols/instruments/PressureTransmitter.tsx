import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Pressure Transmitter (PT) — ISA 5.1
 * Field-mounted instrument. Plain circle with "PT" tag letters.
 * First letter P = Pressure, second letter T = Transmitter.
 */
const PressureTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="PT"
    mountType="field"
    {...props}
  />
);

export default PressureTransmitter;
