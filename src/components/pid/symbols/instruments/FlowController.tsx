import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

/**
 * Flow Indicating Controller (FIC) — ISA 5.1
 * Panel-mounted instrument. Circle with horizontal line through center.
 * First letter F = Flow, I = Indicator, C = Controller.
 */
const FlowController: React.FC<SymbolProps> = (props) => (
  <InstrumentBubble
    tagLetters="FIC"
    mountType="panel"
    {...props}
  />
);

export default FlowController;
