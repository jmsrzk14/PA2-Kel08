import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const Tambahnilai = () => {
  const { username } = useParams();  
  const [firstName, setFirstName] = useState('');
  const [idSiswa, setIdSiswa] = useState('');
  const [tahun, setTahun] = useState('');
  const [pu, setPu] = useState('');
  const [ppu, setPpu] = useState('');
  const [pbm, setPbm] = useState('');
  const [pk, setPk] = useState('');
  const [pm, setPm] = useState('');
  const [lbi, setLbi] = useState('');
  const [lbe, setLbe] = useState('');
  const [coursesList, setCoursesList] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    fetchCoursesList();
  }, []);
  
  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewStudent/${username}`);
        if (!response.ok) throw new Error('Gagal mengambil data siswa');
        const data = await response.json();
        console.log("Data dari API:", data);

        setFirstName(data.first_name);
        setIdSiswa(data.id);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPaket();
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("id_siswa", idSiswa);
    formData.append("id_courses", selectedCourses);
    formData.append("year", tahun);
    formData.append("pu", pu);
    formData.append("ppu", ppu);
    formData.append("pbm", pbm);
    formData.append("pk", pk);
    formData.append("lbi", lbi);
    formData.append("lbe", lbe);
    formData.append("pm", pm);
    console.log("Payload yang dikirim:", formData.toString());

    try {
      const response = await fetch("http://127.0.0.1:8000/admin/createScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      Swal.fire({
          title: 'Berhasil!',
          text: 'Data Paket TryOut berhasil ditambahkan.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          navigate("/dashboard/students/list")
        });
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: (error as Error).message || 'Terjadi kesalahan saat menambahkan.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    };
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Input Nilai Siswa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Siswa</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={firstName}
            onChange={(e) => setIdSiswa(e.target.value)}
            required
            disabled
          />
          <input
            type="hidden"
            value={idSiswa}
            onChange={(e) => setIdSiswa(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Paket TryOut</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={selectedCourses}
            onChange={(e) => setSelectedCourses(e.target.value)}
            required
          >
            <option value="">Pilih Paket TryOut</option>
            {coursesList.map((courses) => (
              <option key={courses.id} value={courses.id}>
                {courses.nama_paket}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tahun</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={tahun}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setTahun(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Penalaran Umum</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pu}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPu(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Pengetahuan dan Pemahaman Umum</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={ppu}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPpu(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Pemahaman Bacaan dan Menulis</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pbm}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPbm(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Pengetahuan Kuantitatif</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pk}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPk(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Literasi Bahasa Indonesia</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={lbi}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setLbi(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Literasi Bahasa Inggris</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={lbe}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setLbe(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nilai Penalaran Matematika</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pm}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPm(rawValue);
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Simpan Nilai
        </button>
      </form>
    </div>
  );
};

export default Tambahnilai;
