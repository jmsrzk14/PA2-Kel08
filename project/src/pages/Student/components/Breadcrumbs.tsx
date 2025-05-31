import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const breadcrumbMap: { [key: string]: string } = {
  dashboard: "Dashboard",
  home: "Home",
  announcement: "Pengumuman",
  viewAnnouncement: "Detail Pengumuman",
  editAnnouncement: "Update Pengumuman",
  detailtryout: "Detail Tryout",
  editprofil: "Edit Profil",
  hasiltryout: "Simulasi",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [announcementName, setAnnouncementName] = useState<string | null>(null);
  const [namaPaket, setNamaPaket] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncementName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewAnnouncement/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAnnouncementName(data.judul);
        }
      } catch (error) {
        console.error("Failed to fetch Announcement name", error);
      }
    };
    
    const fetchTryoutName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewPayment/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNamaPaket(data.id_paket);
        }
      } catch (error) {
        console.error("Failed to fetch Announcement name", error);
      }
    };

    if (pathnames.length > 3 && pathnames[2] === "announcement") {
      fetchAnnouncementName(pathnames[3]);
    }
    if (pathnames.length > 3 && pathnames[2] === "announcement") {
      fetchAnnouncementName(pathnames[3]);
    }
    if (pathnames.length > 4 && pathnames[3] === "detailtryout") {
      fetchTryoutName(pathnames[4]);
    }
  }, [pathnames]);

  return (
    <div className="px-4 py-2 bg-gray-50">
      <div className="flex items-center text-sm">
        <Link to="/dashboard/student/home" className="text-indigo-600 hover:text-indigo-800">
          Dashboard
        </Link>
        {pathnames.slice(1).map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
          let displayName = breadcrumbMap[name] || name;

          if (name.match(/\d+/) && announcementName) {
            displayName = announcementName;
          }

          if (name.match(/\d+/) && namaPaket) {
            displayName = namaPaket;
          }

          return (
            <React.Fragment key={name}>
              <ChevronRight size={16} className="mx-1 text-gray-400" />
              <span className="capitalize text-gray-600">
                {displayName}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumbs;
