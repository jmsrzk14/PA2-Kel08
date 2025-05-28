import React, { useEffect, useState } from "react";
import axios from 'axios';

interface Choice {
    id: number;
    universitas: string;
}

interface Siswa1 {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai1 {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa1All {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai1All {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa2 {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai2 {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa2All {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai2All {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa3 {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai3 {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa3All {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai3All {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa4 {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai4 {
    id: number;
    id_siswa: number;
    total: number;
}

interface Siswa4All {
    id: number;
    nama: string;
    pilihan1_utbk: string;
    pilihan2_utbk: string;
    pilihan1_utbk_aktual: string;
    pilihan2_utbk_aktual: string;
    total?: number;
}

interface Nilai4All {
    id: number;
    id_siswa: number;
    total: number;
}

const HasilTryout = () => {
    const [choices, setChoices] = useState<Choice[]>([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalSchool, setTotalSchool] = useState(0);
    const [idUsers, setIdUsers] = useState(0);
    const [namaUsers, setNamaUsers] = useState('');
    const [asalSekolah, setAsalSekolah] = useState('');
    const [kelompokUjian, setKelompokUjian] = useState('');
    const [pilihan1Id, setPilihan1Id] = useState('');
    const [pilihan2Id, setPilihan2Id] = useState('');
    const [pilihan1IdAktual, setPilihan1IdAktual] = useState('');
    const [pilihan2IdAktual, setPilihan2IdAktual] = useState('');
    const [pilihan1, setPilihan1] = useState('');
    const [pilihan2, setPilihan2] = useState('');
    const [pilihan1Aktual, setPilihan1Aktual] = useState('');
    const [pilihan2Aktual, setPilihan2Aktual] = useState('');
    const [dayaTampung1, setDayaTampung1] = useState(0);
    const [dayaTampung2, setDayaTampung2] = useState(0);
    const [dayaTampung1Aktual, setDayaTampung1Aktual] = useState(0);
    const [dayaTampung2Aktual, setDayaTampung2Aktual] = useState(0);
    const [peminat1, setPeminat1] = useState('');
    const [peminat2, setPeminat2] = useState('');
    const [peminat1Aktual, setPeminat1Aktual] = useState('');
    const [peminat2Aktual, setPeminat2Aktual] = useState('');
    const [nilai, setNilai] = useState<{ jenis: string; nilai: number }[]>([]);
    const [siswa1Data, setSiswa1Data] = useState<Siswa1[]>([]);
    const [siswa1DataAll, setSiswa1DataAll] = useState<Siswa1All[]>([]);
    const [siswa2Data, setSiswa2Data] = useState<Siswa2[]>([]);
    const [siswa2DataAll, setSiswa2DataAll] = useState<Siswa2All[]>([]);
    const [siswa3Data, setSiswa3Data] = useState<Siswa3[]>([]);
    const [siswa3DataAll, setSiswa3DataAll] = useState<Siswa3All[]>([]);
    const [siswa4Data, setSiswa4Data] = useState<Siswa4[]>([]);
    const [siswa4DataAll, setSiswa4DataAll] = useState<Siswa4All[]>([]);
    const [rank1, setRank1] = useState<number | null>(null);
    const [rank2, setRank2] = useState<number | null>(null);
    const [rank3, setRank3] = useState<number | null>(null);
    const [rank4, setRank4] = useState<number | null>(null);
    const [rank1All, setRank1All] = useState<number | null>(null);
    const [rank2All, setRank2All] = useState<number | null>(null);
    const [rank3All, setRank3All] = useState<number | null>(null);
    const [rank4All, setRank4All] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
          const endpoints = [
            { url: "https://160.19.166.155:8000/admin/listStudent", setter: setTotalStudents },
            { url: "https://160.19.166.155:8000/admin/listSekolah", setter: setTotalSchool },
          ];
          for (const { url, setter } of endpoints) {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error("Gagal mengambil data");
              const data = await response.json();
              setter(data.length);
            } catch (error) {
              console.error("Error:", error);
              setError("Terjadi kesalahan saat mengambil data.");
            } finally {
              setLoading(false);
            }
          }
        };
        fetchData();
      }, []);

