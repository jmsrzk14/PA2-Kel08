import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatPembayaran = () => {
  const { id } = useParams();
  const [namaPaket, setNamaPaket] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${day} ${month} ${year} / ${hours}:${minutes}:${second}`;
  };

  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/viewPayment/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data Pembayaran');
        const data = await response.json();
        console.log("Data dari API:", data);

        setNamaPaket(data.id_paket);
        setNamaSiswa(data.nama);
        setCreatedAt(data.created_at);
        setPrice(data.harga);
      } catch (error) {
        console.error("Error fetching pembayaran:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaket();
    }
  }, [id]);

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Data Pembayaran</h1>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Nama Siswa:</strong> {namaSiswa}</p>
        <p><strong>Nama Paket:</strong> {namaPaket}</p>
        <p><strong>Harga:</strong> Rp {price.toLocaleString('id-ID')}</p>
        <p><strong>Tanggal Pembayaran:</strong> {formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default LihatPembayaran;
