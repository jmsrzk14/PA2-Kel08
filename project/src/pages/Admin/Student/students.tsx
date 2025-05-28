import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TablePagination, TextField
} from "@mui/material";
import { Eye, Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type Students = {
  id: number;
  username: string;
  nisn: string;
  first_name: string;
  kelompok_ujian: string;
};

interface Column {
  id: keyof Students;
  label: string;
}

const columns: readonly Column[] = [
  { id: "first_name", label: "Nama" },
  { id: "kelompok_ujian", label: "Kelompok Ujian" },
];

const StudentsContent = () => {
  const [students, setStudents] = useState<Students[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://160.19.166.155:8000/admin/listStudent");
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: Students[] = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
    setPage(0);
  }, [searchQuery, students]);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Data siswa akan dihapus secara permanen! ${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://160.19.166.155:8000/admin/listStudent/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Gagal menghapus siswa");

          Swal.fire('Terhapus!', 'Data siswa berhasil dihapus.', 'success').then(() => {
            setStudents(prev => prev.filter(p => p.id !== id));
            setFilteredStudents(prev => prev.filter(p => p.id !== id));
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

  if (error) {
    return <div className="p-6">
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Siswa</h1>
      <TextField
        label="Cari Nama Siswa"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
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
  
  const paginatedData = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Siswa</h1>
        <TextField
          label="Cari Nama Siswa"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <TableContainer sx={{ maxHeight: 440, marginTop: 5 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={100}>No</TableCell>
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
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id} align="center">
                      {row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Link to={`/dashboard/students/viewSiswa/${row.username}/${row.id}`}>
                      <Button variant="contained" color="primary" size="small" sx={{ mr: 3, minWidth: 30 }}><Eye size={20} /></Button>
                    </Link>
                    <Link to={`/dashboard/students/editSiswa/${row.username}`}>
                      <Button variant="contained" color="warning" size="small" sx={{ mr: 3, minWidth: 30 }}><Pencil size={20} /></Button>
                    </Link>
                    <Button variant="contained" color="error" size="small" sx={{ mr: 1, minWidth: 30 }} onClick={() => handleDelete(row.id)}>
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
        count={filteredStudents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Baris per halaman"
      />
    </div>
  );
};

export default StudentsContent;
