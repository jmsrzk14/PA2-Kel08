import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const TambahDayaTampung = () => {
  const { id_prodi } = useParams();  
  const [namaProdi, setNamaProdi] = useState('');
  const [tahun, setTahun] = useState('');
  const [dayaTampung, setDayaTampung] = useState('');
  const [peminat, setPeminat] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMajor = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewMajor/${id_prodi}`);
        if (!response.ok) throw new Error('Gagal mengambil data prodi');
        const data = await response.json();
        setNamaProdi(data.nama_prodi_ptn);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (id_prodi) {
      fetchMajor();
    }
  }, [id_prodi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("prodi_id", id_prodi || '');
    formData.append("tahun", tahun);
    formData.append("daya_tampung", dayaTampung);
    formData.append("peminat", peminat);

    try {
      const response = await fetch("http://localhost:8000/admin/createCapacity", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data!");

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data daya tampung berhasil ditambahkan.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate(`/dashboard/major/viewMajor/${id_prodi}`);
      });
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: (error as Error).message || 'Terjadi kesalahan saat menambahkan.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Daya Tampung</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Prodi</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={namaProdi}
            onChange={(e) => setNamaProdi(e.target.value.replace(/\D/g, ''))}
            required
            disabled
          />
          <input
            type="hidden"
            value={id_prodi}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tahun</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={tahun}
            onChange={(e) => setTahun(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Daya Tampung</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={dayaTampung}
            onChange={(e) => setDayaTampung(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Peminat</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={peminat}
            onChange={(e) => setPeminat(e.target.value.replace(/\D/g, ''))}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Tambah Daya Tampung
        </button>
      </form>
    </div>
  );
};

export default TambahDayaTampung;
