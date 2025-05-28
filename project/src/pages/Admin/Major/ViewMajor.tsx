import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button
} from "@mui/material";
import { Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type MajorCapacity = {
  id: number;
  id_prodi: number;
  tahun: number;
  daya_tampung: number;
  peminat: number;
};

interface Column {
  id: keyof MajorCapacity;
  label: string;
}

const columns: readonly Column[] = [
  { id: "tahun", label: "Tahun" },
  { id: "daya_tampung", label: "Daya Tampung" },
  { id: "peminat", label: "Peminat" },
];

const LihatProdi = () => {
  const [capacity, setCapacity] = useState<MajorCapacity[]>([]);
  const { id_prodi } = useParams();
  const [namaProdi, setNamaProdi] = useState('');
  const [namaProdiPtn, setNamaProdiPtn] = useState('');
  const [active, setActive] = useState('');
  const [jenis, setJenis] = useState('');
  const [jenjang, setJenjang] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProdi = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://160.19.166.155:8000/admin/viewMajor/${id_prodi}`);
        if (!response.ok) throw new Error('Gagal mengambil data paket');
        const data = await response.json();
        console.log("Data dari API:", data);

        setNamaProdi(data.nama_prodi);
        setNamaProdiPtn(data.nama_prodi_ptn);
        setActive(data.active);
        setJenis(data.jenis);
        setJenjang(data.jenjang);
      } catch (error) {
        console.error("Error fetching paket:", error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    const fetchDayaTampung = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://160.19.166.155:8000/admin/listCapacity/${id_prodi}`);
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: MajorCapacity[] = await response.json();
        setCapacity(data);
      } catch (err) {
      } finally {
      }
    };

    if (id_prodi) {
      fetchDayaTampung();
      fetchProdi();
    }
  }, [id_prodi]);

  const handleDelete = async (id: number) => {
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data Daya Tampung Program Studi akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`http://160.19.166.155:8000/admin/listCapacity/${id}`, {
              method: "DELETE",
            });
              if (!response.ok) throw new Error("Gagal menghapus Program Studi");             
              Swal.fire('Terhapus!', 'Data Daya Tampung Program Studi berhasil dihapus.', 'success').then(() => {
                setCapacity(prev => prev.filter(p => p.id !== id));
              });
            } catch (error) {
              Swal.fire('Gagal!', (error as Error).message || 'Terjadi kesalahan saat menghapus.', 'error');
            }
          }
        }
      );
    };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Detail Data Prodi</h1>
        <Link to={`/dashboard/major/capacity/tambahCapacity/${id_prodi}`} className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Tambah Daya Tampung Prodi
          </button>
        </Link>
      </div>
      <div className="bg-gray-100 p-4 rounded-md space-y-4">
        <p><strong>Nama Prodi:</strong> {namaProdi}</p>
        <p><strong>Nama Prodi PTN:</strong> {namaProdiPtn}</p>
        <p><strong>Active:</strong> {active}</p>
        <p><strong>Jenis:</strong> {jenis}</p>
        <p><strong>Jenjang:</strong> {jenjang}</p>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={100}>No</TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} width={200} align="center">{column.label}</TableCell>
                ))}
                <TableCell width={250} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {capacity.map((row, index) => (
                <TableRow key={row.id_prodi} hover>
                  <TableCell>{index + 1}</TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id} align="center">
                        {row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                    <Button variant="contained" color="error" size="small" sx={{ mr: 1, minWidth: 30 }} onClick={() => handleDelete(row.id)}>
                      <Trash size={20} />
                    </Button>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LihatProdi;
