import React from 'react';
import { CommandCenter } from '@/components/command-center/CommandCenter';

export const metadata = {
  title: 'PolarOne | Antarctic Operations Command Center',
  description: 'Single-pane-of-glass operational monitoring and decision-support command center for Antarctic expeditions, maritime fleet, research stations, and environmental hazards.',
};

export default function CommandCenterPage() {
  return <CommandCenter />;
}
