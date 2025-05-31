import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TablePagination, TextField
} from "@mui/material";
import { Eye, Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type NewsPackage = {
  id: number;
  judul: string;
};

interface Column {
  id: keyof NewsPackage; 
  label: string;
}

const columns: readonly Column[] = [
  { id: "judul", label: "Judul Berita" },
];

const NewsContent = () => {
  const [news, setNews] = useState<NewsPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredPackages, setFilteredPackages] = useState<NewsPackage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/admin/listNews");
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: NewsPackage[] = await response.json();
        setNews(data);
        setFilteredPackages(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = news.filter((news) =>
      news.judul.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPackages(filtered);
    setPage(0);
  }, [searchQuery, news]);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Berita akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8000/admin/listNews/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error("Gagal menghapus berita");
          }
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data Berita berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            setNews(prev => prev.filter(p => p.id !== id));
            setFilteredPackages(prev => prev.filter(p => p.id !== id));
          });
        } catch (error) {
          Swal.fire({
            title: 'Gagal!',
            text: (error as Error).message || 'Terjadi kesalahan saat menghapus.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
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
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Berita</h1>
          <TextField
            label="Cari Berita"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/news/createNews" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Tambah Berita
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
            <TableCell colSpan={4} align="center"><p className="text-red-500">Data tidak ditemukan!</p></TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  }

  const paginatedData = filteredPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Berita</h1>
          <TextField
            label="Cari Berita"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/news/createNews" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Tambah Berita
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
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id} align="center">
                          {row[column.id]}
                        </TableCell>
                      ))}
                <TableCell align="center">
                  <Link to={`/dashboard/news/viewNews/${row.id}`}>
                    <Button variant="contained" color="primary" size="small" sx={{ mr: 3, minWidth: 30 }}><Eye size={20} /></Button>
                  </Link>
                  <Link to={`/dashboard/news/editNews/${row.id}`}>
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
          count={filteredPackages.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman"
        />
    </div>
  );
};

export default NewsContent;