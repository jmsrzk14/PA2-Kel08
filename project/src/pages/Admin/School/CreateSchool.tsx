import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';

const TambahSekolah = () => {
  const [npsn, setNpsn] = useState('');
  const [sekolahs, setSekolah] = useState('');
  const [bentuk, setBentuk] = useState('');
  const [kecamatan, setKecamatan] = useState(null);
  const [kabupaten, setKabupaten] = useState(null);
  const [provinsi, setProvinsi] = useState(null);
  const [status, setStatus] = useState('');

  const [provinsiOptions, setProvinsiOptions] = useState([]);
  const [kabupatenOptions, setKabupatenOptions] = useState([]);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/admin/region/province")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((prov) => ({
          value: prov.id,
          label: prov.provinsi,
        }));
        setProvinsiOptions(formatted);
      });
  }, []);

  useEffect(() => {
    if (provinsi) {
      fetch(`http://localhost:8000/admin/region/regency/${provinsi.value}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((kab) => ({
            value: kab.id,
            label: kab.kabupaten,
          }));
          setKabupatenOptions(formatted);
          setKabupaten(null); 
          setKecamatan(null); 
          setKecamatanOptions([]); 
        });
    }
  }, [provinsi]);

  useEffect(() => {
    if (kabupaten) {
      fetch(`http://localhost:8000/admin/region/subdistrict/${kabupaten.value}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((kec) => ({
            value: kec.id,
            label: kec.kecamatan,
          }));
          setKecamatanOptions(formatted);
          setKecamatan(null);
        });
    }
  }, [kabupaten]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("npsn", npsn);
    formData.append("sekolahs", sekolahs);
    formData.append("bentuk", bentuk);
    formData.append("kecamatan", kecamatan?.value || '');
    formData.append("kabupaten", kabupaten?.value || '');
    formData.append("propinsi", provinsi?.value || '');
    formData.append("status", status);

    console.log("Payload yang dikirim:", formData.toString());

    try {
      await fetch("http://localhost:8000/admin/createSekolah", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      Swal.fire({
        title: 'Berhasil!',
        text: 'Data Sekolah berhasil ditambahkan.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate("/dashboard/school/list");
      });

    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: (error as Error).message || 'Terjadi kesalahan saat menambahkan.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Sekolah</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Sekolah</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={sekolahs}
            onChange={(e) => setSekolah(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NPSN</label>
          <input
            type="text"
            className="mt-1 p-2 border rounded w-full"
            value={npsn}
            onChange={(e) => setNpsn(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bentuk</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={bentuk}
            onChange={(e) => setBentuk(e.target.value)}
            required
          >
            <option value="">Pilih Bentuk</option>
            <option value="SMA">SMA</option>
            <option value="SMK">SMK</option>
            <option value="PKBM">PKBM</option>
            <option value="MAN">MAN</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Provinsi</label>
          <Select
            options={provinsiOptions}
            value={provinsi}
            onChange={setProvinsi}
            isClearable
            placeholder="Pilih Provinsi..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kabupaten</label>
          <Select
            options={kabupatenOptions}
            value={kabupaten}
            onChange={setKabupaten}
            isClearable
            placeholder="Pilih Kabupaten..."
            isDisabled={!provinsi}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kecamatan</label>
          <Select
            options={kecamatanOptions}
            value={kecamatan}
            onChange={setKecamatan}
            isClearable
            placeholder="Pilih Kecamatan..."
            isDisabled={!kabupaten}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 p-2 border rounded w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Pilih Status</option>
            <option value="S">S</option>
            <option value="N">N</option>
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

export default TambahSekolah;
