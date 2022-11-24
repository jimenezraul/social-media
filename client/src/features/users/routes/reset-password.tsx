import { Button } from '../../../components/CustomButton';
import { RESET_PASSWORD } from '../../../utils/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { isPasswordValid } from '../../../utils/validation';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const token = window.location.href.split('token=')[1];

  const [formState, setFormState] = useState({
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: '',
    status: '',
  });
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    if (formState.password.trim() === '' || formState.confirmPassword.trim() === '') {
      setError({
        error: true,
        message: 'Password is required',
        status: 'text-red-500',
      });
      setLoading(false);
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setError({
        error: true,
        message: 'Passwords do not match',
        status: 'text-red-500',
      });
      setLoading(false);
      return;
    }

    if (!isPasswordValid(formState.password)) {
      setError({
        error: true,
        message:
          'Password must be at least 8 characters long, contain at least one number, one uppercase letter and one special character.',
        status: 'text-red-500',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword({ variables: { token, password: formState.password } });

      if (!res.data.resetPassword.success) {
        setError({
          error: true,
          message: res.data.resetPassword.message,
          status: 'text-red-500',
        });
        setLoading(false);
        return;
      }

      setError({
        error: true,
        message: res.data.resetPassword.message,
        status: 'text-green-500',
      });

      // clear form
      setFormState({
        password: '',
        confirmPassword: '',
      });

      setLoading(false);
    } catch (err: any) {
      setError({
        error: true,
        message: err.message,
        status: 'text-red-500',
      });
      setLoading(false);
    }
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error.error) setError({ error: false, message: '', status: '' });
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center px-2">
        <div className="w-full max-w-md">
          <div className="bg-slate-800 border border-slate-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <h1 className="text-2xl text-center text-slate-300 font-bold mb-3">Invalid Token</h1>
              <p className="text-center text-slate-200">The token is invalid or has expired</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-2">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-slate-700"
        >
          <h1 className="text-2xl text-center text-slate-300 font-bold mb-3">Reset Password</h1>
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow rounded w-full py-2 px-3 text-slate-200 bg-slate-600"
              type="password"
              placeholder="******************"
              name="password"
              onChange={inputHandler}
              value={formState.password}
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Confirm Password
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-slate-200 bg-slate-600 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="******************"
              name="confirmPassword"
              onChange={inputHandler}
              value={formState.confirmPassword}
            />
          </div>
          {error.error && (
            <div className="mb-4">
              <p className={`${error.status}`}>{error.message}</p>
              {error.message === 'Your user password has been updated' && (
                <p className="text-slate-200">
                  You can now <Link className='text-blue-500' to="/login">login</Link>
                </p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Button
              disabled={loading}
              type="submit"
              name="Reset Password"
              className="bg-default hover:bg-default text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
