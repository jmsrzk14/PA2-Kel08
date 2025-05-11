import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TablePagination, TextField
} from "@mui/material";
import { Eye, Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type MajorPackage = {
  id_prodi: number;
  nama_prodi: string;
  nama_prodi_ptn: string;
};

interface Column {
  id: keyof MajorPackage;
  label: string;
}

const columns: readonly Column[] = [
  { id: "nama_prodi", label: "Nama Prodi" },
  { id: "nama_prodi_ptn", label: "Nama PTN" },
];

const getLastWord = (text: string) => {
  const words = text.trim().split(" ");
  return words.length > 1 ? words[words.length - 1] : text;
};

const MajorContent = () => {
  const [major, setMajor] = useState<MajorPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredMajor, setFilteredMajor] = useState<MajorPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/admin/listMajor");
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: MajorPackage[] = await response.json();
        setMajor(data);
        setFilteredMajor(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = major.filter((major) =>
      major.nama_prodi.toLowerCase().includes(searchQuery.toLowerCase()) || major.nama_prodi_ptn.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMajor(filtered);
    setPage(0);
  }, [searchQuery, major]);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Program Studi akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/admin/listMajor/${id}`, {
            method: "DELETE",
          });
            if (!response.ok) throw new Error("Gagal menghapus Program Studi");             
            Swal.fire('Terhapus!', 'Data Program Studi berhasil dihapus.', 'success').then(() => {
              setMajor(prev => prev.filter(p => p.id_prodi !== id));
              setFilteredMajor(prev => prev.filter(p => p.id_prodi !== id));
            });
          } catch (error) {
            Swal.fire('Gagal!', (error as Error).message || 'Terjadi kesalahan saat menghapus.', 'error');
          }
        }
      }
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return <p className="text-gray-700 text-center">Loading...</p>;
  }

  if (error) {
    return <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Siswa</h1>
          <TextField
            label="Cari Nama Prodi"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/major/tambahMajor" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Tambah Prodi
          </button>
        </Link>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell  width={100}>No</TableCell>
              {columns.map((column) => (
                <TableCell width={400} align="center" key={column.id}>{column.label}</TableCell>
              ))}
              <TableCell width={250} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell colspan={4} align="center"><p className="text-red-500">Data tidak ditemukan!</p></TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar Prodi PTN</h1>
          <TextField
            label="Cari Nama Prodi"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/major/tambahMajor">
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md">Tambah Prodi</button>
        </Link>
      </div>
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
            {major.map((row, index) => (
              <TableRow key={row.id_prodi} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell align="center">{row.nama_prodi}</TableCell>
                <TableCell align="center">{getLastWord(row.nama_prodi_ptn)}</TableCell>
                <TableCell align="center">
                  <Link to={`/dashboard/major/viewMajor/${row.id_prodi}`}>
                    <Button variant="contained" color="primary" size="small" sx={{ mr: 3, minWidth: 30 }}><Eye size={20} /></Button>
                  </Link>
                  <Link to={`/dashboard/major/editMajor/${row.id_prodi}`}>
                    <Button variant="contained" color="warning" size="small" sx={{ mr: 3, minWidth: 30 }}><Pencil size={20} /></Button>
                  </Link>
                  <Button variant="contained" color="error" size="small" sx={{ mr: 1, minWidth: 30 }} onClick={() => handleDelete(row.id_prodi)}>
                    <Trash size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MajorContent;
