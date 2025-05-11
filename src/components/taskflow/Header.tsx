import type React from 'react';
import { Button } from '@/components/ui/button';
import { GanttChartSquare } from 'lucide-react';

interface HeaderProps {
  onLoadDemoData: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoadDemoData }) => {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GanttChartSquare size={32} />
          <h1 className="text-2xl font-bold">TaskFlow</h1>
        </div>
        <Button variant="secondary" onClick={onLoadDemoData}>
          Load Demo Data
        </Button>
      </div>
    </header>
  );
};

export default Header;
