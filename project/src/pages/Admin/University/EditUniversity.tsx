import React, { useState, useEffect, act } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditPtn = () => {
  const { id_ptn } = useParams(); 
  const [namaPtn, setNamaPtn] = useState('');
  const [namaSingkat, setNamaSingkat] = useState('');
  const [alamatWeb, setAlamatWeb] = useState('');
  const [active, setActive] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewUniversity/${id_ptn}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);
        
        setNamaPtn(data.nama_ptn);
        setNamaSingkat(data.nama_singkat);
        setAlamatWeb(data.alamat_web);
        setActive(data.active);
      } catch (error) {
        console.error("Error fetching paket:", error);
      }
    };

    fetchPaket();
  }, [id_ptn]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("name", namaPtn);
    formData.append("nameShort", namaSingkat);
    formData.append("url", alamatWeb);
    formData.append("active", active.toString());

    console.log("Payload yang dikirim:", formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data PTN tidak akan dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://52.205.255.169/admin/editUniversity/${id_ptn}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error("Gagal mengedit PTN");
          }

          Swal.fire({
            title: 'Berhasil!',
            text: 'Data PTN berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/university/list');
          });

        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: (error as Error).message || 'Terjadi kesalahan saat menghapus.',
            icon: 'error',
            confirmButtonColor: '#d3085d6',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Perguruan Tinggi Negeri</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap Perguruan Tinggi Negeri</label>
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
          <label className="block text-sm font-medium text-gray-700">Alamat WEB</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={alamatWeb}
            onChange={(e) => setAlamatWeb(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Active</label>
          <div className="mt-1 flex items-center border rounded w-full">
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

export default EditPtn;
