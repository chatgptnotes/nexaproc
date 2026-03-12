import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Temperature Transmitter (TT) — ISA 5.1
 * Field-mounted instrument. Plain circle with "TT" tag letters.
 * First letter T = Temperature, second letter T = Transmitter.
 */
const TemperatureTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="TT"
    mountType="field"
    {...props}
  />
);

export default TemperatureTransmitter;
