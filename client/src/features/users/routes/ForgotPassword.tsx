import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // try {
    //   await dispatch(forgotPassword(email));
    setIsSent(true);
    // } catch (err) {
    //   setError(err.message);
    // }
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Send Reset Email
                </button>
              </div>
              {error && <p className="error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
