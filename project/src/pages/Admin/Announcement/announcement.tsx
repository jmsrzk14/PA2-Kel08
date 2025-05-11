import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TablePagination, TextField
} from "@mui/material";
import { Eye, Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type Announcement = {
  id: number;
  judul: string;
};

interface Column {
  id: keyof Announcement; 
  label: string;
}

const columns: readonly Column[] = [
  { id: "judul", label: "Judul" },
];

const AnnouncementContent = () => {
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredPackages, setFilteredPackages] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/admin/listAnnouncement");
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: Announcement[] = await response.json();
        setAnnouncement(data);
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
    const filtered = announcement.filter((announcement) =>
      announcement.judul.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPackages(filtered);
    setPage(0);
  }, [searchQuery, announcement]);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data Pengumuman akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/admin/listAnnouncement/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error("Gagal menghapus pengumuman");
          }
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data Pengumuman berhasil dihapus.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            setAnnouncement(prev => prev.filter(p => p.id !== id));
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
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Pengumuman</h1>
          <TextField
            label="Cari Judul Pengumuman"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/announcement/createAnnouncement" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Buat Pengumuman
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

  const paginatedData = filteredPackages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Pengumuman</h1>
          <TextField
            label="Cari Judul Pengumuman"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/dashboard/announcement/createAnnouncement" className="font-medium text-sm">
          <button className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition-colors">
            Buat Pengumuman
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
            {/* {announcement.map((row, index) => (
              <TableRow hover tabIndex={-1} key={row.id} align="center">
                <TableCell>{index + 1}</TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id} align="center">
                    {column.id === "price" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row[column.id]) : row[column.id]}
                  </TableCell>                
                ))} */}
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
                  <Link to={`/dashboard/announcement/viewAnnouncement/${row.id}`}>
                    <Button variant="contained" color="primary" size="small" sx={{ mr: 3, minWidth: 30 }}><Eye size={20} /></Button>
                  </Link>
                  <Link to={`/dashboard/announcement/editAnnouncement/${row.id}`}>
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

export default AnnouncementContent;