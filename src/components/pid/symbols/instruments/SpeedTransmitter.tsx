import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Speed Transmitter (ST) — ISA 5.1
 * Field-mounted instrument. Plain circle with "ST" tag letters.
 * First letter S = Speed, second letter T = Transmitter.
 */
const SpeedTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="ST"
    mountType="field"
    {...props}
  />
);

export default SpeedTransmitter;
