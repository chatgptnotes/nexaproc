import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Level Indicating Controller (LIC) — ISA 5.1
 * Panel-mounted instrument. Circle with horizontal line through center.
 * First letter L = Level, I = Indicator, C = Controller.
 */
const LevelController: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="LIC"
    mountType="panel"
    {...props}
  />
);

export default LevelController;
