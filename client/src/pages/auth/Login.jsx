import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LoginUser } from '../../redux/slices/auth';
import CustomButton from '../../components/UI/CustomButton';

const Login = () => {
  const [formData, setFormData] = useState({
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
      dispatch(LoginUser(formData));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('User Does Not Exist');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg-transactions">
      <div className="gradient-bg-services p-8 rounded-lg shadow-lg max-w-md w-full text-neutral-100">
        <h2 className="text-2xl font-bold text-center mb-6 ">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-100">Email</label>
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
            <label className="block text-gray-100">Password</label>
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
          <div type="submit" className="w-full  text-white py-2 rounded-lg">
          <CustomButton button='Submit' textColor='text-green-400' bottomColor='via-green-500' rgbColor='rgba(83, 197, 66,0.7)' className='w-full rounded-lg p-3 bg-black text-neutral-100'/>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-green-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
