import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token'); 
    navigate('/register');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-[4.5em] shadow-sm flex items-center justify-between px-4" style={{ backgroundColor: "#A3D1C6" }}>
      <div className="flex items-center gap-2">
        <h2 className="text-gray-700 text-lg font-semibold">Welcome, Santo</h2>
      </div>
      <div className="flex items-center gap-4" ref={menuRef}>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="relative inline-block">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" onClick={() => setMenuOpen(!menuOpen)}>
            <Bell size={20} className="text-gray-700" />
            <ChevronDown size={16} className="text-gray-700" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-lg z-10">
              <div className='absolute right-0 mt-2 bg-white border rounded-lg shadow-lg'>
                <button className='w-full flex items-center gap-2 px-2 py-3 text-red-600 font-medium hover:bg-red-100 rounded-md transition' onClick={handleLogout}>
                  <LogOut size={16} />Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;