import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

const TambahBerita = () => {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState('');
  const [previewFoto, setPreviewFoto] = useState('');

  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFoto(reader.result as string); 
      setPreviewFoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);
    formData.append("foto", foto); 

    try {
      const response = await fetch("https://kawalptn.store/admin/createNews", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Gagal menyimpan data");
      }

      Swal.fire({
        title: 'Berhasil!',
        text: 'Berita berhasil ditambahkan.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate("/dashboard/news/list");
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat menambahkan.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Berita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul Berita</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Foto (opsional)</label>
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

export default TambahBerita;
