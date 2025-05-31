import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatBerita = () => {
  const { id } = useParams();
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaket = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://52.205.255.169/admin/viewNews/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log(data);

        setJudul(data.judul);
        setDeskripsi(data.deskripsi);
        setFoto(data.foto);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{judul}</h1>
      <div className="flex flex-row bg-gray-100 p-4 rounded-md space-y-4">
        <div
            className="w-3/4 mt-2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: deskripsi }}
          />
          <div className="w-1/4">
            <img className="w-[50em] h-auto mt-4" src={`https://52.205.255.169/${foto?.replace(/\\/g, "/")}`} />
          </div>
      </div>
    </div>
  );
};

export default LihatBerita;
