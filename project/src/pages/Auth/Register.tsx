import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
  
      if (password && confirmPassword && password === confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: 'Password tidak cocok' }));
      }
    }
  };  

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors(prev => ({ ...prev, [name]: 'Kolom ini wajib diisi' }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { ...errors };

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key as keyof typeof newErrors] = 'Kolom ini wajib diisi';
        valid = false;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      const response = await axios.post('http://127.0.0.1:8000/admin/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil',
          text: 'Silakan login untuk melanjutkan!',
          confirmButtonColor: '#6366f1',
        }).then(() => {
          navigate('/loginsiswa');
        });
      }      
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat registrasi',
        confirmButtonColor: '#ef4444',
      });
    }    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: "url('/ice.jpg')" }}>
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 shadow-lg rounded-xl p-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            src="/steganography.bmp"
            alt="Kawal PTN"
            className="w-[20em] sm:w-30 md:w-30 lg:w-[15em] h-auto object-cover mb-[-2em]"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/loginsiswa" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleRegister}>
              {['name', 'email', 'password', 'confirmPassword'].map((field) => {
                const isPassword = field.includes('password');
                const isConfirmPassword = field.includes('confirmPassword');
                const labelMap: Record<string, string> = {
                  name: 'Full name',
                  email: 'Email address',
                  password: 'Password',
                  confirmPassword: 'Confirm password',
                };

                return (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                      {labelMap[field]}
                    </label>
                    <div className="relative">
                      <input
                        id={field}
                        name={field}
                        type={isPassword || isConfirmPassword ? (showPassword ? 'text' : 'password') : field === 'email' ? 'email' : 'text'}
                        required
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none block w-full px-3 py-2 pr-10 border ${
                          errors[field as keyof typeof errors] ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-[2.5em]`}
                      />
                      {(isPassword || isConfirmPassword) && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-[2.5em]"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;