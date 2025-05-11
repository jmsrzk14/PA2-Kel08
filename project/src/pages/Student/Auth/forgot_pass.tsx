import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPass: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/change_pass');
    };
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/ice.jpg')" }}>
            <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 shadow-lg rounded-xl p-8">
                <div className="flex justify-center">
                    <img
                        src="/steganography.bmp"
                        alt="Kawal PTN"
                        className="w-[10em] h-auto object-cover mb-4"
                    />
                </div>
                <h2 className="text-center text-2xl font-extrabold text-gray-900">
                    Lupa Password?
                </h2>
                <p className="text-center text-md text-gray-500">Harap masukkan Email yang telah Kamu daftarkan</p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div className='relative w-full'>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder='Masukkan Email Anda'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Lanjut
                    </button>
                    <p className="text-center text-md text-gray-600">
                        <Link to="/loginsiswa" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Kembali
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPass;