// filepath: /Users/vishalmeti/Projects/LifeCalendar/lifeCalendar-fe/src/components/SidebarNav.tsx
import { Calendar, BookOpen, MessageCircle, CalendarDays, LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Daily Entries', icon: Calendar },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'storybook', label: 'Storybook', icon: BookOpen },
  // { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
];

const SidebarNav = ({ activeSection, onSectionChange }: SidebarNavProps) => {
  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNav;
