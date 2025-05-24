import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditSekolah = () => {
  const { id } = useParams(); 
  const [npsn, setNpsn] = useState('');
  const [sekolahs, setSekolah] = useState('');
  const [bentuk, setBentuk] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`http://localhost:8000/admin/viewSekolah/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);
        
        setNpsn(data.npsn);
        setSekolah(data.sekolah);
        setBentuk(data.bentuk);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching paket:", error);
      }
    };

    fetchSchool();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("npsn", npsn);
    formData.append("sekolahs", sekolahs);
    formData.append("bentuk", bentuk);
    formData.append("status", status);

    console.log("Payload yang dikirim:", formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Sekolah tidak akan dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8000/admin/editSekolah/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error("Gagal mengedit Data Sekolah");
          }
  
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data Sekolah berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/school/list');
          });
  
        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: (error as Error).message || 'Terjadi kesalahan saat menghapus.',
            icon: 'error',
            confirmButtonColor: '#333',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Data Sekolah</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Sekolah</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={sekolahs}
            onChange={(e) => setSekolah(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NPSN</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={npsn}
            onChange={(e) => setNpsn(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bentuk</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={bentuk}
            onChange={(e) => setBentuk(e.target.value)}
            required
          >
            <option value="">Pilih Bentuk</option>
            <option value="SMA">SMA</option>
            <option value="SMK">SMK</option>
            <option value="PKBM">PKBM</option>
            <option value="MAN">MAN</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Pilih Status</option>
            <option value="S">Swasta</option>
            <option value="N">Negeri</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default EditSekolah;
