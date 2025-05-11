import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TablePagination, TextField
} from "@mui/material";
import { Eye, Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type UniversityPackage = {
  id_ptn: number;
  nama_ptn: string;
  nama_singkat: string;
};

interface Column {
  id: keyof UniversityPackage; 
  label: string;
}

const columns: readonly Column[] = [
  { id: "nama_ptn", label: "Nama PTN" },
  { id: "nama_singkat", label: "Nama Singkat"},
];

const PtnContent = () => {
  const [university, setUniversity] = useState<UniversityPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredUniversity, setFilteredUniversity] = useState<UniversityPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/admin/listUniversity");
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: UniversityPackage[] = await response.json();
        setUniversity(data);
        setFilteredUniversity(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
      const filtered = university.filter((campus) =>
        campus.nama_ptn.toLowerCase().includes(searchQuery.toLowerCase()) || campus.nama_singkat.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversity(filtered);
      setPage(0);
    }, [searchQuery, university]);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Perguruan Tinggi Negeri akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/listUniversity/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Gagal menghapus universitas");
          Swal.fire('Terhapus!', 'Data Perguruan Tinggi Negeri berhasil dihapus.', 'success').then(() => {
            setUniversity(prev => prev.filter(p => p.id_ptn !== id));
            setFilteredUniversity(prev => prev.filter(p => p.id_ptn !== id));
          });
        } catch (error) {
          Swal.fire('Gagal!', (error as Error).message || 'Terjadi kesalahan saat menghapus.', 'error');
        }
      }
    });
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

  const paginatedData = filteredUniversity.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (error) {
    return <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Perguruan Tinggi Negeri</h1>
          <TextField
            label="Cari Nama PTN"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/university/tambahPtn" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Tambah PTN
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
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Perguruan Tinggi Negeri</h1>
          <TextField
            label="Cari Nama PTN"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/university/tambahPtn" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Tambah PTN
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
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <p className="text-red-500">Data tidak ditemukan!</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow hover tabIndex={-1} key={row.username}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id} align="center">
                      {row[column.id]}
                    </TableCell>
                  ))}
                <TableCell align="center">
                  <Link to={`/dashboard/university/viewPtn/${row.id_ptn}`}>
                    <Button variant="contained" color="primary" size="small" sx={{ mr: 3, minWidth: 30 }}><Eye size={20} /></Button>
                  </Link>
                  <Link to={`/dashboard/university/editPtn/${row.id_ptn}`}>
                    <Button variant="contained" color="warning" size="small" sx={{ mr: 3, minWidth: 30 }}><Pencil size={20} /></Button>
                  </Link>
                  <Button variant="contained" color="error" size="small" sx={{ mr: 1, minWidth: 30 }} onClick={() => handleDelete(row.id_ptn)}>
                    <Trash size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredUniversity.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Baris per halaman"
      />
    </div>
  );
};

export default PtnContent;