    useEffect(() => {
        const fetchAdmin = async () => {
            setLoading(true);
            setError('');
            try {
            const response = await axios.get(`https://160.19.166.155:8000/student/profile`, {
                withCredentials: true,
            });

            const data = response.data;

            setIdUsers(data.data.id);
            setNamaUsers(data.data.first_name);
            setKelompokUjian(data.data.kelompok_ujian);
            const sekolahId = data.data.asal_sekolah;
            setAsalSekolah(sekolahId);
            const pilihan1Id = data.data.pilihan1_utbk;
            setPilihan1Id(pilihan1Id);
            const pilihan2Id = data.data.pilihan2_utbk;
            setPilihan2Id(pilihan2Id);
            const pilihan1AktualId = data.data.pilihan1_utbk_aktual;
            setPilihan1IdAktual(pilihan1AktualId);
            const pilihan2AktualId = data.data.pilihan2_utbk_aktual;
            setPilihan2IdAktual(pilihan2AktualId);            

            if (sekolahId) {
                const sekolahRes = await axios.get(`https://160.19.166.155:8000/admin/viewSekolah/${sekolahId}`);
                const namaSekolah = sekolahRes.data.sekolah;
                setAsalSekolah(namaSekolah);
            }

            if (pilihan1Id) {
                const pilihan1Res = await axios.get(`https://160.19.166.155:8000/admin/viewMajor/${pilihan1Id}`);
                const namaPilihan1 = pilihan1Res.data.nama_prodi_ptn;
                setPilihan1(namaPilihan1);
                const dayaTampung1Res = await axios.get(`https://160.19.166.155:8000/admin/viewCapacity/${pilihan1Id}`);
                const dayaTampung1 = dayaTampung1Res.data[0]?.daya_tampung;
                setDayaTampung1(dayaTampung1);
                const peminat1 = dayaTampung1Res.data[0]?.peminat;
                setPeminat1(peminat1);
            }

            if (pilihan2Id) {
                const pilihan2Res = await axios.get(`https://160.19.166.155:8000/admin/viewMajor/${pilihan2Id}`);
                const namaPilihan2 = pilihan2Res.data.nama_prodi_ptn;
                setPilihan2(namaPilihan2);
                const dayaTampung2Res = await axios.get(`https://160.19.166.155:8000/admin/viewCapacity/${pilihan2Id}`);
                const dayaTampung2 = dayaTampung2Res.data[0]?.daya_tampung;
                setDayaTampung2(dayaTampung2);
                const peminat2 = dayaTampung2Res.data[0]?.peminat;
                setPeminat2(peminat2);
            }

            if (pilihan1AktualId) {
                const pilihan1AktualRes = await axios.get(`https://160.19.166.155:8000/admin/viewMajor/${pilihan1AktualId}`);
                const namaPilihanAktual1 = pilihan1AktualRes.data.nama_prodi_ptn;
                setPilihan1Aktual(namaPilihanAktual1);
                const dayaTampung1AktualRes = await axios.get(`https://160.19.166.155:8000/admin/viewCapacity/${pilihan1AktualId}`);
                const dayaTampung1Aktual = dayaTampung1AktualRes.data[0]?.daya_tampung;
                setDayaTampung1Aktual(dayaTampung1Aktual);
                const peminat1Aktual = dayaTampung1AktualRes.data[0]?.peminat;
                setPeminat1Aktual(peminat1Aktual);
            }

            if (pilihan2AktualId) {
                const pilihan2AktualRes = await axios.get(`https://160.19.166.155:8000/admin/viewMajor/${pilihan2AktualId}`);
                const namaPilihanAktual2 = pilihan2AktualRes.data.nama_prodi_ptn;
                setPilihan2Aktual(namaPilihanAktual2);
                const dayaTampung2AktualRes = await axios.get(`https://160.19.166.155:8000/admin/viewCapacity/${pilihan2AktualId}`);
                const dayaTampung2Aktual = dayaTampung2AktualRes.data[0]?.daya_tampung;
                setDayaTampung2Aktual(dayaTampung2Aktual);
                const peminat2Aktual = dayaTampung2AktualRes.data[0]?.peminat;
                setPeminat2Aktual(peminat2Aktual);
            }

            } catch (error) {
            console.error("Error fetching data:", error);
            setError('Gagal memuat data. Silakan coba lagi.');
            } finally {
            setLoading(false);
            }
        };
        fetchAdmin();
    }, []);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await fetch(`https://160.19.166.155:8000/admin/viewScoreYear/${idUsers}`);
                const data = await res.json();
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("Data nilai tidak ditemukan.");
                }

