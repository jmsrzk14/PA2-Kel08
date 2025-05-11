import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

const TambahPengumuman = () => {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [idUsers, setIdUsers] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:8000/admin/profile`, {
          withCredentials: true,
        });
  
        const data = response.data;
        console.log("Data dari API:", data);
  
        setIdUsers(data.id);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);
    formData.append("id_users", idUsers);

    console.log("Payload yang dikirim:", formData.toString());

    try {
      const response = await fetch("http://localhost:8000/admin/createAnnouncement", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      Swal.fire({
          title: 'Berhasil!',
          text: 'Data Pengumuman berhasil ditambahkan.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          navigate("/dashboard/announcement/list")
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Pengumuman</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <ReactQuill
            value={deskripsi}
            onChange={setDeskripsi}
            theme="snow"
            className="bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={!idUsers}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Buat Pengumuman
        </button>
      </form>
    </div>
  );
};

export default TambahPengumuman;
