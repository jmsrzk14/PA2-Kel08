import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

Modal.setAppElement("#root");

function EditProfil() {
    const [studentData, setStudentData] = useState({
        id: "",
        username: "",
        first_name: "",
        nisn: "",
        foto: "",
        asal_sekolah: "",
        kelompok_ujian: "",
        telp1: "",
        pilihan1_utbk: "",
        pilihan2_utbk: "",
        pilihan1_utbk_aktual: "",
        pilihan2_utbk_aktual: "",
    });
    const [displayNames, setDisplayNames] = useState({
        asal_sekolah_nama: "",
        nama_pilihan1_utbk: "",
        nama_pilihan2_utbk: "",
        nama_pilihan1_utbk_aktual: "",
        nama_pilihan2_utbk_aktual: "",
    });
    const [editForm, setEditForm] = useState({
        first_name: "",
        nisn: "",
        foto: "",
        asal_sekolah: "",
        kelompok_ujian: "",
        telp1: "",
        pilihan1_utbk: "",
        pilihan2_utbk: "",
        pilihan1_utbk_aktual: "",
        pilihan2_utbk_aktual: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const [schoolList, setSchoolList] = useState<{ id: string; nama: string; sekolah:string }[]>([]);
    const [provinsiList, setProvinsiList] = useState([]);
    const [kabupatenList, setKabupatenList] = useState([]);
    const [kecamatanList, setKecamatanList] = useState([]);

    const [selectedProvinsi, setSelectedProvinsi] = useState("");
    const [selectedKabupaten, setSelectedKabupaten] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
    
    const [universityList, setUniversityList] = useState([]);
    const [selectedMajor1, setSelectedMajor1] = useState("");
    const [selectedMajor2, setSelectedMajor2] = useState("");
    const [selectedMajor3, setSelectedMajor3] = useState("");
    const [selectedMajor4, setSelectedMajor4] = useState("");
    const [majorList1, setMajorList1] = useState<{ id_prodi: string; nama_prodi:string }[]>([]);
    const [majorList2, setMajorList2] = useState<{ id_prodi: string; nama_prodi:string }[]>([]);
    const [majorList3, setMajorList3] = useState<{ id_prodi: string; nama_prodi:string }[]>([]);
    const [majorList4, setMajorList4] = useState<{ id_prodi: string; nama_prodi:string }[]>([]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        };
    };

    useEffect(() => {
        const fetchWilayah = async () => {
            try {
                const provinsiRes = await axios.get("http://localhost:8000/admin/region/province");
                setProvinsiList(provinsiRes.data || []);
            } catch (error) {
                console.error("Error fetching wilayah:", error);
            }
        };
    
        fetchWilayah();
    }, []);
    
    const handleProvinsiChange = async (selected: any) => {
        setSelectedProvinsi(selected.value);
        setSelectedKabupaten("");
        setSelectedKecamatan("");
        setKabupatenList([]);
        setKecamatanList([]);
        setSchoolList([]);
    
        const kabRes = await axios.get(`http://localhost:8000/admin/region/regency/${selected.value}`);
        setKabupatenList(kabRes.data || []);
    };
    
    const handleKabupatenChange = async (selected: any) => {
        setSelectedKabupaten(selected.value);
        setSelectedKecamatan("");
        setKecamatanList([]);
        setSchoolList([]);
    
        const kecRes = await axios.get(`http://localhost:8000/admin/region/subdistrict/${selected.value}`);
        setKecamatanList(kecRes.data || []);
    };

    const handleKecamatanChange = async (selected: any) => {
        const kecamatanId = selected.value;
        setEditForm((prev) => ({
            ...prev,
            asal_sekolah: "",
        }));
        setSchoolList([]);

        setSelectedKecamatan(kecamatanId);

        if (!kecamatanId || !selectedKabupaten || !selectedProvinsi) {
            return;
        }

        try {
            const sekolahRes = await axios.get(
                `http://localhost:8000/admin/listSekolah/${selectedProvinsi}/${selectedKabupaten}/${kecamatanId}`
            );

            const sekolahData = sekolahRes.data.data.map((item: any) => ({
                id: item.id,
                sekolah: item.sekolah,
            }));

            setSchoolList(sekolahData);

        } catch (error) {
            console.error("Error fetching schools by wilayah:", error);
        }
    };

    useEffect(() => {
        const fetchPtn = async () => {
            try {
                const universityRes = await axios.get("http://localhost:8000/admin/listUniversity");
                setUniversityList(universityRes.data || []);
            } catch (error) {
                console.error("Error fetching wilayah:", error);
            }
        };
    
        fetchPtn();
    }, []);

    const handlePtn1Change = async (selected: any) => {
        const pilihan1Id = selected.value;
        setEditForm((prev) => ({
            ...prev,
            pilihan1_utbk: "",
        }));
        setMajorList1([]);

        setSelectedMajor1(pilihan1Id);

        if (!pilihan1Id) {
            return;
        }

        try {
            const prodi1Res = await axios.get(
                `http://localhost:8000/admin/listMajor/${pilihan1Id}`
            );

            const majorData = prodi1Res.data.data.map((item: any) => ({
                id_prodi: item.id_prodi,
                nama_prodi: item.nama_prodi,
            }));

            setMajorList1(majorData);

        } catch (error) {
            console.error("Error fetching schools by wilayah:", error);
        }
    };

    const handlePtn2Change = async (selected: any) => {
        const pilihan2Id = selected.value;
        setEditForm((prev) => ({
            ...prev,
            pilihan2_utbk: "",
        }));
        setMajorList2([]);

        setSelectedMajor2(pilihan2Id);

        if (!pilihan2Id) {
            return;
        }

        try {
            const prodi2Res = await axios.get(
                `http://localhost:8000/admin/listMajor/${pilihan2Id}`
            );

            const majorData = prodi2Res.data.data.map((item: any) => ({
                id_prodi: item.id_prodi,
                nama_prodi: item.nama_prodi,
            }));

            setMajorList2(majorData);

        } catch (error) {
            console.error("Error fetching schools by wilayah:", error);
        }
    };

    const handlePtn3Change = async (selected: any) => {
        const pilihan3Id = selected.value;
        setEditForm((prev) => ({
            ...prev,
            pilihan1_utbk_aktual: "",
        }));
        setMajorList3([]);

        setSelectedMajor3(pilihan3Id);

        if (!pilihan3Id) {
            return;
        }

        try {
            const prodi3Res = await axios.get(
                `http://localhost:8000/admin/listMajor/${pilihan3Id}`
            );

            const majorData = prodi3Res.data.data.map((item: any) => ({
                id_prodi: item.id_prodi,
                nama_prodi: item.nama_prodi,
            }));

            setMajorList3(majorData);

        } catch (error) {
            console.error("Error fetching schools by wilayah:", error);
        }
    };

    const handlePtn4Change = async (selected: any) => {
        const pilihan4Id = selected.value;
        setEditForm((prev) => ({
            ...prev,
            pilihan2_utbk_aktual: "",
        }));
        setMajorList4([]);

        setSelectedMajor4(pilihan4Id);

        if (!pilihan4Id) {
            return;
        }

        try {
            const prodi4Res = await axios.get(
                `http://localhost:8000/admin/listMajor/${pilihan4Id}`
            );

            const majorData = prodi4Res.data.data.map((item: any) => ({
                id_prodi: item.id_prodi,
                nama_prodi: item.nama_prodi,
            }));

            setMajorList4(majorData);

        } catch (error) {
            console.error("Error fetching schools by wilayah:", error);
        }
    };

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get("http://localhost:8000/student/profile", {
                    withCredentials: true,
                });
                const data = response.data.data;

                setStudentData({
                    id: data.id || "",
                    username: data.username || "",
                    first_name: data.first_name || "",
                    nisn: data.nisn || "",
                    foto: data.foto || "",
                    asal_sekolah: data.asal_sekolah || "",
                    kelompok_ujian: data.kelompok_ujian || "",
                    telp1: data.telp1 || "",
                    pilihan1_utbk: data.pilihan1_utbk || "",
                    pilihan2_utbk: data.pilihan2_utbk || "",
                    pilihan1_utbk_aktual: data.pilihan1_utbk_aktual || "",
                    pilihan2_utbk_aktual: data.pilihan2_utbk_aktual || "",
                });

                setEditForm({
                    first_name: data.first_name || "",
                    nisn: data.nisn || "",
                    foto: data.foto || "",
                    asal_sekolah: data.asal_sekolah || "",
                    kelompok_ujian: data.kelompok_ujian || "",
                    telp1: data.telp1 || "",
                    pilihan1_utbk: data.pilihan1_utbk || "",
                    pilihan2_utbk: data.pilihan2_utbk || "",
                    pilihan1_utbk_aktual: data.pilihan1_utbk_aktual || "",
                    pilihan2_utbk_aktual: data.pilihan2_utbk_aktual || "",
                });

                setSelectedProvinsi(data.provinsi_id);
                setSelectedKabupaten(data.kabupaten_id);
                setSelectedKecamatan(data.kecamatan_id);
                setSelectedMajor1(data.pilihan1_universitas_id);

                if (data.kecamatan_id) {
                    await handleKecamatanChange({ value: data.kecamatan_id });
                }
                if (data.pilihan1_universitas_id) {
                    await handlePtn1Change({ value: data.pilihan1_universitas_id });
                }

            } catch (error: any) {
                console.error("Error fetching data:", error);
                setError("Gagal memuat data. Silakan coba lagi.");
                if (error.response?.status === 401) {
                    navigate("/loginsiswa");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [navigate]);

    const schoolOptions = schoolList.map((school) => ({
        value: school.id,
        label: school.sekolah,
    }));       
    
    const major1Options = majorList1.map((major) => ({
        value: major.id_prodi,
        label: major.nama_prodi,
    }));

    const major2Options = majorList2.map((major) => ({
        value: major.id_prodi,
        label: major.nama_prodi,
    }));

    const major3Options = majorList3.map((major) => ({
        value: major.id_prodi,
        label: major.nama_prodi,
    }));

    const major4Options = majorList4.map((major) => ({
        value: major.id_prodi,
        label: major.nama_prodi,
    }));
    
    const handleSchoolChange = (selectedOption: any) => {
        handleEditFormChange("asal_sekolah", selectedOption?.value || "");
    };

    const handleMajor1Change = (selectedOption: any) => {
        handleEditFormChange("pilihan1_utbk", selectedOption?.value || "");
    };
    
    const handleMajor2Change = (selectedOption: any) => {
        handleEditFormChange("pilihan2_utbk", selectedOption?.value || "");
    };

    const handleMajor3Change = (selectedOption: any) => {
        handleEditFormChange("pilihan1_utbk_aktual", selectedOption?.value || "");
    };

    const handleMajor4Change = (selectedOption: any) => {
        handleEditFormChange("pilihan2_utbk_aktual", selectedOption?.value || "");
    };


    const handleSaveEdit = async () => {
        try {
            const params = new URLSearchParams();

            if (selectedFile) {
                const reader = new FileReader();
                reader.readAsDataURL(selectedFile);

                reader.onloadend = () => {
                    params.append("foto", reader.result as string);

                    Object.entries(editForm).forEach(([key, value]) => {
                        params.append(key, value);
                    });

                    axios.put(
                        `http://localhost:8000/student/update/${studentData.id}`,
                        params.toString(),
                        {
                            withCredentials: true,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        }
                    ).then(() => {
                        setStudentData((prev) => ({
                            ...prev,
                            ...editForm,
                        }));

                        setError("");
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Data Profil Berhasil Diperbaharui.',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                        }).then(() => {
                            navigate("/dashboard/student/profil")
                        });
                    }).catch((error: any) => {
                        console.error("Error updating profile:", error);
                        setError("Gagal memperbarui profil. Silakan coba lagi.");
                    });
                };
            } else {
                // Jika tidak ada foto yang dipilih, kirim data tanpa foto
                Object.entries(editForm).forEach(([key, value]) => {
                    params.append(key, value);
                });

                // Kirim data tanpa foto
                await axios.put(
                    `http://localhost:8000/student/update/${studentData.id}`,
                    params.toString(),
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                setStudentData((prev) => ({
                    ...prev,
                    ...editForm,
                }));

                setError("");
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data Profil Berhasil Diperbaharui.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    navigate("/dashboard/student/profil")
                });
            }

        } catch (error: any) {
            console.error("Error updating profile:", error);
            setError("Gagal memperbarui profil. Silakan coba lagi.");
        }
    };

    const handleEditFormChange = (field: string, value: string) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                {loading && <p className="text-center">Memuat data...</p>}
                <div className="mb-6">
                    <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg font-bold text-lg">
                        PROFIL SISWA
                    </div>
                    <div className="p-4 space-y-2">
                        {/* Nama */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Nama</label>
                            <input
                                type="text"
                                className="w-3/4 border p-1 rounded"
                                value={editForm.first_name}
                                onChange={(e) => handleEditFormChange("first_name", e.target.value)}
                            />
                        </div>
    
                        {/* Username */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Username</label>
                            <input
                                type="text"
                                className="w-3/4 border p-1 rounded bg-gray-100"
                                value={studentData.username}
                                disabled
                            />
                        </div>
    
                        {/* NISN */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">NISN</label>
                            <input
                                type="text"
                                className="w-3/4 border p-1 rounded"
                                value={editForm.nisn}
                                onChange={(e) => handleEditFormChange("nisn", e.target.value)}
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Foto Profil</label>
                            <div className="w-3/4 flex items-center gap-2 relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border p-1 rounded w-full z-10 cursor-pointer"
                                />
                            </div>
                        </div>
    
                        {/* Provinsi */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Provinsi</label>
                            <Select
                                options={provinsiList.map(p => ({ value: p.id, label: p.provinsi }))}
                                onChange={handleProvinsiChange}
                                value={provinsiList
                                    .map(p => ({ value: p.id, label: p.provinsi }))
                                    .find(p => p.value === selectedProvinsi)}
                                className="w-3/4"
                            />
                        </div>
    
                        {/* Kabupaten */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Kabupaten</label>
                            <Select
                                options={kabupatenList.map(k => ({ value: k.id, label: k.kabupaten }))}
                                onChange={handleKabupatenChange}
                                value={kabupatenList
                                    .map(k => ({ value: k.id, label: k.kabupaten }))
                                    .find(k => k.value === selectedKabupaten)}
                                isDisabled={!selectedProvinsi}
                                className="w-3/4"
                            />
                        </div>
    
                        {/* Kecamatan */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Kecamatan</label>
                            <Select
                                options={kecamatanList.map(k => ({ value: k.id, label: k.kecamatan }))}
                                onChange={handleKecamatanChange}
                                value={kecamatanList
                                    .map(k => ({ value: k.id, label: k.kecamatan }))
                                    .find(k => k.value === selectedKecamatan)}
                                isDisabled={!selectedKabupaten}
                                className="w-3/4"
                            />
                        </div>
    
                        {/* Asal Sekolah */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Asal Sekolah</label>
                            <div className="w-3/4">
                                <Select
                                    options={schoolOptions}
                                    value={schoolOptions.find(option => option.value === editForm.asal_sekolah || null)}
                                    onChange={handleSchoolChange}
                                    isSearchable
                                    isDisabled={!selectedKecamatan}
                                    menuPlacement="auto"
                                    placeholder="Cari sekolah..."
                                />
                            </div>
                        </div>
    
                        {/* Kelompok Ujian */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Kelompok Ujian</label>
                            <select
                                id="kelompok_ujian"
                                name="kelompok_ujian"
                                required
                                value={editForm.kelompok_ujian}
                                onChange={(e) => handleEditFormChange("kelompok_ujian", e.target.value)}
                                className="w-3/4 border p-1 rounded"
                            >
                                <option value="SAINTEK">SAINTEK</option>
                                <option value="SOSHUM">SOSHUM</option>
                                <option value="CAMPURAN">CAMPURAN</option>
                            </select>
                        </div>
    
                        {/* Telepon */}
                        <div className="flex items-center">
                            <label className="w-1/4 font-semibold">Telepon</label>
                            <input
                                type="text"
                                className="w-3/4 border p-1 rounded"
                                value={editForm.telp1}
                                onChange={(e) => handleEditFormChange("telp1", e.target.value)}
                            />
                        </div>    
                    </div>
                </div>
                 <div className="mb-6">
                    <div className="bg-black text-white text-center py-2 rounded-t-lg font-bold text-lg">
                        PERGURUAN TINGGI NEGERI & PROGRAM STUDI
                    </div>
                    <div className="p-4 space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <p className="font-semibold">Pilihan 1</p>
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Perguruan Tinggi Negeri</label>
                                <Select
                                    options={universityList.map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))}
                                    onChange={handlePtn1Change}
                                    value={universityList.
                                        map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))
                                        .find(opt => opt.value === String(selectedMajor1))}
                                    className="w-3/4"
                                    placeholder="Pilih PTN..."
                                />
                            </div>
        
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Program Studi</label>
                                <div className="w-3/4">
                                    <Select
                                        options={major1Options}
                                        value={major1Options.find(option => option.value === editForm.pilihan1_utbk) || null}
                                        onChange={handleMajor1Change}
                                        isSearchable
                                        isDisabled={!selectedMajor1}
                                        placeholder="Pilih Program Studi..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <p className="font-semibold">Pilihan 2</p>
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Perguruan Tinggi Negeri</label>
                                <Select
                                    options={universityList.map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))}
                                    onChange={handlePtn2Change}
                                    value={universityList.
                                        map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))
                                        .find(opt => opt.value === String(selectedMajor2))}
                                    className="w-3/4"
                                    placeholder="Pilih PTN..."
                                />
                            </div>
        
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Program Studi</label>
                                <div className="w-3/4">
                                    <Select
                                        options={major2Options}
                                        value={major2Options.find(option => option.value === editForm.pilihan2_utbk) || null}
                                        onChange={handleMajor2Change}
                                        isSearchable
                                        isDisabled={!selectedMajor2}
                                        placeholder="Pilih Program Studi..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <p className="font-semibold">Pilihan 3</p>
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Perguruan Tinggi Negeri</label>
                                <Select
                                    options={universityList.map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))}
                                    onChange={handlePtn3Change}
                                    value={universityList.
                                        map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))
                                        .find(opt => opt.value === String(selectedMajor3))}
                                    className="w-3/4"
                                    placeholder="Pilih PTN..."
                                />
                            </div>
        
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Program Studi</label>
                                <div className="w-3/4">
                                    <Select
                                        options={major3Options}
                                        value={major3Options.find(option => option.value === editForm.pilihan1_utbk_aktual) || null}
                                        onChange={handleMajor3Change}
                                        isSearchable
                                        isDisabled={!selectedMajor3}
                                        placeholder="Pilih Program Studi..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <p className="font-semibold">Pilihan 4</p>
                            </div>
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Perguruan Tinggi Negeri</label>
                                <Select
                                    options={universityList.map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))}
                                    onChange={handlePtn4Change}
                                    value={universityList.
                                        map(u => ({ value: String(u.id_ptn), label: u.nama_ptn }))
                                        .find(opt => opt.value === String(selectedMajor4))}
                                    className="w-3/4"
                                    placeholder="Pilih PTN..."
                                />
                            </div>
        
                            <div className="flex items-center">
                                <label className="w-1/4 font-semibold">Program Studi</label>
                                <div className="w-3/4">
                                    <Select
                                        options={major4Options}
                                        value={major4Options.find(option => option.value === editForm.pilihan2_utbk_aktual) || null}
                                        onChange={handleMajor4Change}
                                        isSearchable
                                        isDisabled={!selectedMajor4}
                                        placeholder="Pilih Program Studi..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleSaveEdit}
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    );    
}

export default EditProfil;