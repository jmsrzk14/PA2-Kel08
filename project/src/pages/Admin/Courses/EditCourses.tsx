import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditPaket = () => {
  const { id } = useParams(); 
  const [namaPaket, setNamaPaket] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [total, setTotal] = useState('');
  const [active, setActive] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const response = await fetch(`http://localhost:8000/admin/viewPacket/${id}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);
        
        setNamaPaket(data.nama_paket);
        setDeskripsi(data.deskripsi);
        setTotal(data.total.toString());
        setActive(data.active.toString());
        setPrice(data.price.toString());
      } catch (error) {
        console.error("Error fetching paket:", error);
      }
    };

    fetchPaket();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("name", namaPaket);
    formData.append("deskripsi", deskripsi);
    formData.append("total", total);
    formData.append("active", active);
    formData.append("price", price);

    console.log("Payload yang dikirim:", formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Paket Tryout tidak akan dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8000/admin/editPacket/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error("Gagal mengedit Paket Tryout");
          }
  
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data Paket Tryout berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/courses/list');
          });
  
        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: (error as Error).message || 'Terjadi kesalahan saat menghapus.',
            icon: 'error',
            confirmButtonColor: '#d3085d6',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Paket TryOut</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Paket</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={namaPaket}
            onChange={(e) => setNamaPaket(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700">Price</label>
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

export default EditPaket;
