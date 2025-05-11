import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  GraduationCap, 
  Users, 
  School, 
  Book, 
  Megaphone,
  MenuIcon,
  ChevronDown, 
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/dashboard/home' },
    { 
      icon: GraduationCap, 
      label: 'Tryout', 
      path: '#', 
      children: [
        { label: 'Daftar Paket', path: '/dashboard/courses/list' },
        { label: 'Hasil Tryout', path: '/dashboard/courses/result' },
      ]
    },
    { icon: Users, label: 'Siswa', path: '/dashboard/students/list' },
    { icon: School, label: 'Perguruan Tinggi', path: '/dashboard/university/list' },
    { icon: Book, label: 'Program Studi', path: '/dashboard/major/list' },
    { icon: Megaphone, label: 'Pengumuman', path: '/dashboard/settings' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ${isOpen ? 'lg:w-64 w-20' : 'w-20'}`} style={{ background: "#00879E" }}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`font-bold text-xl transition-opacity duration-300 ${isOpen ? 'lg:block hidden' : 'hidden'}`}>
          <img 
            src="/kawalbg.png" 
            alt="Kawal PTN"
            className="absolute top-[0.2em] w-[10em] sm:w-30 md:w-30 lg:w-[5em] h-30 object-cover" 
          />
        </div>
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <MenuIcon size={24} />
        </button>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <div key={item.label} className="relative" ref={item.children ? dropdownRef : undefined}>
            {item.children ? (
              <div>
                <button 
                  className="flex items-center w-full p-3 rounded-lg transition-colors mb-1 hover:bg-gray-400"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  <item.icon size={24} />
                  <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'lg:inline hidden' : 'hidden'}`}>
                    {item.label}
                  </span>
                  {isOpen ? (
                    isDropdownOpen ? (
                      <ChevronDown size={20} className="ml-auto lg:block hidden" />
                    ) : (
                      <ChevronLeft size={20} className="ml-auto lg:block hidden" />
                    )
                  ) : null}
                </button>
                {isDropdownOpen && (
                  <div className={`
                    ${isOpen ? 'lg:ml-6 lg:static lg:bg-transparent sm:absolute left-full top-0 ml-2 min-w-[200px] p-2  sx:absolute left-full top-0 ml-2 z-50' : 'absolute left-full top-0 ml-2 z-50'} 
                    bg-[#00879E] rounded-lg 
                    ${!isOpen ? 'min-w-[200px] p-2' : ''}
                  `}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `
                          block p-2 rounded-lg transition-colors mb-1 
                          ${isActive ? 'bg-gray-900' : 'hover:bg-gray-400'}
                          ${!isOpen ? 'px-4 py-2 text-white' : ''}
                        `}
                        onClick={() => setDropdownOpen(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-colors mb-1 
                  ${isActive ? 'bg-gray-900' : 'hover:bg-gray-400'}
                `}
              >
                <item.icon size={24} />
                <span className={`ml-3 transition-opacity duration-300 ${isOpen ? 'lg:inline hidden' : 'hidden'}`}>
                  {item.label}
                </span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;