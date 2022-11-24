import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/CustomButton';
import { FORGOT_PASSWORD } from '../../../utils/mutations';
import { useMutation } from '@apollo/client';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    if (email.trim() === '') {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      const res = await forgotPassword({ variables: { email: email.toLowerCase() } });
      if (!res.data.forgotPassword.success) {
        setError(res.data.forgotPassword.message);
        setLoading(false);
        return;
      }
      setIsSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error !== '') setError('');
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-1 items-center justify-center text-slate-100 px-2">
      <div className="w-full max-w-md">
        <div className="relative bg-slate-800 shadow-md border border-slate-700 rounded-lg px-12 pt-6 pb-8 mb-4">
          <div className="absolute top-4 left-3">
            <span
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </span>
          </div>
          <h1 className="mt-5 text-2xl text-center text-slate-300 font-bold mb-3">
            Forgot Password
          </h1>
          <img className="mb-5 h-40 w-40 mx-auto" src="assets/img/lock-front-gradient.png" alt="" />
          {isSent ? (
            <div className="text-center">
              <p className="text-slate-200">
                An email has been sent to <strong>{email}</strong>
              </p>
              <p className="text-slate-200">Please check your inbox and follow the instructions</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                className="bg-slate-700 shadow appearance-none rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline focus:shadow-outline"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => inputHandler(e)}
              />
              <div className="flex justify-end">
                <Button
                  disabled={loading}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-5 rounded"
                  name="Send Reset Email"
                />
              </div>
              {error && <p className="text-red-400">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
