import React, { useState, useEffect } from 'react';
import { Check, Star, Clock, Users, BookOpen, X } from 'lucide-react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

type CoursePackage = {
    id: number;
    nama_paket: string;
    price: number;
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
    features = [""],
    isPopular = false,
    participants = 0,
    subjects = [""],
    description = ""
}: {
    id: number;
    order_id?: string;
    nama_paket?: string;
    price?: number;
    duration?: string;
    features?: string[];
    isPopular?: boolean;
    participants?: number;
    subjects?: string[];
    description?: string;
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
                const response = await axios.get("http://localhost:8000/student/profile", {
                    withCredentials: true 
                });
                const data = response.data;
                setUserId(data.data.id); 
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            }
        };
    
        fetchUserProfile();
    }, []);
    
    const handleCheckout = async (order_id: string, id: number, price: number) => {
        if (!userId) {
            setPaymentMessage("User belum terautentikasi.");
            setPaymentOpen(true);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/checkout", {
                order_id,
                id,
                amount: price,
                user_id: userId
            });            

            const token = response.data.token;

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
                        await axios.post("http://localhost:8000/student/sendPayment", dataToSend, {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            withCredentials: true
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
        <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg border hover:border-blue-500 transition-all duration-300">
            {/* Badge Popular */}
            {isPopular && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                    <Star size={16} fill="currentColor" /> Popular
                </div>
            )}

            {/* Header */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{nama_paket}</h3>

            {/* Price */}
            <div className="mb-6">
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                        Rp {price.toLocaleString("id-ID")}
                    </span>
        
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <Clock size={16} />
                    <span>Berlaku {duration}</span>
                </div>
            </div>


            {/* Button */}
            <div className='space-y-3 flex items-center flex-col'>
                <button onClick={openModal} className='w-full py-2 bg-white text-blue-600 border border-blue-600 rounded-xl font-medium hover:bg-blue-100 shadow-md hover:shadow-blue-500 transition-all duration-300'>
                {/* <button onClick={openModal} className='w-full py-2.5 px-4 bg-white text-blue-600 border border-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors duration-200'> */}
                    Lihat Detail
                </button>
                <button onClick={() => handleCheckout(order_id, id, price)} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg hover:shadow-blue-500 transition-all duration-300">
                    Beli Paket
                </button>
            </div>

            <Modal isOpen={isOpenModal} onRequestClose={closeModal}
                className="fixed inset-0 flex items-center justify-center" contentLabel="Detail Paket">
                <div className='bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lg border hover:border-blue-500 transition-all duration-300'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-2xl font-bold text-gray-800'>Detail {nama_paket}</h2>
                        <button onClick={closeModal} className='text-gray-500 hover:text-red-500'>
                            <X size={25} />
                        </button>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Deskripsi</h3>
                        <p className='text-gray-600'>{description}</p>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Fitur Paket</h3>
                        <ul className="space-y-3 mb-6">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center border border-blue-500 hover:border-blue-500 shadow-md hover:shadow-blue-500 transition-all duration-300">
                                        <Check size={12} className="text-blue-600" />
                                    </div>
                                    <span className="text-gray-600">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Mata Pelajaran</h3>
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm shadow-lg border border-blue-500 shadow-md hover:shadow-blue-500 transition-all duration-300"
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>Statistik</h3>
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-1 text-gray-600">
                                <Users size={16} />
                                <span>{participants.toLocaleString()} peserta</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                                <BookOpen size={16} />
                                <span>{subjects.length} mata pelajaran</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg hover:shadow-blue-600 transition-all duration-300"
                        onClick={closeModal}>
                        Tutup
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isPaymentOpen} onRequestClose={() => setPaymentOpen(false)} className="fixed inset-0 flex items-center justify-center">
                <div className='bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-lg border hover:border-blue-500 transition-all duration-300'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Status Pembayaran</h2>
                    <p className='text-gray-600 mb-6'>{paymentMessage}</p>
                    <button onClick={() => setPaymentOpen(false)} className='w-full py-2 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg hover:shadow-blue-500 transition-all duration-300'>Tutup</button>
                </div>
            </Modal>
        </div>
    );
};

const Paket = () => {
    const [packages, setPackages] = useState<CoursePackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await fetch("http://127.0.0.1:8000/admin/listPacket");
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
    
    if (loading) {
        return <p className="text-gray-700 text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-gray-700 text-center">Error...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Pilih Paket Tryout
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                    <TryoutPackageCard key={index} {...pkg} />
                ))}
            </div>
        </div>
    );
};

export default Paket;