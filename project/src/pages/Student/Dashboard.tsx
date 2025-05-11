import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Breadcrumbs from "./components/Breadcrumbs";
import Paket from "./Paket";
import Profil from "./Profil";
import HasilTryout from "./HasilTryout";
import Tryout from "./Tryout";
import DetailTryout from "./DetailTryout";
import AnnouncementContent from "./Announcement/announcement";
import ViewAnnouncement from "./Announcement/viewAnnouncement"
import EditProfil from "./editProfil";
import axios from 'axios';
import Highcharts, { chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const DashboardContent = () => {
  const [time, setTime] = useState(new Date());
  const [userId, setUserId] = useState<number | null>(null);
  const [namaPaket, setNamaPaket] = useState<string | null>(null);
  const [scores, setScores] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/student/profile", {
          withCredentials: true,
        });
        setUserId(response.data.data.id);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchUserScores = async () => {
      if (userId !== null) {
        try {
          const response = await axios.get(`http://localhost:8000/admin/viewScorePacket/${userId}`, {
            withCredentials: true,
          });
          setScores(response.data);
          setNamaPaket(response.data.nama_paket);
          const tahunTersedia = Object.keys(response.data);
          if (tahunTersedia.length > 0) {
            setSelectedYear(tahunTersedia[0]);
          }
        } catch (error) {
          console.error("Gagal mengambil data nilai siswa:", error);
        }
      }
    };
    fetchUserScores();
  }, [userId]);

  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-GB", { hour12: false });

  const chartOptions = useMemo(() => {
    if (!scores || !selectedYear || !scores[selectedYear]) return null;
  
    const data = Object.entries(scores[selectedYear]);
    const categories = data.map(([namaPaket]) => `Paket ${namaPaket}`);
  
    const dataSeries = {
      lbe: [], lbi: [], pbm: [], pk: [], pm: [], ppu: [], pu: [], total: [],
    };
  
    data.forEach(([_, nilai]: any) => {
      Object.keys(dataSeries).forEach((key) => {
        dataSeries[key].push(nilai[key] ?? 0);
      });
    });
  
    const series = Object.entries(dataSeries).map(([name, data]) => ({
      name, data,
    }));
  
    return {
      chart: {
        type: "column",
      },
      title: {
        text: `Grafik Nilai Tryout Tahun ${selectedYear}`,
      },
      xAxis: {
        categories,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Nilai",
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series,
      exporting: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
    };
  }, [scores, selectedYear]);

  return (
    <div className="p-6">
      <div className="mb-4 mt-[-1.4em]">
        <h1 className="text-xl sm:text-lg text-gray-600">{`${formattedDate} ${formattedTime}`}</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">Selamat Datang di Aplikasi Kawal PTN</h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-1">
          Pilih Tahun:
        </label>
        <select
          id="tahun"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="mt-1 block w-40 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
        >
          {scores && Object.keys(scores).map((tahun) => (
            <option key={tahun} value={tahun}>
              {tahun}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Grafik Nilai Tryout Tahun {selectedYear}
        </h3>
        {chartOptions ? (
          <HighchartsReact
          key={selectedYear}
          highcharts={Highcharts}
          options={chartOptions}
        />
        ) : (
          <p className="text-gray-500">Tidak ada data untuk tahun ini.</p>
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
          <Route path="/paket" element={<Paket />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/hasiltryout" element={<HasilTryout />} />
          <Route path="/tryout" element={<Tryout />} />
          <Route path="/tryout/detailtryout/:id" element={<DetailTryout />} />
          <Route path="/announcement" element={<AnnouncementContent />} />
          <Route path="/profil/editprofil" element={<EditProfil />} />
          <Route path="/announcement/:id" element={<ViewAnnouncement />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;