                const nilaiObj = data[0];
                
                const jenisMap = [
                    { key: "pu", label: "PU" },
                    { key: "ppu", label: "PPU" },
                    { key: "pbm", label: "PBM" },
                    { key: "pk", label: "PK" },
                    { key: "lbi", label: "LBI" },
                    { key: "lbe", label: "LBE" },
                    { key: "pm", label: "PM" },
                    { key: "total", label: "TOTAL" },
                ];

                const nilaiArray = jenisMap.map(item => ({
                    jenis: item.label,
                    nilai: nilaiObj[item.key] || 0
                }));

                setNilai(nilaiArray);
                setError("");

            } catch (error) {
                console.error("Gagal mengambil detail tryout:", error);
                setError("");
            }
        };

        if (idUsers) {
            fetchScore();
        }
    }, [idUsers]);

    useEffect(() => {
        const fetchRank1 = async () => {
            try{
                if (!pilihan1Id) return;

                axios.get(`https://160.19.166.155:8000/admin/listScoreHigh/1/${pilihan1Id}`)
                    .then(response => {
                        const siswaList: Siswa1[] = response.data.siswa;
                        const nilaiList: Nilai1[] = response.data.nilai;

                        const siswaWithNilai: Siswa1[] = siswaList.map((siswa: Siswa1) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai1) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa1Data(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa1) => siswa.id === idUsers) + 1;
                        setRank1(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };

            try{
                axios.get(`https://160.19.166.155:8000/admin/listScoreHighAll/${pilihan1Id}`)
                    .then(response => {
                        const siswaList: Siswa1All[] = response.data.siswa;
                        const nilaiList: Nilai1All[] = response.data.nilai;

                        const siswaWithNilai: Siswa1All[] = siswaList.map((siswa: Siswa1All) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai1All) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa1DataAll(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa1All) => siswa.id === idUsers) + 1;
                        setRank1All(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };
        }

        const fetchRank2 = async () => {
            try{
                if (!pilihan2Id) return;

                axios.get(`https://160.19.166.155:8000/admin/listScoreHigh/2/${pilihan2Id}`)
                    .then(response => {
                        const siswaList: Siswa2[] = response.data.siswa;
                        const nilaiList: Nilai2[] = response.data.nilai;

                        const siswaWithNilai: Siswa2[] = siswaList.map((siswa: Siswa2) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai2) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa2Data(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa2) => siswa.id === idUsers) + 1;
                        setRank2(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };

            try{
                axios.get(`https://160.19.166.155:8000/admin/listScoreHighAll/${pilihan2Id}`)
                    .then(response => {
                        const siswaList: Siswa2All[] = response.data.siswa;
                        const nilaiList: Nilai2All[] = response.data.nilai;

                        const siswaWithNilai: Siswa2All[] = siswaList.map((siswa: Siswa2All) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai2All) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa2DataAll(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa2All) => siswa.id === idUsers) + 1;
                        setRank2All(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };
        }

        const fetchRank3 = async () => {
            try{
                if (!pilihan1IdAktual) return;

                axios.get(`https://160.19.166.155:8000/admin/listScoreHigh/3/${pilihan1IdAktual}`)
                    .then(response => {
                        const siswaList: Siswa3[] = response.data.siswa;
                        const nilaiList: Nilai3[] = response.data.nilai;

                        const siswaWithNilai: Siswa3[] = siswaList.map((siswa: Siswa3) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai3) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa3Data(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa3) => siswa.id === idUsers) + 1;
                        setRank3(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };

            try{
                axios.get(`https://160.19.166.155:8000/admin/listScoreHighAll/${pilihan1IdAktual}`)
                    .then(response => {
                        const siswaList: Siswa3All[] = response.data.siswa;
                        const nilaiList: Nilai3All[] = response.data.nilai;

                        const siswaWithNilai: Siswa3All[] = siswaList.map((siswa: Siswa3All) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai3All) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa3DataAll(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa3All) => siswa.id === idUsers) + 1;
                        setRank3All(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };
        }

        const fetchRank4 = async () => {
            try{
                if (!pilihan1IdAktual) return;

                axios.get(`https://160.19.166.155:8000/admin/listScoreHigh/4/${pilihan2IdAktual}`)
                    .then(response => {
                        const siswaList: Siswa4[] = response.data.siswa;
                        const nilaiList: Nilai4[] = response.data.nilai;

                        const siswaWithNilai: Siswa4[] = siswaList.map((siswa: Siswa4) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai4) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa4Data(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa4) => siswa.id === idUsers) + 1;
                        setRank4(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };

            try{
                axios.get(`https://160.19.166.155:8000/admin/listScoreHighAll/${pilihan2IdAktual}`)
                    .then(response => {
                        const siswaList: Siswa4All[] = response.data.siswa;
                        const nilaiList: Nilai4All[] = response.data.nilai;

                        const siswaWithNilai: Siswa4All[] = siswaList.map((siswa: Siswa4All) => {
                            const nilaiSiswa = nilaiList.find((nilai: Nilai4All) => nilai.id_siswa === siswa.id);
                            return {
                                ...siswa,
                                total: nilaiSiswa ? nilaiSiswa.total : 0
                            };
                        });

                        siswaWithNilai.sort((a, b) => (b.total || 0) - (a.total || 0));
                        setSiswa4DataAll(siswaWithNilai);

                        const siswaRank = siswaWithNilai.findIndex((siswa: Siswa4All) => siswa.id === idUsers) + 1;
                        setRank4All(siswaRank);
                    })
            } catch(error) {
                console.error('Error fetching data:', error);
            };
        }

        if (pilihan1Id) {
            fetchRank1();
        }
        if (pilihan2Id) {
            fetchRank2();
        }
        if (pilihan1IdAktual) {
            fetchRank3();
        }
        if (pilihan2IdAktual) {
            fetchRank4();
        }
    }, [pilihan1Id, pilihan2Id, pilihan1IdAktual, pilihan2IdAktual]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-600 text-white py-2 rounded-md font-bold">
                    {totalStudents} Siswa Pendaftar Saat Ini
                </div>
                <div className="bg-blue-800 text-white py-2 rounded-md font-bold">
                    {totalSchool} Jumlah Sekolah Pendaftar
                </div>
            </div>
            <hr className="border-t border-gray-300 py-2 mt-5" />

            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-left">{namaUsers || "Belum ada data"}</p>
                    <p className="font-bold text-center flex-1">{asalSekolah || "Belum ada data"}</p>
                    <p className="font-bold text-right">{kelompokUjian || "Belum ada data"}</p>
                </div>
                <hr className="border-t border-gray-300 mt-4" />
            </div>


            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-600 text-white py-2 rounded-md font-bold">
                    Pilihan 1: {pilihan1 || "Belum ada pilihan"} <br></br> 
                    <div className="flex justify-around">
                        <div>
                            Daya Tampung: {dayaTampung1 || "-"}
                        </div>
                        <div>
                            Peminat: {peminat1 || "-"}
                        </div>
                    </div>
                </div>
                <div className="bg-blue-800 text-white py-2 rounded-md font-bold">
                    Pilihan 2: {pilihan2 || "Belum ada pilihan"} <br></br> 
                    <div className="flex justify-around">
                        <div>
                            Daya Tampung: {dayaTampung2 || "-"}
                        </div>
                        <div>
                            Peminat: {peminat2 || "-"}
                        </div>
                    </div>
                </div>
                <div className="bg-green-600 text-white py-2 rounded-md font-bold">
                    Pilihan 3: {pilihan1Aktual || "Belum ada pilihan"} <br></br> 
                    <div className="flex justify-around">
                        <div>
                            Daya Tampung: {dayaTampung1Aktual || "-"}
                        </div>
                        <div>
                            Peminat: {peminat1Aktual || "-"}
                        </div>
                    </div>
                </div>
                <div className="bg-blue-800 text-white py-2 rounded-md font-bold">
                    Pilihan 4: {pilihan2Aktual || "Belum ada pilihan"} <br></br>
                    <div className="flex justify-around">
                        <div>
                            Daya Tampung: {dayaTampung2Aktual || "-"}
                        </div>
                        <div>
                            Peminat: {peminat2Aktual || "-"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 text-sm text-center mt-4">
                <div>
                <hr className="border-t py-2 border-gray-300 mt-5" />
                    <p className="text-red-600 font-bold">Pilihan 1: {pilihan1}</p>
                    {rank1 !== null ? (
                    <p className="text-red-600">
                        Peringkat {rank1} dari {siswa1Data.length} Pendaftar Pilihan 1
                        <p className="text-red-600 mb-4">Peringkat {rank1All} dari {siswa1DataAll.length} Total Pendaftar</p>
                        {rank1 <= dayaTampung1 ? (
                        <span className="ml-2 px-2 py-1 mt-3 bg-green-200 text-green-800 rounded font-semibold">
                            Lulus
                        </span>
                        ) : (
                        <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                            Ditolak
                        </span>
                        )}
                    </p>
                    ) : (
                    <p className="text-red-600">Menunggu data...</p>
                    )}

                    <p className="text-red-600 font-bold mt-10">Pilihan 3: {pilihan1Aktual}</p>
                    {rank3 !== null ? (
                    <p className="text-red-600">
                        Peringkat {rank3} dari {siswa3Data.length} Pendaftar Pilihan 3
                        <p className="text-red-600 mb-4">Peringkat {rank3All} dari {siswa3DataAll.length} Total Pendaftar</p>
                        {rank3 <= dayaTampung1Aktual ? (
                        <span className="ml-2 px-2 py-1 mt-3 bg-green-200 text-green-800 rounded font-semibold">
                            Lulus
                        </span>
                        ) : (
                        <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                            Ditolak
                        </span>
                        )}
                    </p>
                    ) : (
                    <p className="text-red-600">Menunggu data...</p>
                    )}

                    <hr className="border-t border-gray-300 mt-5" />
                </div>
                <div>
                <hr className="border-t py-2 border-gray-300 mt-5" />
                    <p className="text-red-600 font-bold">Pilihan 2: {pilihan2}</p>
                    {rank2 !== null ? (
                    <p className="text-red-600">
                        Peringkat {rank2} dari {siswa2Data.length} Pendaftar Pilihan 2
                        <p className="text-red-600 mb-4">Peringkat {rank2All} dari {siswa2DataAll.length} Total Pendaftar</p>
                        {rank2 <= dayaTampung2 ? (
                        <span className="ml-2 px-2 py-1 mt-3 bg-green-200 text-green-800 rounded font-semibold">
                            Lulus
                        </span>
                        ) : (
                        <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                            Ditolak
                        </span>
                        )}
                    </p>
                    ) : (
                    <p className="text-red-600">Menunggu data...</p>
                    )}

                    <p className="text-red-600 font-bold mt-10">Pilihan 4: {pilihan2Aktual}</p>
                    {rank4 !== null ? (
                    <p className="text-red-600">
                        Peringkat {rank4} dari {siswa4Data.length} Pendaftar Pilihan 4
                        <p className="text-red-600 mb-4">Peringkat {rank4All} dari {siswa4DataAll.length} Total Pendaftar</p>
                        {rank4 <= dayaTampung2Aktual ? (
                        <span className="ml-2 px-2 py-1 mt-3 bg-green-200 text-green-800 rounded font-semibold">
                            Lulus
                        </span>
                        ) : (
                        <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                            Ditolak
                        </span>
                        )}
                    </p>
                    ) : (
                    <p className="text-red-600">Menunggu data...</p>
                    )}
                    <hr className="border-t border-gray-300 mt-5" />
                </div>
            </div>

            <div className="mt-6">
                <p className="font-bold">Tabel Nilai</p>
                <table className="w-full border-collapse border border-gray-300 text-center text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">PU</th>
                            <th className="border p-2">PPU</th>
                            <th className="border p-2">PBM</th>
                            <th className="border p-2">PK</th>
                            <th className="border p-2">LBI</th>
                            <th className="border p-2">LBE</th>
                            <th className="border p-2">PM</th>
                            <th className="border p-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr className="text-center">
                                {nilai.map((item, index) => (
                                    <td key={index} className="border p-2">{item.nilai}</td>
                                ))}
                            </tr>
                    </tbody>
                </table>
            </div>

            
            <p className="text-center text-gray-500 text-xs mt-6">©2023 KAWAL PTN-KU</p>
        </div>
    );
};

export default HasilTryout;