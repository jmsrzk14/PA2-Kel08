import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const TambahProdi = () => {
  const [namaProdi, setNamaProdi] = useState('');
  const [active, setActive] = useState('');
  const [jenis, setJenis] = useState('');
  const [jenjang, setJenjang] = useState('');
  const [ptnList, setPtnList] = useState([]);
  const [selectedPtn, setSelectedPtn] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPtnList = async () => {
      try {
        const response = await fetch("https://52.205.255.169/admin/listUniversity");
        const data = await response.json();
        setPtnList(data);
      } catch (error) {
        console.error("Gagal mengambil data PTN", error);
      }
    };

    fetchPtnList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("nama_prodi", namaProdi);
    formData.append("active", active.toString());
    formData.append("jenjang", jenjang);
    formData.append("jenis", jenis);
    formData.append("ptn_id", selectedPtn);

    try {
      const response = await fetch("https://52.205.255.169/admin/createMajor", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data Program Study berhasil ditambahkan.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate("/dashboard/major/list")
      });
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: (error as Error).message || 'Terjadi kesalahan saat menambahkan.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    };
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Prodi PTN</h1>
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
          <label className="block text-sm font-medium text-gray-700">Nama PTN</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={selectedPtn}
            onChange={(e) => setSelectedPtn(e.target.value)}
            required
          >
            <option value="">Pilih PTN</option>
            {ptnList.map((ptn) => (
              <option key={ptn.id_ptn} value={ptn.id_ptn}>
                {ptn.nama_ptn} ({ptn.nama_singkat})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Aktif</label>
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

export default TambahProdi;