import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const breadcrumbMap: { [key: string]: string } = {
  dashboard: "Dashboard",
  home: "Home",
  courses: "Courses",
  tambahPaket: "Tambah Paket",
  viewPaket: "Detail Paket",
  editPaket: "Update Paket",
  viewSiswa: "Detail Siswa",
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackageName = async (id: string) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/courses/view/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPackageName(data.nama_paket);
        }
      } catch (error) {
        console.error("Failed to fetch package name", error);
      }
    };

    const fetchStudentName = async (username: string) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/students/view/${username}`);
        if (response.ok) {
          const data = await response.json();
          setStudentName(data.first_name);
        }
      } catch (error) {
        console.error("Failed to fetch student name", error);
      }
    };

    if (pathnames.length > 2 && pathnames[1] === "students" && pathnames[2] === "viewSiswa") {
      fetchStudentName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "students" && pathnames[2] === "editSiswa") {
      fetchStudentName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "courses" && pathnames[2] === "viewPaket") {
      fetchPackageName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "courses" && pathnames[2] === "editPaket") {
      fetchPackageName(pathnames[3]);
    }
  }, [pathnames]);

  return (
    <div className="px-4 py-2 bg-gray-50">
      <div className="flex items-center text-sm">
        <Link to="/dashboard/home" className="text-indigo-600 hover:text-indigo-800">
          Dashboard
        </Link>
        {pathnames.slice(1).map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
          let displayName = breadcrumbMap[name] || name;

          if (name.match(/\d+/) && packageName && pathnames[index] === "editPaket" ) {
            displayName = packageName;
          }

          if (name.match(/\d+/) && packageName && pathnames[index] === "viewPaket" ) {
            displayName = packageName;
          }

          if (name.match(/\d+/) && studentName && pathnames[index] === "editSiswa" ) {
            displayName = studentName;
          }

          if (name.match(/\d+/) && studentName && pathnames[index] === "viewSiswa" ) {
            displayName = studentName;
          }

          return (
            <React.Fragment key={name}>
              <ChevronRight size={16} className="mx-1 text-gray-400" />
              <span className="capitalize text-gray-600">
                <Link to={routeTo} className="text-indigo-600 hover:text-indigo-800">
                  {displayName}
                </Link>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumbs;
