import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Temperature Indicator (TI) — ISA 5.1
 * Field-mounted instrument. Plain circle with "TI" tag letters.
 * First letter T = Temperature, second letter I = Indicator.
 */
const TemperatureIndicator: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="TI"
    mountType="field"
    {...props}
  />
);

export default TemperatureIndicator;
