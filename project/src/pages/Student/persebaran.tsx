import { useEffect, useState } from "react";
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

type Prodi = {
  id_prodi: number;
  nama_prodi: string;
  nama_prodi_ptn: string;
  peminat?: number;
  daya_tampung?: number;
};

interface Column {
  id: keyof Prodi | 'kondisi_peminat';
  label: string;
}

const columns: readonly Column[] = [
  { id: "nama_prodi_ptn", label: "Nama PTN" },
  { id: "nama_prodi", label: "Nama Prodi" },
  { id: "peminat", label: "Peminat" },
  { id: "daya_tampung", label: "Daya Tampung" },
  { id: "kondisi_peminat", label: "Kondisi Peminat" },
];

const getShortPtnName = (namaPtn: string): string => {
  if (!namaPtn) return "-";
  const parts = namaPtn.split(" - ");
  if (parts.length > 1) return parts[parts.length - 1].trim();
  const words = namaPtn.trim().split(" ");
  return words[words.length - 1] || namaPtn;
};

const getKondisiPeminat = (peminat: number | undefined, dayaTampung: number | undefined) => {
  if (peminat === undefined || dayaTampung === undefined || dayaTampung === 0) {
    return { label: "-", className: "text-gray-500" };
  }

  const ratio = peminat / dayaTampung;
  if (ratio <= 0.25) {
    return {
      label: "Peminat Sepi",
      className: "px-2 py-1 bg-green-200 text-green-800 rounded font-semibold",
    };
  } else if (ratio <= 0.50) {
    return {
      label: "Peminat Sedang",
      className: "px-2 py-1 bg-blue-200 text-blue-800 rounded font-semibold",
    };
  } else if (ratio <= 0.75) {
    return {
      label: "Peminat Ramai",
      className: "px-2 py-1 bg-orange-200 text-orange-800 rounded font-semibold",
    };
  } else {
    return {
      label: "Peminat Sangat Ramai",
      className: "px-2 py-1 bg-red-200 text-red-800 rounded font-semibold",
    };
  }
};

const PersebaranContent = () => {
  const [prodi, setProdi] = useState<Prodi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchPtn, setSearchPtn] = useState<string>("");
  const [searchProdi, setSearchProdi] = useState<string>("");
  const [searchKondisi, setSearchKondisi] = useState<string>("");
  const [filteredPackages, setFilteredPackages] = useState<Prodi[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://52.205.255.169/admin/listMajor");
        if (!response.ok) throw new Error("Data tidak ditemukan!");
        const data: Prodi[] = await response.json();

        const prodiWithCapacity = await Promise.all(
          data.map(async (item) => {
            try {
              const capacityResponse = await fetch(`https://52.205.255.169/admin/viewCapacity/${item.id_prodi}`);
              if (!capacityResponse.ok) throw new Error("Gagal mengambil kapasitas");
              const capacityData = await capacityResponse.json();
              return {
                ...item,
                peminat: capacityData[0]?.peminat ?? 0,
                daya_tampung: capacityData[0]?.daya_tampung ?? 0,
              };
            } catch (err) {
              console.error(`Error fetching capacity for prodi ${item.id_prodi}:`, err);
              return { ...item, peminat: 0, daya_tampung: 0 };
            }
          })
        );

        setProdi(prodiWithCapacity);
        setFilteredPackages(prodiWithCapacity);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = prodi.filter((prodi) => {
      const matchesQuery = prodi.nama_prodi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPtn = searchPtn
        ? prodi.nama_prodi_ptn.toLowerCase().includes(searchPtn.toLowerCase())
        : true;
      const matchesProdi = searchProdi
        ? prodi.nama_prodi.toLowerCase().includes(searchProdi.toLowerCase())
        : true;
      const matchesKondisi = searchKondisi
        ? getKondisiPeminat(prodi.peminat, prodi.daya_tampung).label === searchKondisi
        : true;

      return matchesQuery && matchesPtn && matchesProdi && matchesKondisi;
    });
    setFilteredPackages(filtered);
  }, [searchQuery, searchPtn, searchProdi, searchKondisi, prodi]);

  const kondisiOptions = ["", "Peminat Sangat Ramai", "Peminat Ramai", "Peminat Sedang", "Peminat Sepi"];

  if (loading) {
    return <p className="text-gray-700 text-center">Loading...</p>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Persebaran Prodi</h1>
          </div>
        </div>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width={100}>No</TableCell>
                {columns.map((column) => (
                  <TableCell width={column.id === "kondisi_peminat" ? 500 : 400} align="center" key={column.id}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell align="center">
                  <TextField
                    label="Cari Nama PTN"
                    variant="outlined"
                    size="small"
                    value={searchPtn}
                    onChange={(e) => setSearchPtn(e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    label="Cari Nama Prodi"
                    variant="outlined"
                    size="small"
                    value={searchProdi}
                    onChange={(e) => setSearchProdi(e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell align="center">
                  <FormControl fullWidth size="small">
                    <InputLabel>Pilih Kondisi</InputLabel>
                    <Select
                      value={searchKondisi}
                      onChange={(e) => setSearchKondisi(e.target.value)}
                      label="Pilih Kondisi"
                    >
                      {kondisiOptions.map((kondisi) => (
                        <MenuItem key={kondisi} value={kondisi}>{kondisi || "Semua"}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableCell colSpan={6} align="center">
                <p className="text-red-500">Data tidak ditemukan!</p>
              </TableCell>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-[1em]">Persebaran Prodi</h1>
        </div>
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell width={100}>No</TableCell>
              {columns.map((column) => (
                <TableCell width={column.id === "kondisi_peminat" ? 500 : 400} key={column.id}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell align="center">
                <TextField
                  label="Search PTN"
                  variant="outlined"
                  size="small"
                  value={searchPtn}
                  onChange={(e) => setSearchPtn(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '32px',
                      fontSize: '0.75rem',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  label="Search Prodi"
                  variant="outlined"
                  size="small"
                  value={searchProdi}
                  onChange={(e) => setSearchProdi(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '32px',
                      fontSize: '0.75rem',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell align="center">
                <FormControl fullWidth size="small" sx={{
                  '& .MuiInputBase-root': {
                    height: '32px',
                    fontSize: '0.75rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem',
                    top: '-5px',
                  },
                }}>
                  <Select
                    value={searchKondisi}
                    onChange={(e) => setSearchKondisi(e.target.value)}
                  >
                    {kondisiOptions.map((kondisi) => (
                      <MenuItem key={kondisi} value={kondisi}>{kondisi || "Semua"}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <p className="text-red-500">Data tidak ditemukan!</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredPackages.map((row, index) => (
                <TableRow hover tabIndex={-1} key={row.id_prodi}>
                  <TableCell>{index + 1}</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.id === "nama_prodi_ptn" ? (
                        getShortPtnName(row.nama_prodi_ptn)
                      ) : column.id === "kondisi_peminat" ? (
                        <span className={getKondisiPeminat(row.peminat, row.daya_tampung).className}style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                        }}>
                          {getKondisiPeminat(row.peminat, row.daya_tampung).label}
                        </span>
                      ) : (
                        row[column.id] ?? "-"
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PersebaranContent;