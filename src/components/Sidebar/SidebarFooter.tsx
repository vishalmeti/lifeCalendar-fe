// filepath: /Users/vishalmeti/Projects/LifeCalendar/lifeCalendar-fe/src/components/SidebarFooter.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarFooterProps {
  user: any;
  onLogout: () => void;
}

const SidebarFooter = ({ user, onLogout }: SidebarFooterProps) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
          <User className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
        </div>
      </div>
      <Button
        onClick={onLogout}
        variant="outline"
        className="w-full text-sm"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default SidebarFooter;
