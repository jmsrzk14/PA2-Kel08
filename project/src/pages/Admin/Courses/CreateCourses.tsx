import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const TambahProdi = () => {
  const [namaProdi, setNamaProdi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [total, setTotal] = useState('');
  const [active, setActive] = useState('');
  const [price, setPrice] = useState('');
  const [pu, setPu] = useState('');
  const [ppu, setPpu] = useState('');
  const [pbm, setPbm] = useState('');
  const [pk, setPk] = useState('');
  const [lbi, setLbi] = useState('');
  const [lbe, setLbe] = useState('');
  const [pm, setPm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("name", namaProdi);
    formData.append("deskripsi", deskripsi);
    formData.append("total", total.toString());
    formData.append("active", active.toString());
    formData.append("price", price.toString());
    formData.append("pu", pu.toString());
    formData.append("ppu", ppu.toString());
    formData.append("pbm", pbm.toString());
    formData.append("pk", pk.toString());
    formData.append("lbi", lbi.toString());
    formData.append("lbe", lbe.toString());
    formData.append("pm", pm.toString());
    
    console.log("Payload yang dikirim:", formData.toString());

    try {
      const response = await fetch("http://localhost:8000/admin/createPacket", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      Swal.fire({
          title: 'Berhasil!',
          text: 'Data Paket TryOut berhasil ditambahkan.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          navigate("/dashboard/courses/list")
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Paket TryOut</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Paket</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={namaProdi}
            onChange={(e) => setNamaProdi(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi Paket</label>
         <textarea
            className="mt-1 p-2 border rounded w-full"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={total}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setTotal(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Active</label>
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
          <label className="block text-sm font-medium text-gray-700">Harga</label>
          <div className="mt-1 flex items-center border rounded w-full">
            <span className="p-2">Rp.</span>
            <input
              type="text"
              className="p-2 flex-1 outline-none"
              value={price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                setPrice(rawValue);
              }}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Penalaran Umum</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pu}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPu(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pengetahuan dan Pemahaman Umum</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={ppu}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPpu(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pemahaman Bacaan dan Menulis</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pbm}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPbm(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pengetahuan Kuantitatif</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pk}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPk(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Literasi Bahasa Indonesia</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={lbi}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setLbi(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Literasi Bahasa Inggris</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={lbe}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setLbe(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Penalaran Matematika</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={pm}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setPm(rawValue);
            }}
            required
          />
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
