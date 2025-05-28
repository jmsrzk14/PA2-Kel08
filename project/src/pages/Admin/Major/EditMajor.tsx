import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditMajor = () => {
  const { id_prodi } = useParams(); 
  const [namaProdi, setNamaProdi] = useState('');
  const [active, setActive] = useState('');
  const [jenis, setJenis] = useState('');
  const [jenjang, setJenjang] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const response = await fetch(`http://160.19.166.155:8000/admin/viewMajor/${id_prodi}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);
        
        setNamaProdi(data.nama_prodi);
        setActive(data.active);
        setJenjang(data.jenjang);
        setJenis(data.jenis);
      } catch (error) {
        console.error("Error fetching paket:", error);
      }
    };

    fetchProdi();
  }, [id_prodi]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("nama_prodi", namaProdi);
    formData.append("active", active.toString());
    formData.append("jenjang", jenjang);
    formData.append("jenis", jenis);

    console.log("Payload yang dikirim:", formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Prodi tidak akan dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://160.19.166.155:8000/admin/editMajor/${id_prodi}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error("Gagal mengedit Prodi");
          }

          Swal.fire({
            title: 'Berhasil!',
            text: 'Data Prodi berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/major/list');
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Prodi PTN</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Prodi</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={namaProdi}
            onChange={(e) => setNamaProdi(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Active</label>
          <input
            type="number"
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
          <label className="block text-sm font-medium text-gray-700">Jenis</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            required
          >
            <option value="">Pilih Jenis</option>
            <option value="SAINTEK">SAINTEK</option>
            <option value="SOSHUM">SOSHUM</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Jenjang</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={jenjang}
            onChange={(e) => setJenjang(e.target.value)}
            required
          >
            <option value="">Pilih Jenjang</option>
            <option value="S1">S1</option>
            <option value="D4">D4</option>
            <option value="D3">D3</option>
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

export default EditMajor;
