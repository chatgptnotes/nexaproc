import React from 'react';
import InstrumentBubble, { SymbolProps } from './InstrumentBubble';

export interface FlowSwitchProps extends SymbolProps {
  /** Switch type: 'low' renders FSL, 'high' renders FSH */
  switchType?: 'low' | 'high';
}

/**
 * Flow Switch (FSL / FSH) — ISA 5.1
 * Field-mounted flow switch.
 * F = Flow, S = Switch, L = Low or H = High.
 * Provides discrete signal when flow falls below or exceeds setpoint.
 */
const FlowSwitch: React.FC<FlowSwitchProps> = ({
  switchType = 'low',
  ...props
}) => (
  <InstrumentBubble
    tagLetters={switchType === 'high' ? 'FSH' : 'FSL'}
    mountType="field"
    {...props}
  />
);

export default FlowSwitch;
