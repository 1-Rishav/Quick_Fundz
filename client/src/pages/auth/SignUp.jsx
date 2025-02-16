import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterUser } from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
import CustomButton from '../../components/UI/CustomButton';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName:'',
    username: '',
    email: '',
    password: '',

  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(RegisterUser(formData));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-transactions">
      <div className="gradient-bg-services p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block  font-semibold text-gray-100 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-100">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-100">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-100">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              required
            />
          </div>
          <div type="submit" className="w-full text-white py-2 rounded-lg"><CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/></div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
