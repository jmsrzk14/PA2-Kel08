import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

const EditAnnouncement = () => {
  const { id } = useParams(); 
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const response = await fetch(`http://160.19.166.155:8000/admin/viewAnnouncement/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);
        
        setJudul(data.judul);
        setDeskripsi(data.deskripsi);
      } catch (error) {
        console.error("Error fetching pengumuman:", error);
      }
    };

    fetchPaket();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);

    console.log("Payload yang dikirim:", formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Pengumuman tidak akan dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://160.19.166.155:8000/admin/editAnnouncement/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error("Gagal mengedit Pengumuman");
          }
  
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data Pengumuman berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/announcement/list');
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Pengumuman</h1>
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
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default EditAnnouncement;
