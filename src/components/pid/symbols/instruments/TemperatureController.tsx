import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Temperature Indicating Controller (TIC) — ISA 5.1
 * Panel-mounted instrument. Circle with horizontal line through center.
 * First letter T = Temperature, I = Indicator, C = Controller.
 */
const TemperatureController: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="TIC"
    mountType="panel"
    {...props}
  />
);

export default TemperatureController;
