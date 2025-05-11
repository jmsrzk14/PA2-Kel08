import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [idStudent, setIdStudent] = useState('');
  const [nama, setNama] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/loginsiswa');
  };

  const handleProfile = () => {
    navigate('/dashboard/student/profil');
  }

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:8000/student/profile`, {
          withCredentials: true,
        });

        const data = response.data;
        console.log("Data dari API:", data);

        setIdStudent(data.data.id);
        setNama(data.data.first_name);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);
  
  return (
    <div className="h-[4.5em] shadow-sm flex items-center justify-between px-4" style={{ backgroundColor: "#A3D1C6" }}>
      <div className="flex items-center gap-2">
        <h2 className="text-gray-700 text-lg font-semibold">Welcome, {nama}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="relative inline-block">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" onClick={() => setIsOpen(!isOpen)}>
            <User size={20} className="text-gray-700" />
            <ChevronDown size={16} className="text-gray-700" />
          </button>
          {isOpen && (
            <div className='absolute right-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[250px]'>
              <div className='px-5 py-3 border-b'>
                <p className='text-md text-gray-700'>{nama}</p>
              </div>
              <div className='px-5 py-3 border-b'>
                <button className='w-full flex items-center gap-2 py-2 text-black-600 font-medium hover:bg-black-100 rounded-md transition-all duration-200' onClick={handleProfile}>
                  <User size={16} /> Profile
                </button>
              </div>
              <button className='w-full flex items-center gap-2 px-5 py-2 text-red-600 font-medium hover:bg-red-100 rounded-md transition-all duration-200' onClick={handleLogout}>
                <LogOut size={16} />LogOut
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;