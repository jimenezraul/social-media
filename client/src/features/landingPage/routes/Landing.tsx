import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/CustomButton';

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img src="/assets/img/social-media.png" alt="logo" className="w-3/5 max-w-lg" />
      <h1 className="text-2xl lg:text-5xl font-medium text-gray-100 mt-4">Welcome to Social Media App</h1>
      <p className="lg:text-2xl mt-2 text-gray-300">Connect with friends and share your moments</p>
      <Button
        type="button"
        onClick={() => navigate('/login')}
        name="Get Started"
        className="lg:text-2xl bg-gradient-to-r from-blue-600 to to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
      />
    </div>
  );
};
