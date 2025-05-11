import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ChangePass: React.FC = () => {
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showNewConfirmPassword, setShowConfirmNewPassword] = React.useState(false);
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
          Change Password
        </h2>
        <p className="text-center text-md text-gray-600">
                  <Link to="/loginsiswa" className="font-medium text-indigo-600 hover:text-indigo-500">
                  <span className="mr-1 text-xl">&#8592;</span>Sign in
                  </Link>
                </p>
        <form className="mt-6 space-y-4">
          <div className='relative w-full'>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="new-password"
              name="new-password"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
            type='button'
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-10 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
            {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className='relative w-full'>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="password"
              name="password"
              type={showNewConfirmPassword ? "text" :"password"}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
            type='button'
            onClick={() => setShowConfirmNewPassword(!showNewConfirmPassword)}
            className="absolute inset-y-10 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
            {showNewConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePass;