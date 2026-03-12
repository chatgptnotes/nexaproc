import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Temperature Safety High (TSH) — ISA 5.1
 * Field-mounted safety high alarm instrument.
 * Circle with "TSH" tag letters.
 * T = Temperature, S = Safety, H = High.
 * Trips on high temperature to protect equipment.
 */
const TemperatureSafetyHigh: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="TSH"
    mountType="field"
    {...props}
  />
);

export default TemperatureSafetyHigh;
