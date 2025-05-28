import { useState, useEffect } from 'react';
import { Check, Star, Clock, Users, BookOpen, X, AlertTriangleIcon } from 'lucide-react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

// Modal.setAppElement('#root');

type CoursePackage = {
    id: number;
    nama_paket: string;
    price: number;
    duration?: string;
    features?: string[];
    isPopular?: boolean;
    participants?: number;
    subjects: string[];
    deskripsi?: string;
};

declare global {
    interface Window {
        snap: any;
    }
}

const TryoutPackageCard = ({
    id,
    order_id = `ORDER-${new Date().getTime()}`,
    nama_paket = "",
    price = 0,
    duration = "",
    isPopular = false,
    participants = 0,
    subjects = [],
    deskripsi = ""
}: {
    id: number;
    order_id?: string;
    nama_paket?: string;
    price?: number;
    duration?: string;
    isPopular?: boolean;
    participants?: number;
    subjects?: string[];
    deskripsi?: string;
}) => {
    const [isPaymentOpen, setPaymentOpen] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState("");
    const [userId, setUserId] = useState<number | null>(null);

    const [isOpenModal, setOpenDetail] = useState(false);
    const openModal = () => setOpenDetail(true);
    const closeModal = () => setOpenDetail(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://160.19.166.155:8000/student/profile", {
                    credentials: 'include'
                });
                const data = await response.json();
                setUserId(data.data.id);
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleCheckout = async (order_id: string, id: number, price: number) => {
        if (!userId) {
            setPaymentMessage("Anda Mau Beli Paket? Silahkan Login Terlebih Dahulu!");
            setPaymentOpen(true);
            return;
        }

        try {
            const response = await fetch("http://160.19.166.155:5000/api/checkout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id,
                    id,
                    amount: price,
                    user_id: userId
                })
            });

            const data = await response.json();
            const token = data.token;

            window.snap.pay(token, {
                onSuccess: async (result: any) => {
                    const dataToSend = new URLSearchParams({
                        order_id: order_id,
                        id_paket: String(id),
                        amount: String(price),
                        id_users: String(userId)
                    });

                    console.log("Data yang dikirim ke /payment/success:", dataToSend.toString());

                    try {
                        await fetch("http://160.19.166.155:8000/student/sendPayment", {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            credentials: 'include',
                            body: dataToSend
                        });
                        setPaymentMessage("Payment successful. Transaksi berhasil disimpan.");
                    } catch (err) {
                        console.log("Gagal menyimpan transaksi:", err);
                        setPaymentMessage("Payment berhasil, tetapi gagal menyimpan data transaksi.");
                    }

                    setPaymentOpen(true);
                },
                onPending: () => {
                    setPaymentMessage("Payment pending:");
                    setPaymentOpen(true);
                },
                onError: () => {
                    setPaymentMessage("Payment error:");
                    setPaymentOpen(true);
                },
                onClose: () => {
                    setPaymentMessage("Payment closed");
                    setPaymentOpen(true);
                }
            });
        } catch (error) {
            console.error("Error during checkout:", error);
            setPaymentMessage("Mohon Maaf, terjadi kesalahan sistem. Silahkan coba lagi.");
            setPaymentOpen(true);
        }
    };

    return (
        <div className="w-full p-6 bg-white rounded-md shadow-md border border-gray-200 hover:border-teal-500 transition-all duration-300">
            {isPopular && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                    <Star size={16} fill="currentColor" /> Popular
                </div>
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-2">{nama_paket}</h3>

            <div className="mb-6">
                <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-teal-600">
                        Rp {price.toLocaleString("id-ID")}
                    </span>
                </div>
                {duration && (
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <Clock size={16} />
                        <span>Berlaku {duration}</span>
                    </div>
                )}
            </div>

            <div className='space-y-3'>
                <button
                    onClick={openModal}
                    className="text-teal-600 border border-teal-600 rounded-md px-4 py-2 hover:bg-teal-50 mb-3 w-full text-center"
                >
                    Lihat Detail
                </button>
                <button
                    onClick={() => handleCheckout(order_id, id, price)}
                    className="bg-teal-500 text-white rounded-md px-4 py-2 hover:bg-teal-600 w-full text-center"
                >
                    Beli Paket
                </button>
            </div>

            <Modal isOpen={isOpenModal} onRequestClose={closeModal}
                className="fixed inset-0 flex items-center justify-center" contentLabel="Detail Paket">
                <div className='bg-white rounded-md p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 hover:border-teal-500 transition-all duration-300'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-bold text-gray-800'>Detail Paket {nama_paket}</h2>
                        <button onClick={closeModal} className='text-gray-500 hover:text-red-500'>
                            <X size={20} />
                        </button>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Deskripsi</h3>
                        <p className='text-gray-600'>{deskripsi}</p>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Mata Pelajaran</h3>
                        {Array.isArray(subjects) && subjects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((subject, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm shadow-lg border border-teal-500 shadow-md hover:shadow-teal-500 transition-all duration-300"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Tidak ada mata pelajaran tersedia.</p>
                        )}
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Statistik</h3>
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-1 text-gray-600">
                                <BookOpen size={16} />
                                <span>{subjects.length} teori yang diujikan</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="w-full py-2 px-4 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 shadow-lg hover:shadow-teal-600 transition-all duration-300"
                        onClick={closeModal}>
                        Tutup
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isPaymentOpen} onRequestClose={() => setPaymentOpen(false)} className="fixed inset-0 flex items-center justify-center">
                <div className='bg-white rounded-md p-6 w-full max-w-sm text-center shadow-lg border border-gray-200'>
                    <AlertTriangleIcon className="mx-auto mb-4 h-14 w-14 text-red-500" />
                    <h2 className='text-xl font-bold text-gray-800 mb-4'>Ops</h2>
                    <p className='text-gray-600 mb-6'>{paymentMessage}</p>
                    <button onClick={() => setPaymentOpen(false)} className='w-full py-2 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600 transition-all duration-300'>Tutup</button>
                </div>
            </Modal>
        </div>
    );
};

