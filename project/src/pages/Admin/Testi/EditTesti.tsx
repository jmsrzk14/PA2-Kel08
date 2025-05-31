import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

const EditTestimoni = () => {
  const { id } = useParams(); 
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState('');
  const [previewFoto, setPreviewFoto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimoni = async () => {
      try {
        const response = await fetch(`http://localhost:8000/admin/viewTesti/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data berita');
        const data = await response.json();
        
        setNama(data.nama);
        setDeskripsi(data.deskripsi);
        setFoto(data.foto);
        setPreviewFoto(`http://localhost:8000/${data.foto?.replace(/\\/g, "/")}`);
      } catch (error) {
        console.error("Error fetching berita:", error);
      }
    };

    fetchTestimoni();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFoto(reader.result);         
          setPreviewFoto(reader.result);  
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("foto", foto);
    
    console.log(formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Testimoni akan diperbarui!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8000/admin/editTesti/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) throw new Error("Gagal mengedit berita");

          Swal.fire({
            title: 'Berhasil!',
            text: 'Data Testimoni berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/testimoni/list');
          });

        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: (error as Error).message || 'Terjadi kesalahan saat mengubah data.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Testimoni</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-1 rounded w-full cursor-pointer"
          />
          {previewFoto && (
            <img
              src={previewFoto}
              alt="Preview"
              className="mt-2 w-40 rounded border"
            />
          )}
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

export default EditTestimoni;
