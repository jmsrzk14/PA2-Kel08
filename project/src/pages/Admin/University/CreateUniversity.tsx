import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const TambahPtn = () => {
  const [namaPtn, setNamaPtn] = useState('');
  const [namaSingkat, setNamaSingkat] = useState('');
  const [active, setActive] = useState('');
  const [alamatWeb, setAlamatWeb] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("namaPtn", namaPtn);
    formData.append("namaSingkat", namaSingkat);
    formData.append("active", active.toString());
    formData.append("alamatWeb", alamatWeb);

    console.log("Payload yang dikirim:", formData.toString());

    try {
      const response = await fetch("https://160.19.166.155:8000/admin/createUniversity", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data Perguruan Tinggi Negeri berhasil ditambahkan.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate("/dashboard/university/list")
      });
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: (error as Error).message || 'Terjadi kesalahan saat menambahkan.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    };
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Perguruan Tinggi Negeri</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Perguruan Tinggi Negeri</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={namaPtn}
            onChange={(e) => setNamaPtn(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Singkat Perguruan Tinggi Negeri</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={namaSingkat}
            onChange={(e) => setNamaSingkat(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Active</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={active}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setActive(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alamat URL</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={alamatWeb}
            onChange={(e) => setAlamatWeb(e.target.value)}
            required
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

export default TambahPtn;
