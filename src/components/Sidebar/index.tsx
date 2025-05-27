/* eslint-disable @typescript-eslint/no-explicit-any */

import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';
import { Button } from '@/components/ui/button'; // Import Button
import { X } from 'lucide-react'; // Import X icon

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
  onLogout: () => void;
  isOpen: boolean; // Add isOpen prop
  onClose: () => void; // Add onClose prop for mobile
}

const Sidebar = ({ activeSection, onSectionChange, user, onLogout, isOpen, onClose }: SidebarProps) => {
  if (!isOpen) {
    return null; // Don't render if not open
  }
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center md:hidden p-2"> {/* Header for mobile with close button */}
        <span className="text-lg font-semibold">Menu</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <SidebarHeader />
      <SidebarNav activeSection={activeSection} onSectionChange={onSectionChange} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </div>
  );
};

export default Sidebar;
