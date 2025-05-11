import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TablePagination, TextField
} from "@mui/material";
import { Eye, Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2';

type Payment = {
  id: string;
  id_paket: number;
  harga: number;
  id_siswa: number;
};

type Student = {
  id: number;
  first_name: string;
};

type Package = {
  id: number;
  nama_paket: string;
};

interface Column {
  id: keyof Payment;
  label: string;
}

const columns: readonly Column[] = [
  { id: "id_siswa", label: "Nama Siswa" },
  { id: "id_paket", label: "Nama Paket" },
  { id: "harga", label: "Harga" },
];

const PaymentContent = () => {
  const [payment, setPayment] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredPayment, setFilteredPayment] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentRes, studentRes, packageRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/admin/listPayment"),
          fetch("http://127.0.0.1:8000/admin/listStudent"),
          fetch("http://127.0.0.1:8000/admin/listPacket"),
        ]);

        if (!paymentRes.ok || !studentRes.ok || !packageRes.ok) throw new Error("Data tidak ditemukan!");

        const paymentData: Payment[] = await paymentRes.json();
        const studentData: Student[] = await studentRes.json();
        const packageData: Package[] = await packageRes.json();

        setPayment(paymentData);
        setFilteredPayment(paymentData);
        setStudents(studentData);
        setPackages(packageData);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const filtered = payment.filter((pay) => {
      const student = students.find((s) => s.id === pay.id_siswa);
      const paket = packages.find((s) => s.id === pay.id_paket);
      return student?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || paket?.nama_paket.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredPayment(filtered);
    setPage(0);
  }, [searchQuery, payment, students, packages]);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStudentName = (id: number) => {
    const student = students.find((s) => s.id === id);
    return student ? student.first_name : "Tidak ditemukan";
  };

  const getPackageName = (id: number) => {
    const paket = packages.find((p) => p.id === id);
    return paket ? paket.nama_paket : "Tidak ditemukan";
  };


  if (loading) {
    return <p className="text-gray-700 text-center">Loading...</p>;
  }

  if (error) {
    return <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Pembayaran</h1>
          <TextField
            label="Cari Nama Paket"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
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
            <TableCell colspan={4} align="center"><p className="text-red-500">Data tidak ditemukan!</p></TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  }

  const paginatedData = filteredPayment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Daftar Pembayaran</h1>
          <TextField
            label="Cari Data Pembayaran"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
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
                      {column.id === "id_siswa" ? getStudentName(row[column.id] as number) :
                        column.id === "id_paket" ? getPackageName(row[column.id] as number) :
                          column.id === "harga" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row[column.id]) :
                            row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Link to={`/dashboard/payment/viewPayment/${row.id}`}>
                      <Button variant="contained" color="primary" size="small" sx={{ minWidth: 30 }}><Eye size={20} /></Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredPayment.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Baris per halaman"
      />
    </div>
  );
};

export default PaymentContent;