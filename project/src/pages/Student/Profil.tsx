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
                const response = await axios.get("http://localhost:8000/student/profile", {
                    withCredentials: true,
                });
                const data = response.data.data;

                setStudentData({
                    id: data.id || "",
                    username: data.username || "",
                    first_name: data.first_name || "",
                    nisn: data.nisn || "",
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
                    asal_sekolah: data.asal_sekolah || "",
                    kelompok_ujian: data.kelompok_ujian || "",
                    telp1: data.telp1 || "",
                    pilihan1_utbk: data.pilihan1_utbk || "",
                    pilihan2_utbk: data.pilihan2_utbk || "",
                    pilihan1_utbk_aktual: data.pilihan1_utbk_aktual || "",
                    pilihan2_utbk_aktual: data.pilihan2_utbk_aktual || "",
                });

                const [sekolahRes, prodi1Res, prodi2Res, prodi1AktualRes, prodi2AktualRes] = await Promise.all([
                    axios.get(`http://localhost:8000/admin/viewSekolah/${data.asal_sekolah}`),
                    axios.get(`http://localhost:8000/admin/viewMajor/${data.pilihan1_utbk}`),
                    axios.get(`http://localhost:8000/admin/viewMajor/${data.pilihan2_utbk}`),
                    axios.get(`http://localhost:8000/admin/viewMajor/${data.pilihan1_utbk_aktual}`),
                    axios.get(`http://localhost:8000/admin/viewMajor/${data.pilihan2_utbk_aktual}`),
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
                const response = await axios.get("http://localhost:8000/admin/listSekolah", {
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
                    <div className="p-4 space-y-2">
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

                {/* <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setEditModalOpen(false)}
                    className="fixed inset-0 flex items-center justify-center"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50">
                    <div className="bg-white p-6 w-full max-w-lg rounded-lg shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-800">
                            <X size={25} />
                        </button>
                        <h2 className="text-lg text-center font-bold mb-4">Edit Profil Anda</h2>
                        <div className="bg-green-500 text-white text-center py-2 rounded-t-lg font-bold text-lg">
                            PROFIL SISWA
                        </div>
                        <div className="space-y-4 p-4">
                            <div>
                                <label className="block font-medium" htmlFor="first_name">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="first_name"
                                    type="text"
                                    value={editForm.first_name}
                                    onChange={(e) => handleEditFormChange("first_name", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="nisn">
                                    NISN
                                </label>
                                <input
                                    id="nisn"
                                    type="text"
                                    value={editForm.nisn}
                                    onChange={(e) => handleEditFormChange("nisn", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="asal_sekolah">
                                    Asal Sekolah
                                </label>
                                <select
                                    id="asal_sekolah"
                                    value={editForm.asal_sekolah}
                                    onChange={(e) => handleEditFormChange("asal_sekolah", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                >
                                    <option value="">Pilih Sekolah</option>
                                    {schoolList.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.sekolah}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="kelompok_ujian">
                                    Kelompok Ujian
                                </label>
                                <input
                                    id="kelompok_ujian"
                                    type="text"
                                    value={editForm.kelompok_ujian}
                                    onChange={(e) => handleEditFormChange("kelompok_ujian", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="telp1">
                                    Telepon
                                </label>
                                <input
                                    id="telp1"
                                    type="text"
                                    value={editForm.telp1}
                                    onChange={(e) => handleEditFormChange("telp1", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>
                        <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg font-bold text-lg">
                            PILIHAN KAMPUS DAN JURUSAN
                        </div>
                        <div className="space-y-4 p-4">
                            <div>
                                <label className="block font-medium" htmlFor="pilihan1_utbk">
                                    Pilihan 1 UTBK
                                </label>
                                <input
                                    id="pilihan1_utbk"
                                    type="text"
                                    value={editForm.pilihan1_utbk}
                                    onChange={(e) => handleEditFormChange("pilihan1_utbk", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="pilihan2_utbk">
                                    Pilihan 2 UTBK
                                </label>
                                <input
                                    id="pilihan2_utbk"
                                    type="text"
                                    value={editForm.pilihan2_utbk}
                                    onChange={(e) => handleEditFormChange("pilihan2_utbk", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="pilihan1_utbk_aktual">
                                    Pilihan 1 UTBK Aktual
                                </label>
                                <input
                                    id="pilihan1_utbk_aktual"
                                    type="text"
                                    value={editForm.pilihan1_utbk_aktual}
                                    onChange={(e) => handleEditFormChange("pilihan1_utbk_aktual", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                            <div>
                                <label className="block font-medium" htmlFor="pilihan2_utbk_aktual">
                                    Pilihan 2 UTBK Aktual
                                </label>
                                <input
                                    id="pilihan2_utbk_aktual"
                                    type="text"
                                    value={editForm.pilihan2_utbk_aktual}
                                    onChange={(e) => handleEditFormChange("pilihan2_utbk_aktual", e.target.value)}
                                    className="w-full p-2 border rounded-md hover:border-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 p-4">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 shadow-lg hover:shadow-red-500 transition-all duration-300"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-lg hover:shadow-blue-500 transition-all duration-300"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Modal> */}
            </div>
        </div>
    );
}

export default Profil;