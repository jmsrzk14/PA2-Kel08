import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditSiswa = () => {
  const { username } = useParams(); 
  const [firstName, setFirstName] = useState('');
  const [no_utbk, setNoUtbk] = useState('');
  const [nisn, setNisn] = useState('');
  const [grade, setGrade] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const response = await fetch(`https://160.19.166.155:8000/admin/viewStudent/${username}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);
        
        setFirstName(data.first_name);
        setNoUtbk(data.no_utbk);
        setNisn(data.nisn);
        setGrade(data.grade);
      } catch (error) {
        console.error("Error fetching paket:", error);
      }
    };

    fetchPaket();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("first_name", firstName);
    formData.append("no_utbk", no_utbk);
    formData.append("nisn", nisn);
    formData.append("grade", grade);

    console.log("Payload yang dikirim:", formData.toString());

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data siswa tidak akan dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#333',
      confirmButtonText: 'Ya, Edit!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://160.19.166.155:8000/admin/editStudent/${username}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error("Gagal mengedit siswa");
          }
  
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data siswa berhasil diubah.',
            icon: 'success',
            confirmButtonColor: '#333',
          }).then(() => {
            navigate('/dashboard/students/list');
          });
  
        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: (error as Error).message || 'Terjadi kesalahan saat menghapus.',
            icon: 'error',
            confirmButtonColor: '#333',
          });
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Data Siswa</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Siswa</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No UTBK</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={no_utbk}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setNoUtbk(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NISN</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={nisn}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setNisn(rawValue);
            }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Grade</label>
          <div className="mt-1 border rounded w-full">
            <select
              className="p-2 w-full outline-none"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            >
              <option value="TIDAK TES">TIDAK TES</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="LULUS">LULUS</option>
              <option value="SUPERINTENSIF">SUPERINTENSIF</option>
            </select>
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

export default EditSiswa;