export default function Guest() {
    const [packages, setPackages] = useState<CoursePackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visiblePackages, setVisiblePackages] = useState<number>(3); // State to track number of visible packages

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://cors-anywhere.herokuapp.com/http://160.19.166.155:8000/admin/listPacket")
                if (!response.ok) throw new Error("Data tidak ditemukan!");
                const data: CoursePackage[] = await response.json();
                setPackages(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to handle "Lihat Paket Lebih Banyak" button
    const handleShowMore = () => {
        setVisiblePackages((prev) => prev + 3); // Show 3 more packages each time
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="bg-teal-500 p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src="/kawalbg.png"
                        alt="KAWAL PTN Logo"
                        className="h-8 mr-2"
                    />
                    <div className="text-white font-bold">
                        Selamat Datang di Kawal PTN
                    </div>
                </div>
                <button className="bg-white text-teal-500 px-4 py-2 rounded-md flex items-center text-sm">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <Link to="/loginsiswa">Masuk / Daftar</Link>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </header>

            <div className="flex justify-center">
                <div className="max-w-4xl mx-auto">
                    <img
                        src="/Poster.jpg"
                        alt="Kawal PTN Hero Banner"
                        className="w-full rounded-md h-auto"
                    />
                </div>
            </div>

            <div className="py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                        <img
                            src="/cat-4.jpg"
                            alt="Student studying on laptop"
                            className="w-full rounded-md shadow-md"
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <div className="text-teal-500 text-sm uppercase font-semibold">ABOUT KAWAL PTN</div>
                        <h1 className="text-2xl font-bold mb-4">Welcome to KAWAL PTN</h1>
                        <p className="text-gray-700 mb-4 text-sm">
                            Kawal Persiapan Ujian Berbasis Nasional untuk mencapai hasil terbaik. Program KAWAL PTN hadir untuk membantu Sobat mencapai mimpi Perguruan Tinggi Negeri (PTN).
                        </p>
                        <p className="text-gray-700 mb-4 text-sm">
                            Metode kami yang unik, relevan dengan program studi pilihan, dan materi yang berkualitas membuat persiapan UTBK Sobat semakin efektif sesuai dan memenuhi standar untuk lulus ke perguruan tinggi impian.
                        </p>

                        <div className="space-y-2 mt-6">
                            <div className="flex items-center text-sm text-gray-700">
                                <div className="text-teal-500 mr-2">→</div>
                                <div>Tryout Berbasis Sistem Seleksi Nasional</div>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <div className="text-teal-500 mr-2">→</div>
                                <div>Rekomendasi Jurusan Berdasarkan Nilai Tryout</div>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                                <div className="text-teal-500 mr-2">→</div>
                                <div>Modul Pengunggahan Hasil Seleksi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-center items-center mb-6">
                        <div className="text-teal-500 mr-2">✓✓</div>
                        <h2 className="text-xl font-semibold">MISI KAWAL PTN</h2>
                        <div className="text-teal-500 ml-2">✓✓</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-teal-500 p-4 rounded-md text-white">
                            <h3 className="font-semibold text-center mb-3 text-sm">Memudahkan Akses Tryout Berkualitas</h3>
                            <p className="text-xs text-center">
                                Menyediakan tryout online yang dapat diakses dimana saja dan kapan saja untuk persiapan UTBK.
                            </p>
                        </div>

                        <div className="bg-teal-500 p-4 rounded-md text-white">
                            <h3 className="font-semibold text-center mb-3 text-sm">Menyediakan Implementasi Program Studi yang Tepat</h3>
                            <p className="text-xs text-center">
                                Memberikan kesesuaian rekomendasi jurusan berdasarkan hasil tryout.
                            </p>
                        </div>

                        <div className="bg-teal-500 p-4 rounded-md text-white">
                            <h3 className="font-semibold text-center mb-3 text-sm">Memudahkan Eksplorasi Pendidikan yang Lebih Maju</h3>
                            <p className="text-xs text-center">
                                Memberikan informasi yang dapat menunjang kemajuan pendidikan Sobat KAWAL PTN.
                            </p>
                        </div>

                        <div className="bg-teal-500 p-4 rounded-md text-white">
                            <h3 className="font-semibold text-center mb-3 text-sm">Meningkatkan Kesiapan Siswa</h3>
                            <p className="text-xs text-center">
                                Memberikan fitur yang dapat meningkatkan kesiapan dalam persiapan Tinggi Negeri.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-center items-center mb-6">
                        <div className="text-teal-500 mr-2">✓✓</div>
                        <h2 className="text-xl font-semibold">VISI KAWAL PTN</h2>
                        <div className="text-teal-500 ml-2">✓✓</div>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-teal-500 p-6 rounded-md text-white w-64">
                            <h3 className="font-semibold text-center mb-3 text-sm">Platform pendamping terbaik</h3>
                            <p className="text-center text-sm">
                                Platform pembelajaran terbaik berbasis online bagi pelajar Indonesia untuk persiapan Tinggi Negeri
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-center items-center mb-6">
                        <div className="bg-teal-500 text-white p-1 rounded-md mr-2">📚</div>
                        <h2 className="text-xl font-semibold">PAKET-PAKET TRYOUT</h2>
                        <div className="bg-teal-500 text-white p-1 rounded-md ml-2">📚</div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Memuat paket tryout...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">Gagal memuat paket: {error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {packages.slice(0, visiblePackages).map((pkg) => (
                                    <TryoutPackageCard
                                        key={pkg.id}
                                        id={pkg.id}
                                        nama_paket={pkg.nama_paket}
                                        price={pkg.price}
                                        subjects={pkg.subjects}
                                        participants={1500}
                                        deskripsi={pkg.deskripsi}
                                    />
                                ))}
                            </div>

                            {visiblePackages < packages.length && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleShowMore}
                                        className="border border-teal-500 text-teal-500 rounded-md px-6 py-2 hover:bg-teal-50"
                                    >
                                        Lihat Paket Lebih Banyak
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <footer className="bg-teal-500 text-white p-4 text-center mt-auto">
                <div className="text-sm">
                    © Kawal PTN, PA2-Kelompok 08, 2024/2025
                </div>
            </footer>
        </div>
    );
}