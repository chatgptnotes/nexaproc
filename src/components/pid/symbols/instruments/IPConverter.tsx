import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * I/P Converter — ISA 5.1
 * Current-to-pneumatic converter. Field-mounted instrument.
 * Circle with "I/P" tag letters. Converts 4–20 mA signal to
 * 3–15 psi pneumatic output.
 */
const IPConverter: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="I/P"
    mountType="field"
    {...props}
  />
);

export default IPConverter;
