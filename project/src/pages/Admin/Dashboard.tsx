import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import StudentsContent from "./Student/students";
import CoursesContent from "./Courses/courses";
import MajorContent from "./Major/major";
import PtnContent from "./University/ptn";
import AnnouncementContent from "./Announcement/announcement";
import SchoolContent from "./School/school";
import PaymentContent from "./Payment/payment";
import CreateAnnouncement from "./Announcement/CreateAnnouncement";
import CreateCourses from "./Courses/CreateCourses";
import CreateUniversity from "./University/CreateUniversity";
import CreateMajor from "./Major/CreateMajor";
import CreateSchool from "./School/CreateSchool";
import CreateCapacity from "./Major/CreateCapacity";
import ScoreStudents from "./Student/CreateScore";
import UpdateAnnouncement from "./Announcement/editAnnouncement";
import UpdateCourses from "./Courses/EditCourses";
import UpdateMajor from "./Major/EditMajor";
import UpdateUniversity from "./University/EditUniversity";
import UpdateStudents from "./Student/EditStudents";
import UpdateSchool from "./School/EditSchool";
import ViewAnnouncement from "./Announcement/viewAnnouncement"
import ViewCourses from "./Courses/ViewCourses";
import ViewMajor from "./Major/ViewMajor";
import ViewPayment from "./Payment/ViewPayment";
import ViewStudents from "./Student/ViewStudents";
import ViewUniversity from "./University/ViewUniversity";
import ViewSchool from "./School/ViewSchool";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface Student {
  created_at: string;
}

interface ChartData {
  year: string;
  Jumlah: number;
}

const DashboardContent: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [totalPackets, setTotalPackets] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalUniversity, setTotalUniversity] = useState(0);
  const [totalMajor, setTotalMajor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [studentChartLoading, setStudentChartLoading] = useState(true);
  const [studentChartError, setStudentChartError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      setStudentChartLoading(true);
      setStudentChartError("");
      try {
        const response = await fetch("http://160.19.166.155:8000/admin/listStudent");
        if (!response.ok) throw new Error("Gagal mengambil data students");
        const data: Student[] = await response.json();
        setStudentData(data);
        setTotalStudents(data.length);
  
        const grouped: Record<string, number> = data.reduce<Record<string, number>>((acc, student) => {
          const year = new Date(student.created_at).getFullYear().toString();
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});
  
        const formattedChartData: ChartData[] = Object.entries(grouped)
          .map(([year, Jumlah]) => ({ year, Jumlah }))
          .sort((a, b) => a.year.localeCompare(b.year));
  
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudentChartError("Data Siswa masih kosong.");
      } finally {
        setStudentChartLoading(false);
      }
    };
    fetchStudents();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const endpoints = [
        { url: "http://160.19.166.155:8000/admin/listPacket", setter: setTotalPackets },
        { url: "http://160.19.166.155:8000/admin/listUniversity", setter: setTotalUniversity },
        { url: "http://160.19.166.155:8000/admin/listMajor", setter: setTotalMajor },
      ];
  
      for (const { url, setter } of endpoints) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error("Gagal mengambil data");
          const data = await response.json();
          setter(data.length);
          console.log(totalPackets);
        } catch (error) {
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);  

  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div className="p-4">
      <h1 className="mt-[-1em] text-2xl mb-6 sm:text-lg">{`${formattedDate} ${formattedTime}`}</h1>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[{
          title: "Paket TryOut",
          value: totalPackets,
        }, {
          title: "Jumlah Siswa",
          value: totalStudents,
        }, {
          title: "Perguruan Tinggi Negeri",
          value: totalUniversity,
        }, {
          title: "Program Studi",
          value: totalMajor,
        }].map(({ title, value }) => (
          <div key={title} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">{title}</h3>
            {loading ? (
              <p className="text-lg text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-lg text-red-500">{error}</p>
            ) : (
              <p className="text-3xl font-bold text-indigo-600">{value.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Jumlah Siswa per Tahun</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        {studentChartLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : studentChartError ? (
          <p className="text-red-500">{studentChartError}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Jumlah" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "lg:ml-64 ml-20" : "ml-20"}`}>
        <Navbar />
        <Breadcrumbs />
        <Routes>
          <Route path="/home" element={<DashboardContent />} />
          <Route path="/courses/list" element={<CoursesContent />} />
          <Route path="/courses/tambahPaket" element={<CreateCourses />} />
          <Route path="/courses/editPaket/:id" element={<UpdateCourses />} />
          <Route path="/courses/viewPaket/:id" element={<ViewCourses />} />
          <Route path="/students/list" element={<StudentsContent />} />
          <Route path="/students/viewSiswa/:username/:id" element={<ViewStudents />} />
          <Route path="/students/editSiswa/:username" element={<UpdateStudents />} />
          <Route path="/score/tambahNilai/:username" element={<ScoreStudents />} />
          <Route path="/university/list" element={<PtnContent />} />
          <Route path="/university/tambahPtn" element={<CreateUniversity />} />
          <Route path="/university/editPtn/:id_ptn" element={<UpdateUniversity />} />
          <Route path="/university/viewPtn/:id_ptn" element={<ViewUniversity />} />
          <Route path="/major/list" element={<MajorContent />} />
          <Route path="/major/tambahMajor" element={<CreateMajor />} />
          <Route path="/major/editMajor/:id_prodi" element={<UpdateMajor />} />
          <Route path="/major/viewMajor/:id_prodi" element={<ViewMajor />} />
          <Route path="/major/capacity/tambahCapacity/:id_prodi" element={<CreateCapacity />} />
          <Route path="/announcement/list" element={<AnnouncementContent />} />
          <Route path="/announcement/createAnnouncement" element={<CreateAnnouncement />} />
          <Route path="/announcement/viewAnnouncement/:id" element={<ViewAnnouncement />} />
          <Route path="/announcement/editAnnouncement/:id" element={<UpdateAnnouncement />} />
          <Route path="/school/list" element={<SchoolContent />} />
          <Route path="/school/createSchool" element={<CreateSchool />} />
          <Route path="/school/viewSchool/:id" element={<ViewSchool />} />
          <Route path="/school/editSchool/:id" element={<UpdateSchool />} />
          <Route path="/payment/list" element={<PaymentContent />} />
          <Route path="/payment/viewPayment/:id" element={<ViewPayment />} />
          <Route path="/payment/viewPayment/:id" element={<ViewPayment />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
