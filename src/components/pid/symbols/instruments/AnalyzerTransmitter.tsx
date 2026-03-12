import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Analyzer Transmitter (AT) — ISA 5.1
 * Field-mounted instrument. Plain circle with "AT" tag letters.
 * First letter A = Analysis, second letter T = Transmitter.
 */
const AnalyzerTransmitter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="AT"
    mountType="field"
    {...props}
  />
);

export default AnalyzerTransmitter;
