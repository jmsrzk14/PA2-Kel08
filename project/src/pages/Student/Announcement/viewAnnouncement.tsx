import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LihatPaket = () => {
  const { id } = useParams();
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [id_users, setIdUsers] = useState('');
  const [namaUser, setNamaUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8000/admin/viewAnnouncement/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data pengumuman');
        const data = await response.json();
        console.log("Data dari API:", data);

        setJudul(data.judul);
        setDeskripsi(data.deskripsi);
        setIdUsers(data.id_users);

        const userRes = await fetch(`http://localhost:8000/admin/listUser/${data.id_users}`);
        if (!userRes.ok) throw new Error('Gagal mengambil data user');
        const userData = await userRes.json();
        setNamaUser(userData.nama);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{judul}</h1>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <div>
          <div
            className="mt-2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: deskripsi }}
          />
        </div>
        <p className="mb-4 text-gray-600">Dibuat oleh</p>
        <span className="font-semibold">{namaUser}</span>
      </div>
    </div>
  );
};

export default LihatPaket;
