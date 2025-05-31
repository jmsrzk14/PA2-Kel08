import { useEffect, useState } from "react";
import Modal from "react-modal";
import { AlertTriangleIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

Modal.setAppElement("#root");

function Profil() {
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
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

    useEffect(() => {
        const fetchStudent = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get("https://52.205.255.169/student/profile", {
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

                const [sekolahRes, prodi1Res, prodi2Res, prodi1AktualRes, prodi2AktualRes] = await Promise.all([
                    axios.get(`https://52.205.255.169/admin/viewSekolah/${data.asal_sekolah}`),
                    axios.get(`https://52.205.255.169/admin/viewMajor/${data.pilihan1_utbk}`),
                    axios.get(`https://52.205.255.169/admin/viewMajor/${data.pilihan2_utbk}`),
                    axios.get(`https://52.205.255.169/admin/viewMajor/${data.pilihan1_utbk_aktual}`),
                    axios.get(`https://52.205.255.169/admin/viewMajor/${data.pilihan2_utbk_aktual}`),
                ]);

                setDisplayNames({
                    asal_sekolah_nama: sekolahRes.data.sekolah || "",
                    nama_pilihan1_utbk: prodi1Res.data.nama_prodi_ptn || "",
                    nama_pilihan2_utbk: prodi2Res.data.nama_prodi_ptn || "",
                    nama_pilihan1_utbk_aktual: prodi1AktualRes.data.nama_prodi_ptn || "",
                    nama_pilihan2_utbk_aktual: prodi2AktualRes.data.nama_prodi_ptn || "",
                });
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

        const fetchSchools = async () => {
            try {
                const response = await axios.get("https://52.205.255.169/admin/listSekolah", {
                    withCredentials: true,
                });
                setSchoolList(response.data || []);
            } catch (error) {
                console.error("Error fetching schools:", error);
            }
        };

        fetchSchools();        
        fetchStudent();
    }, [navigate]);

    const schoolOptions = schoolList.map((school) => ({
        value: school.id,
        label: school.sekolah,
    }));
    
    const handleSchoolChange = (selectedOption: any) => {
        handleEditFormChange("asal_sekolah", selectedOption?.value || "");
    };

    const handleSaveEdit = async () => {
        try {
            const params = new URLSearchParams();
            Object.entries(editForm).forEach(([key, value]) => {
                params.append(key, value);
            });
    
            console.log(params.toString());
            console.log(studentData.id);
            
            await axios.put(
                `https://52.205.255.169/student/update/${studentData.id}`,
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
    
            setEditModalOpen(false);
            setError("");
            Swal.fire({
                title: 'Berhasil!',
                text: 'Data Profil Berhasil Diperbaharui.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });
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
                    <div className="bg-green-500 text-white text-center py-2 rounded-t-lg font-bold text-lg">
                        PROFIL SISWA
                    </div>
                    <div className="flex sp-4 space-y-2">
                        <div className="w-3/4 space-y-2 p-4">
                            <div className="flex">
                                <span className="w-1/4 font-semibold">Nama</span>
                                <span className="w-3/4">: {studentData.first_name}</span>
                            </div>
                            <div className="flex">
                                <span className="w-1/4 font-semibold">Username</span>
                                <span className="w-3/4">: {studentData.username}</span>
                            </div>
                            <div className="flex">
                                <span className="w-1/4 font-semibold">NISN</span>
                                <span className="w-3/4">: {studentData.nisn}</span>
                            </div>
                            <div className="flex">
                                <span className="w-1/4 font-semibold">Asal Sekolah</span>
                                <span className="w-3/4">: {displayNames.asal_sekolah_nama}</span>
                            </div>
                            <div className="flex">
                                <span className="w-1/4 font-semibold">Kelompok Ujian</span>
                                <span className="w-3/4">: {studentData.kelompok_ujian}</span>
                            </div>
                            <div className="flex">
                                <span className="w-1/4 font-semibold">Telepon</span>
                                <span className="w-3/4">: {studentData.telp1}</span>
                            </div>
                        </div>
                        <div className="w-1/4">
                            <img className="w-[7em] h-auto mt-4 ml-5" src={`https://52.205.255.169/${studentData.foto?.replace(/\\/g, "/")}`} />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg font-bold text-lg">
                        PILIHAN KAMPUS DAN JURUSAN
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex">
                            <span className="w-1/4 font-semibold">Pilihan 1 UTBK</span>
                            <span className="w-3/4">: {displayNames.nama_pilihan1_utbk}</span>
                        </div>
                        <div className="flex">
                            <span className="w-1/4 font-semibold">Pilihan 2 UTBK</span>
                            <span className="w-3/4">: {displayNames.nama_pilihan2_utbk}</span>
                        </div>
                        <div className="flex">
                            <span className="w-1/4 font-semibold">Pilihan 1 UTBK Aktual</span>
                            <span className="w-3/4">: {displayNames.nama_pilihan1_utbk_aktual}</span>
                        </div>
                        <div className="flex">
                            <span className="w-1/4 font-semibold">Pilihan 2 UTBK Aktual</span>
                            <span className="w-3/4">: {displayNames.nama_pilihan2_utbk_aktual}</span>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 p-4">
                        <button
                            onClick={() => navigate("editprofil")}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-lg hover:shadow-blue-500 transition-all duration-300"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;
