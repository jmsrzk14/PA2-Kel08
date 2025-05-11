import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

const LihatSiswa = () => {
  const { username, id } = useParams();
  const [activeTab, setActiveTab] = useState('dataDiri');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nisn, setNisn] = useState(0);
  const [active, setActive] = useState(0);
  const [kelompokUjian, setKelompokUjian] = useState('');
  const [noUtbk, setNoUtbk] = useState(0);
  const [grade, setGrade] = useState('');
  const [namaSekolah, setNamaSekolah] = useState('');
  const [pilihan1Utbk, setPilihan1Utbk] = useState('');
  const [pilihan2Utbk, setPilihan2Utbk] = useState('');
  const [pilihan1UtbkAktual, setPilihan1UtbkAktual] = useState('');
  const [pilihan2UtbkAktual, setPilihan2UtbkAktual] = useState('');
  const [pu, setPu] = useState('');
  const [ppu, setPpu] = useState('');
  const [pbm, setPbm] = useState('');
  const [pk, setPk] = useState('');
  const [lbi, setLbi] = useState('');
  const [lbe, setLbe] = useState('');
  const [pm, setPm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState('');
  const [scoresByYear, setScoresByYear] = useState<ScorePerYear>({});
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingScore, setLoadingScore] = useState(true);
  const [errorStudent, setErrorStudent] = useState('');
  const [errorScore, setErrorScore] = useState('');


  type Score = {
    pu: number;
    ppu: number;
    pbm: number;
    pk: number;
    lbi: number;
    lbe: number;
    pm: number;
    total?: number;
  };

  type ScorePerYear = Record<string, Record<string, Score>>;

  useEffect(() => {
    const fetchCoursesList = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/admin/listPacket");
        const data = await response.json();
        console.log("Data dari API:", data);
        setCoursesList(data);
      } catch (error) {
        console.error("Gagal mengambil data PTN", error);
      }
    };

    const fetchStudent = async () => {
      setLoadingStudent(true);
      setErrorStudent('');
      console.log("ID Siswa dari params:", id);
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewStudent/${username}`);
        if (!response.ok) throw new Error('Gagal mengambil data siswa');
        const data = await response.json();
        console.log("Data dari API:", data);

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setNisn(data.nisn);
        setActive(data.active);
        setKelompokUjian(data.kelompok_ujian);
        setNoUtbk(data.no_utbk);
        setGrade(data.grade);
        setNamaSekolah(data.nama_sekolah);
        setPilihan1Utbk(data.nama_prodi1);
        setPilihan2Utbk(data.nama_prodi2);
        setPilihan1UtbkAktual(data.nama_prodi1_aktual);
        setPilihan2UtbkAktual(data.nama_prodi2_aktual);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorStudent('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoadingStudent(false);
      }
    };

    const fetchScore = async () => {
      setLoadingScore(true);
      setErrorScore('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewScore/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data nilai');
        const data = await response.json();
        console.log("Data dari API:", data);
  
        const transformedScores: Record<string, Record<string, Score>> = {};
  
        Object.entries(data).forEach(([year, packages]) => {
          transformedScores[year] = {};
          Object.entries(packages as Record<string, Score>).forEach(([paketId, scoreObj]) => {
            transformedScores[year][paketId] = scoreObj;
          });
        });
  
        setScoresByYear(transformedScores);
  
        const years = Object.keys(transformedScores);
        if (years.length > 0) {
          setSelectedYear(years[0]);
          const paketList = Object.keys(transformedScores[years[0]]);
          if (paketList.length > 0) {
            setSelectedCourses(paketList[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
        setErrorScore('Gagal memuat data nilai.');
      } finally {
        setLoadingScore(false);
      }
    };
    
    if (id) {
      fetchScore();
    }
    if(id){
      fetchCoursesList();
    }
    if (username) {
      fetchStudent();
    }
  }, [username, id]);

  if (loadingStudent) return <div className="p-6 text-center">Memuat data...</div>;
  if (errorStudent) return <div className="p-6 text-red-500 text-center">{errorStudent}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Data Siswa</h1>
        <div>
          <Link to={`/dashboard/score/tambahNilai/${username}`} className="font-medium text-sm">
            <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors mb-4">
              <ClipboardList size={20} className='mr-2' />
              Input Nilai Siswa
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('dataDiri')}
          className={`px-4 py-2 rounded-t-md font-semibold ${activeTab === 'dataDiri' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Data Diri
        </button>
        <button
          onClick={() => setActiveTab('nilai')}
          className={`px-4 py-2 rounded-t-md font-semibold ${activeTab === 'nilai' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Nilai
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-b-md space-y-4">
        {activeTab === 'dataDiri' && (
          <>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Nama Siswa:</strong> {firstName} {lastName}</p>
            <p><strong>NISN:</strong> {nisn || "-"}</p>
            <p><strong>Aktif:</strong> {active || "-"}</p>
            <p><strong>Asal Sekolah:</strong> {namaSekolah || "-"}</p>
            <p><strong>Kelompok Ujian:</strong> {kelompokUjian}</p>
            <p><strong>No UTBK:</strong> {noUtbk || "-"}</p>
            <p><strong>Grade:</strong> {grade || "-"}</p>
            <p><strong>Pilihan 1 UTBK:</strong> {pilihan1Utbk || "-"}</p>
            <p><strong>Pilihan 2 UTBK:</strong> {pilihan2Utbk || "-"}</p>
            <p><strong>Pilihan 1 UTBK Aktual:</strong> {pilihan1UtbkAktual || "-"}</p>
            <p><strong>Pilihan 2 UTBK Aktual:</strong> {pilihan2UtbkAktual || "-"}</p>
          </>
        )}

        {activeTab === 'nilai' && (
          <>
            <div className="mb-4 flex items-center">
              <label htmlFor="tahun" className="block mb-1 mr-4 font-semibold">Tahun:</label>
              <select
                id="tahun"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="p-2 border rounded-md bg-gray-100"
              >
                {Object.keys(scoresByYear).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <label htmlFor="paket" className="block mb-1 mr-4 font-semibold">Paket:</label>
              <select
                id="paket"
                value={selectedCourses}
                onChange={(e) => setSelectedCourses(e.target.value)}
                className="p-2 border rounded-md bg-gray-100"
              >
                {coursesList.map((courses) => (
                  <option key={courses.id} value={courses.id}>
                    {courses.nama_paket}
                  </option>
                ))}
              </select>
            </div>
            {selectedYear && selectedCourses && scoresByYear[selectedYear]?.[selectedCourses] ? (
              <>
                <p><strong>Penalaran Umum:</strong> {scoresByYear[selectedYear][selectedCourses].pu || "-"}</p>
                <p><strong>Pengetahuan dan Pemahaman Umum:</strong> {scoresByYear[selectedYear][selectedCourses].ppu || "-"}</p>
                <p><strong>Pemahaman Bacaan dan Menulis:</strong> {scoresByYear[selectedYear][selectedCourses].pbm || "-"}</p>
                <p><strong>Pengetahun Kuantitatif:</strong> {scoresByYear[selectedYear][selectedCourses].pk || "-"}</p>
                <p><strong>Literasi Bahasa Indonesia:</strong> {scoresByYear[selectedYear][selectedCourses].lbi || "-"}</p>
                <p><strong>Literasi Bahasa Inggris:</strong> {scoresByYear[selectedYear][selectedCourses].lbe || "-"}</p>
                <p><strong>Penalaran Matematika:</strong> {scoresByYear[selectedYear][selectedCourses].pm || "-"}</p>
              </>
            ) : (
              <p>Data nilai tidak tersedia untuk tahun ini.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LihatSiswa;
