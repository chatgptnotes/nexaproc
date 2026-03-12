import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Weight Transmitter (WT) — ISA 5.1
 * Field-mounted instrument. Plain circle with "WT" tag letters.
 * First letter W = Weight/Force, second letter T = Transmitter.
 */
const WeightTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="WT"
    mountType="field"
    {...props}
  />
);

export default WeightTransmitter;
