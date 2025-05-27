/* eslint-disable @typescript-eslint/no-explicit-any */

import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
  onLogout: () => void;
}

const Sidebar = ({ activeSection, onSectionChange, user, onLogout }: SidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <SidebarHeader />
      <SidebarNav activeSection={activeSection} onSectionChange={onSectionChange} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </div>
  );
};

export default Sidebar;
