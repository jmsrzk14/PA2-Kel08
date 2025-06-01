import { useState, useEffect, useRef, RefObject } from 'react';
import { Check, Star, Clock, Users, BookOpen, X, AlertTriangleIcon, ChevronLeft, ChevronRight, Tag, Calendar } from 'lucide-react';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';

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

type BlogPost = {
    id: number;
    judul: string;
    deskripsi: string;
    foto?: string;
};

type Testimonial = {
    id: number;
    nama: string;
    deskripsi: string;
    foto?: string;
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("https://52.205.255.169/student/profile", {
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
            const response = await fetch("http://localhost:5000/api/checkout", {
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
                        await fetch("https://52.205.255.169/student/sendPayment", {
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
                    <button onClick={() => { setPaymentOpen(false); navigate('/loginsiswa'); }} className='w-full py-2 px-4 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600 transition-all duration-300'>Tutup</button>
                </div>
            </Modal>
        </div>
    );
};

export default function Guest() {
    const [isOpen, setIsOpen] = useState(false);
    const [packages, setPackages] = useState<CoursePackage[]>([]);
    const [packagesError, setPackagesError] = useState<string | null>(null);
    const [packagesLoading, setPackagesLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visiblePackages, setVisiblePackages] = useState<number>(3);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState<boolean>(true);
    const [testimonialsError, setTestimonialsError] = useState<string | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimoni = useRef(null);
    const blog = useRef(null);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
    const [blogsError, setBlogsError] = useState<string | null>(null);
    const [currentBlog, setCurrentBlog] = useState(0);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch("https://52.205.255.169/admin/listPacket");
                if (!response.ok) throw new Error("Data paket tidak ditemukan!");
                const data: CoursePackage[] = await response.json();
                setPackages(data);
            } catch (err) {
                setPackagesError((err as Error).message);
                setPackages([]);
            } finally {
                setPackagesLoading(false);
            }
        };

        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch("https://52.205.255.169/admin/listTesti");
                if (!response.ok) throw new Error("Data testimoni tidak ditemukan!");
                const data: Testimonial[] = await response.json();
                const formattedTestimonials = data.map((item) => ({
                    ...item,
                    foto: item.foto ? `https://52.205.255.169/${item.foto}` : '/default-testimonial.jpg'
                }));
                setTestimonials(formattedTestimonials);
            } catch (err) {
                setTestimonialsError((err as Error).message);
                setTestimonials([]);
            } finally {
                setTestimonialsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch("https://52.205.255.169/admin/listNews");
                if (!response.ok) throw new Error("Data blog tidak ditemukan!");
                const data: BlogPost[] = await response.json();
                const formattedBlogs = data.map((item) => ({
                    ...item,
                    foto: item.foto ? `https://52.205.255.169/${item.foto}` : '/default-blog.jpg'
                }));
                setBlogs(formattedBlogs);
            } catch (err) {
                setBlogsError((err as Error).message);
                setBlogs([]);
            } finally {
                setBlogsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handlePrevBlog = () => {
        setCurrentBlog((prev) => (prev - 1 + blogs.length) % blogs.length);
    };

    const handleNextBlog = () => {
        setCurrentBlog((prev) => (prev + 1) % blogs.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    const handlePrev = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const handleShowMore = () => {
        setVisiblePackages((prev) => prev + 3);
    };

    const scrollTo = (ref: RefObject<HTMLElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="fixed top-0 left-0 w-full bg-teal-500 backdrop-blur-md p-4 shadow-md z-50">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/kawalbg.png"
                            alt="KAWAL PTN Logo"
                            className="h-8 mr-2 cursor-pointer"
                        />
                        <span className="text-white font-bold hidden sm:inline">Kawal PTN</span>
                    </Link>

                    <div className="hidden sm:flex items-center space-x-6 text-white font-semibold">
                        <button onClick={() => scrollTo(testimoni)} className="hover:animate-pulse hover:underline mr-4">
                            Testimoni
                        </button>
                        <button onClick={() => scrollTo(blog)} className="hover:animate-pulse hover:underline mr-4">
                            Blog
                        </button>
                    </div>

                    <div className="sm:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center text-white font-bold space-x-4">
                        <Link to="/loginsiswa">
                            <button className="bg-white text-teal-500 px-4 py-2 rounded-md text-sm flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Masuk / Daftar
                            </button>
                        </Link>
                    </div>
                </div>

                {isOpen && (
                    <div className="sm:hidden mt-2 space-y-2 text-white font-bold">
                        <button onClick={() => scrollTo(testimoni)} className="block w-full text-left px-4 hover:bg-teal-600">
                            Testimoni
                        </button>
                        <button onClick={() => scrollTo(blog)} className="block w-full text-left px-4 hover:bg-teal-600">
                            Blog
                        </button>
                        <Link to="/loginsiswa" className="block px-4">
                            <button className="w-full text-left bg-white text-teal-500 px-4 py-2 rounded-md text-sm hover:bg-teal-500 hover:text-white shadow-lg hover:shadow-teal-600 transition-all duration-300">
                                Masuk / Daftar
                            </button>
                        </Link>
                    </div>
                )}
            </header>

            <div className="flex justify-center pt-16">
                <div className="max-w-4xl mx-auto">
                    <img
                        src="/Poster.jpg"
                        alt="Kawal PTN Hero Banner"
                        className="w-full rounded-md h-auto"
                    />
                </div>
            </div>

            <div ref={blog} className="bg-white py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-center items-center mb-6">
                        <div className="text-teal-500 mr-2">✓✓</div>
                        <h2 className="text-xl font-bold">BLOG KAWAL PTN</h2>
                        <div className="text-teal-500 ml-2">✓✓</div>
                    </div>

                    {blogsLoading ? (
                        <p className="text-center text-gray-300">Memuat artikel...</p>
                    ) : blogs.length === 0 ? (
                        <p className="text-center text-gray-300">Belum ada artikel tersedia.</p>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden">
                            {(() => {
                                const blog = blogs[currentBlog];
                                return (
                                    <div key={blog.id} className="min-w-full flex justify-center">
                                        <div className="relative w-full">
                                            <img
                                                src={blog.foto}
                                                alt={blog.judul}
                                                className="w-full h-[400px] object-cover opacity-40"
                                            />
                                            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">{blog.judul}</h3>
                                                <div
                                                    className="text-sm sm:text-base max-w-2xl prose prose-sm"
                                                    dangerouslySetInnerHTML={{
                                                        __html: `<blockquote>${blog.deskripsi}</blockquote>`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {blogs.length > 1 && (
                                            <>
                                                <button
                                                    onClick={handlePrevBlog}
                                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    onClick={handleNextBlog}
                                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })()}
                            {/* Indicator */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {blogs.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentBlog(index)}
                                        className={`w-3 h-3 rounded-full ${currentBlog === index ? 'bg-teal-500' : 'bg-gray-300'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
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
                        <h2 className="text-xl font-bold">MISI KAWAL PTN</h2>
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
                        <h2 className="text-xl font-bold">VISI KAWAL PTN</h2>
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

            <div ref={testimoni} className="bg-white py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-center items-center mb-6">
                        <div className="text-teal-500 mr-2">✓✓</div>
                        <h2 className="text-xl font-bold">TESTIMONI</h2>
                        <div className="text-teal-500 ml-2">✓✓</div>
                    </div>

                    {testimonialsLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Memuat testimoni...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Belum ada testimoni tersedia.</p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                            >
                                {testimonials.map((testimonial, index) => (
                                    <div key={testimonial.id} className="min-w-full flex justify-center">
                                        <div className="text-center w-full max-w-md">
                                            <img
                                                src={testimonial.foto}
                                                alt={`Testimonial ${testimonial.nama}`}
                                                className="w-20 h-20 rounded-full border-2 border-teal-500 p-1 mx-auto mb-3"
                                            />
                                            <h5 className="text-lg font-semibold text-gray-800">{testimonial.nama}</h5>
                                            <div className="bg-teal-100 p-4 rounded-md mt-3 text-sm prose prose-sm" dangerouslySetInnerHTML={{
                                                __html: `<blockquote>${testimonial.deskripsi}</blockquote>`
                                            }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                            >
                                <ChevronRight size={24} />
                            </button>

                            <div className="flex justify-center mt-4 space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-teal-500' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white py-8 px-6 flex justify-center">
                <div className="max-w-4xl w-full">
                    <div className="flex justify-center items-center mb-6">
                        <div className="bg-teal-500 text-white p-1 rounded-md mr-2">📚</div>
                        <h2 className="text-xl font-bold">PAKET-PAKET TRYOUT</h2>
                        <div className="bg-teal-500 text-white p-1 rounded-md ml-2">📚</div>
                    </div>

                    {packagesLoading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Memuat paket tryout...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
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