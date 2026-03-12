import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Level Transmitter (LT) — ISA 5.1
 * Field-mounted instrument. Plain circle with "LT" tag letters.
 * First letter L = Level, second letter T = Transmitter.
 */
const LevelTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="LT"
    mountType="field"
    {...props}
  />
);

export default LevelTransmitter;
