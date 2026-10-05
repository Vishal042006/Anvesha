import React from 'react';
import { OverviewPage } from './OverviewPage';
import type { SectionId } from '../components/layout/Sidebar';

interface CommandCenterPageProps {
  onNavigate: (section: SectionId) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({ onNavigate }) => {
  return <OverviewPage onNavigate={onNavigate} />;
};
