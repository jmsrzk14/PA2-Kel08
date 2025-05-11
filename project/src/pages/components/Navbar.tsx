import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [idUsers, setIdUsers] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('token'); 
    navigate('/loginsiswa');
  };

  useEffect(() => {
      setMenuOpen(false);
    }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:8000/admin/profile`, {
          withCredentials: true,
        });
  
        const data = response.data;
        console.log("Data dari API:", data);
  
        setIdUsers(data.id);
        setNama(data.nama);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <div className="h-[4.5em] shadow-sm flex items-center justify-between px-4" style={{ backgroundColor: "#A3D1C6" }}>
      <div className="flex items-center gap-2">
        <h2 className="text-gray-700 text-lg font-semibold">Welcome, {nama}</h2>
      </div>
      <div className="flex items-center gap-4" ref={menuRef}>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="relative inline-block">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" onClick={() => setMenuOpen(!menuOpen)}>
            <User size={20} className="text-gray-700" />
            <ChevronDown size={16} className="text-gray-700" />
          </button>
          {menuOpen && (
            <div className='absolute right-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[250px]'>
              <div className='px-5 py-3 border-b'>
                <p className='text-md text-gray-700'>{nama}</p>
              </div>
                <button className='w-full flex items-center gap-2 px-2 py-3 text-red-600 font-medium hover:bg-red-100 rounded-md transition' onClick={handleLogout}>
                  <LogOut size={16} />Log Out
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;