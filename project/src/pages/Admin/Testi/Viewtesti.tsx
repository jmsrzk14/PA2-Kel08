import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatBerita = () => {
  const { id } = useParams();
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewTesti/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data testi');
        const data = await response.json();
        console.log(data);

        setNama(data.nama);
        setDeskripsi(data.deskripsi);
        setFoto(data.foto);
      } catch (error) {
        console.error("Error fetching testi:", error);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{nama}</h1>
      <img className="w-[7em] h-auto mb-6" src={`https://52.205.255.169/${foto?.replace(/\\/g, "/")}`} />
      <div className="flex flex-row bg-gray-100 p-4 rounded-md space-y-4">
        <div
          className="mt-2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: `<blockquote>${deskripsi}</blockquote>`
          }}
        />
        </div>
    </div>
  );
};

export default LihatBerita;
