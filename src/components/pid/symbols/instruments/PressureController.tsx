import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Pressure Indicating Controller (PIC) — ISA 5.1
 * Panel-mounted instrument. Circle with horizontal line through center.
 * First letter P = Pressure, I = Indicator, C = Controller.
 */
const PressureController: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="PIC"
    mountType="panel"
    {...props}
  />
);

export default PressureController;
