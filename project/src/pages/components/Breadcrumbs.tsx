import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const breadcrumbMap: { [key: string]: string } = {
  dashboard: "Dashboard",
  home: "Home",
  courses: "Courses",
  university: "PTN",
  major: "Program Studi",
  school: "Sekolah",
  tambahPaket: "Tambah Paket",
  viewPaket: "Detail Paket",
  editPaket: "Update Paket",
  viewSiswa: "Detail Siswa",
  editSiswa: "Update Siswa",
  tambahPtn: "Tambah PTN",
  viewPtn: "Detail PTN",
  editPtn: "Update PTN",
  tambahMajor: "Tambah Prodi",
  viewMajor: "Detail Prodi",
  editMajor: "Update Prodi",
  createSchool: "Tambah Sekolah",
  viewSchool: "Detail Sekolah",
  editSchool: "Update Sekolah",
  viewPayment: "Detail Pembayaran",
  createAnnouncement: "Tambah Pengumuman",
  viewAnnouncement: "Detail Pengumuman",
  editAnnouncement: "Update Pengumuman",
  capacity: "Daya Tampung",
  tambahCapacity: "Tambah Daya Tampung",
  score: "Nilai",
  tambahNilai: "Tambah Nilai",
  createNews: "Tambah Berita",
  viewNews: "Detail Berita",
  editNews: "Update Berita",
  createTesti: "Tambah Berita",
  viewTesti: "Detail Berita",
  editTesti: "Update Berita"
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [packageName, setPackageName] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [ptnName, setPtnName] = useState<string | null>(null);
  const [majorName, setMajorName] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [announcementName, setAnnouncementName] = useState<string | null>(null);
  const [newsName, setNewsName] = useState<string | null>(null);
  const [testiName, setTestiName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackageName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewPacket/${id}`);
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
        const response = await fetch(`https://52.205.255.169/admin/viewStudent/${username}`);
        if (response.ok) {
          const data = await response.json();
          setStudentName(data.first_name);
        }
      } catch (error) {
        console.error("Failed to fetch student name", error);
      }
    };

    const fetchPtnName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewUniversity/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPtnName(data.nama_ptn);
        }
      } catch (error) {
        console.error("Failed to fetch PTN name", error);
      }
    };

    const fetchMajorName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewMajor/${id}`);
        if (response.ok) {
          const data = await response.json();
          setMajorName(data.nama_prodi_ptn);
        }
      } catch (error) {
        console.error("Failed to fetch PTN name", error);
      }
    };

    const fetchSchoolName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewSekolah/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSchoolName(data.sekolah);
        }
      } catch (error) {
        console.error("Failed to fetch PTN name", error);
      }
    };

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

    const fetchNewsName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewNews/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNewsName(data.judul);
        }
      } catch (error) {
        console.error("Failed to fetch News name", error);
      }
    };

    const fetchTestiName = async (id: string) => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewTesti/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTestiName(data.nama);
        }
      } catch (error) {
        console.error("Failed to fetch Testi name", error);
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
    if (pathnames.length > 2 && pathnames[1] === "university" && pathnames[2] === "viewPtn") {
      fetchPtnName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "university" && pathnames[2] === "editPtn") {
      fetchPtnName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "major" && pathnames[2] === "viewMajor") {
      fetchMajorName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "major" && pathnames[2] === "editMajor") {
      fetchMajorName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "school" && pathnames[2] === "viewSchool") {
      fetchSchoolName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "school" && pathnames[2] === "editSchool") {
      fetchSchoolName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "announcement" && pathnames[2] === "viewAnnouncement") {
      fetchAnnouncementName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "announcement" && pathnames[2] === "editAnnouncement") {
      fetchAnnouncementName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[2] === "capacity" && pathnames[3] === "tambahCapacity") {
      fetchMajorName(pathnames[4]);
    }
    if (pathnames.length > 2 && pathnames[2] === "capacity" && pathnames[3] === "tambahCapacity") {
      fetchMajorName(pathnames[4]);
    }
    if (pathnames.length > 2 && pathnames[1] === "score" && pathnames[2] === "tambahNilai") {
      fetchStudentName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "news" && pathnames[2] === "viewNews") {
      fetchNewsName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "news" && pathnames[2] === "editNews") {
      fetchNewsName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "testimoni" && pathnames[2] === "viewTesti") {
      fetchTestiName(pathnames[3]);
    }
    if (pathnames.length > 2 && pathnames[1] === "testimoni" && pathnames[2] === "editTesti") {
      fetchTestiName(pathnames[3]);
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

          if (name.match(/\d+/) && ptnName && pathnames[index] === "editPtn" ) {
            displayName = ptnName;
          }

          if (name.match(/\d+/) && ptnName && pathnames[index] === "viewPtn" ) {
            displayName = ptnName;
          }

          if (name.match(/\d+/) && majorName && pathnames[index] === "editMajor" ) {
            displayName = majorName;
          }

          if (name.match(/\d+/) && majorName && pathnames[index] === "viewMajor" ) {
            displayName = majorName;
          }

          if (name.match(/\d+/) && schoolName && pathnames[index] === "editSchool" ) {
            displayName = schoolName;
          }

          if (name.match(/\d+/) && schoolName && pathnames[index] === "viewSchool" ) {
            displayName = schoolName;
          }

          if (name.match(/\d+/) && announcementName && pathnames[index] === "editAnnouncement" ) {
            displayName = announcementName;
          }

          if (name.match(/\d+/) && announcementName && pathnames[index] === "viewAnnouncement" ) {
            displayName = announcementName;
          }

          if (name.match(/\d+/) && majorName && pathnames[index] === "tambahCapacity" ) {
            displayName = majorName;
          }

          if (name.match(/\d+/) && studentName && pathnames[index] === "tambahNilai" ) {
            displayName = studentName;
          }

          if (name.match(/\d+/) && newsName && pathnames[index] === "editNews" ) {
            displayName = newsName;
          }

          if (name.match(/\d+/) && newsName && pathnames[index] === "viewNews" ) {
            displayName = newsName;
          }

          if (name.match(/\d+/) && testiName && pathnames[index] === "editTesti" ) {
            displayName = testiName;
          }

          if (name.match(/\d+/) && testiName && pathnames[index] === "viewTesti" ) {
            displayName = testiName;
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
