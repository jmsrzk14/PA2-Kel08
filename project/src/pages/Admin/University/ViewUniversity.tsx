import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatPaket = () => {
  const { id_ptn } = useParams();
  const [namaPtn, setNamaPtn] = useState('');
  const [namaSingkat, setNamaSingkat] = useState('');
  const [alamatWeb, setAlamatWeb] = useState('');
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewUniversity/${id_ptn}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);

        setNamaPtn(data.nama_ptn);
        setNamaSingkat(data.nama_singkat);
        setAlamatWeb(data.alamat_web);
        setActive(data.active);
      } catch (error) {
        console.error("Error fetching paket:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (id_ptn) {
      fetchPaket();
    }
  }, [id_ptn]);

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Perguruan Tinggi Negeri</h1>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <p><strong>Nama PTN:</strong> {namaPtn}</p>
        <p><strong>Nama Singkat PTN:</strong> {namaSingkat}</p>
        <p><strong>Alamat Website:</strong> {alamatWeb}</p>
        <p><strong>Aktif:</strong> {active}</p>
      </div>
    </div>
  );
};

export default LihatPaket;
