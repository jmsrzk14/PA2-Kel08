import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
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
import PersebaranContent from "./persebaran";
import axios from 'axios';
import Highcharts, { chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TryoutItem {
  id: number;
  id_paket: number;
  nama_paket: string;
}

const DashboardContent = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [userId, setUserId] = useState<number | null>(null);
  const [namaPaket, setNamaPaket] = useState<string | null>(null);
  const [scores, setScores] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [data, setData] = useState<TryoutItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailedScores, setDetailedScores] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://52.205.255.169/student/profile", {
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
          const response = await axios.get(`https://52.205.255.169/admin/viewScorePacket/${userId}`, {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://52.205.255.169/student/myPacket", {
          withCredentials: true,
        });

        const packets = response.data;

        const packetsWithNames = await Promise.all(
          packets.map(async (packet: { id: string; id_paket: number }) => {
            try {
              const paketResponse = await axios.get(
                `https://52.205.255.169/admin/viewPacket/${packet.id_paket}`
              );
              return {
                ...packet,
                nama_paket: paketResponse.data.packet.nama_paket,
              };
            } catch (error) {
              console.error(`Gagal ambil paket ${packet.id_paket}`, error);
              return {
                ...packet,
                nama_paket: "Nama Paket Tidak Ditemukan",
              };
            }
          })
        );

        setData(packetsWithNames);

        if (userId && selectedYear) {
          const allDetails = await Promise.all(
            packetsWithNames.map(async (packet: any) => {
              try {
                console.log(selectedYear, userId, packet.id_paket);
                const detailRes = await axios.get(
                  `https://52.205.255.169/admin/viewScoreDetail/${selectedYear}/${userId}/${packet.id_paket}`,
                  { withCredentials: true }
                );
                return {
                  id_paket: packet.id_paket,
                  nama_paket: packet.nama_paket,
                  nilai: detailRes.data[0] ?? {}
                };
              } catch (error) {
                console.error(`Gagal ambil nilai untuk paket ${packet.id_paket}`, error);
                return {
                  id_paket: packet.id_paket,
                  nama_paket: packet.nama_paket,
                  nilai: null,
                };
              }
            })
          );
          setDetailedScores(allDetails);
        }

      } catch (error) {
        console.error("Error fetching tryout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedYear]);


  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-GB", { hour12: false });

  const jenisUjianChartOptions = useMemo(() => {
  if (!scores || !selectedYear || !scores[selectedYear]) return null;

  const data = Object.entries(scores[selectedYear]);
  const categories = data.map(([namaPaket]) => `Paket ${namaPaket}`);

  const dataSeries: { [key: string]: number[] } = {
    pu: [],
    ppu: [],
    pbm: [],
    pm: [],
    lbi: [],
    lbe: [],
    pk: [],
  };

  data.forEach(([_, nilai]: any) => {
    Object.keys(dataSeries).forEach((key) => {
      dataSeries[key].push(nilai[key] ?? 0);
    });
  });

  const series = Object.entries(dataSeries).map(([key, values]) => ({
    name: key.toUpperCase(),
    data: values,
  }));

  return {
    chart: {
      type: 'line',
    },
    title: {
      text: `Nilai Benar per Mata Pelajaran Tahun ${selectedYear}`,
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nilai"
      }
    },
    series: series,
    tooltip: {
      shared: true,
      crosshairs: true,
      valueSuffix: ' poin',
    },
    credits: {
      enabled: false
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    },
  };
}, [scores, selectedYear]);


  const chartOptions = useMemo(() => {
    if (!scores || !selectedYear || !scores[selectedYear]) return null;
  
    const data = Object.entries(scores[selectedYear]);
    const categories = data.map(([namaPaket]) => `Paket ${namaPaket}`);
  
    const dataSeries = {
      total: [],
    };
    
    data.forEach(([_, nilai]: any) => {
      Object.keys(dataSeries).forEach((key) => {
        dataSeries[key].push(nilai[key] ?? 0);
      });
    });
  
    return {
      chart: {
        zoomType: 'xy',
      },
      title: {
        text: `Grafik Nilai Tryout Tahun ${selectedYear}`,
      },
      xAxis: {
        categories: categories,
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
        line: {
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
          marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle',
          },
        }
      },
      series: [
        {
          type: 'column',
          name: 'Nilai Tryout',
          data: dataSeries.total,
          color: '#8A2BE2'
        },
        {
          type: 'line',
          name: '',
          data: dataSeries.total, 
          color: '#FF69B4'
        }
      ],
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Grafik Nilai Tryout Tahun {selectedYear}
          </h3>
          {chartOptions ? (
            <HighchartsReact key={selectedYear} highcharts={Highcharts} options={chartOptions} />
          ) : (
            <p className="text-gray-500">Tidak ada data untuk tahun ini.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Grafik Nilai per Jenis Ujian Tahun {selectedYear}
          </h3>
          {jenisUjianChartOptions ? (
            <HighchartsReact key={selectedYear + "-jenis"} highcharts={Highcharts} options={jenisUjianChartOptions} />
          ) : (
            <p className="text-gray-500">Tidak ada data jenis ujian untuk tahun ini.</p>
          )}
        </div>
      </div>   

      <div className="mx-auto p-6 rounded">
        <h2 className="text-lg font-bold mb-4 text-gray-800">NILAI SISWA</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nama Paket</th>
                <th className="border border-gray-300 px-4 py-2">PU</th>
                <th className="border border-gray-300 px-4 py-2">PPU</th>
                <th className="border border-gray-300 px-4 py-2">PBM</th>
                <th className="border border-gray-300 px-4 py-2">PM</th>
                <th className="border border-gray-300 px-4 py-2">LBI</th>
                <th className="border border-gray-300 px-4 py-2">LBE</th>
                <th className="border border-gray-300 px-4 py-2">PK</th>
                <th className="border border-gray-300 px-4 py-2">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {detailedScores.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Tidak ada data nilai tryout.
                  </td>
                </tr>
              ) : (
                detailedScores.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2 font-bold">{item.nama_paket}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.pu ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.ppu ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.pbm ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.pm ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.lbi ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.lbe ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nilai?.pk ?? 0}</td>
                    <td className="border border-gray-300 px-4 py-2 font-bold">{item.nilai?.total ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
          <Route path="/persebaran" element={<PersebaranContent />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;