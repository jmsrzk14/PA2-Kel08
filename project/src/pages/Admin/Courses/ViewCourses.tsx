import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatPaket = () => {
  const { id } = useParams();
  const [namaPaket, setNamaPaket] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [price, setPrice] = useState(0);
  const [pu, setPu] = useState(0);
  const [ppu, setPpu] = useState(0);
  const [pbm, setPbm] = useState(0);
  const [pk, setPk] = useState(0);
  const [lbi, setLbi] = useState(0);
  const [lbe, setLbe] = useState(0);
  const [pm, setPm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8000/admin/viewPacket/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        const packet = data.packet;

        setNamaPaket(packet.nama_paket);
        setDeskripsi(packet.deskripsi);
        setTotal(packet.total);
        setActive(packet.active);
        setPrice(packet.price);
        setPu(packet.pu);
        setPpu(packet.ppu);
        setPbm(packet.pbm);
        setPk(packet.pk);
        setLbi(packet.lbi);
        setLbe(packet.lbe);
        setPm(packet.pm);
      } catch (error) {
        console.error("Error fetching paket:", error);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Paket TryOut</h1>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <p><strong>Nama Paket:</strong> {namaPaket}</p>
        <p><strong>Deskripsi Paket:</strong> {deskripsi}</p>
        <p><strong>Total:</strong> {total}</p>
        <p><strong>Active:</strong> {active}</p>
        <p><strong>Harga:</strong> Rp {typeof price === 'number' ? price.toLocaleString('id-ID') : 'Tidak tersedia'}</p>
        <div className='mt-20 space-y-3'>
          <h5 className="text-xl font-bold">Detail Jumlah Soal</h5>
          <p><strong>Penalaran Umum:</strong> {pu}</p>
          <p><strong>Pengetahuan dan Pemahaman Umum:</strong> {ppu}</p>
          <p><strong>Pemahaman Bacaan dan Menulus:</strong> {pbm}</p>
          <p><strong>Pengetahuan Kuantitatif:</strong> {pk}</p>
          <p><strong>Literasi Bahasa Indonesia:</strong> {lbi}</p>
          <p><strong>Literasi Bahasa Inggris:</strong> {lbe}</p>
          <p><strong>Penalaran Matematika:</strong> {pm}</p>
        </div>
      </div>
    </div>
  );
};

export default LihatPaket;
