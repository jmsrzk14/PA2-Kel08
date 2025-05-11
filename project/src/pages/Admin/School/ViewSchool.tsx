import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatSekolah = () => {
  const { id } = useParams();
  const [npsn, setNpsn] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [bentuk, setBentuk] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [propinsi, setPropinsi] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewSekolah/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);

        setNpsn(data.npsn);
        setSekolah(data.sekolah);
        setBentuk(data.bentuk);
        setKecamatan(data.nama_kecamatan);
        setKabupaten(data.nama_kabupaten);
        setPropinsi(data.nama_provinsi);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching paket:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchool();
    }
  }, [id]);

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail {sekolah}</h1>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <p><strong>Nama Sekolah:</strong> {sekolah}</p>
        <p><strong>NPSN:</strong> {npsn}</p>
        <p><strong>Bentuk:</strong> {bentuk}</p>
        <p><strong>Provinsi:</strong> {propinsi}</p>
        <p><strong>Kabupaten:</strong> {kabupaten}</p>
        <p><strong>Kecamatan:</strong> {kecamatan}</p>
        <p><strong>Status:</strong> {status === 'S' ? 'Swasta' : status === 'N' ? 'Negeri' : 'Tidak Diketahui'}</p>
      </div>
    </div>
  );
};

export default LihatSekolah;
