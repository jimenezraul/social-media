import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/CustomButton';
import GoogleLoginButton from '../../../components/GoogleLoginButton';
import validation from '@jimenezraul/form-validation';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../../utils/mutations';
import { useAppDispatch } from '../../../app/hooks';
import { user_login, setAccessToken } from '../../../features/users/userSlice';
import { FormEvent, ChangeEvent } from './types';
import FacebookLoginButton from '../../../components/MetaLoginButton';

const initialState = {
  email: '',
  password: '',
  error: {
    email: '',
    password: '',
  },
};

export const Login = () => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<String>('');

  const [login] = useMutation(LOGIN);

  const [formState, setFormState] = useState(initialState);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isValid = validation(formState, setFormState);

    if (!isValid) {
      return;
    }

    try {
      const response = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });

      const { success, message, access_token, user } = response.data.login;

      if (!success) {
        setErrors(message);
        return;
      }

      setFormState(initialState);

      localStorage.setItem('user', JSON.stringify(user));
      dispatch(user_login(user));
      dispatch(setAccessToken(access_token));

      return;
    } catch (err: any) {
      setErrors(err.message);
    }
  };

  const handleChange = (event: ChangeEvent) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
      error: {
        ...formState.error,
        [name]: '',
      },
    });

    if (errors) setErrors('');
  };

  return (
    <div className="flex flex-1 items-center justify-center px-2">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 shadow-md border border-slate-700 rounded-lg px-12 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl text-center text-slate-300 font-bold mb-3">Login</h1>
          <img
            className="h-40 w-40 mx-auto bg-gradient-to-r from-blue-600 to to-red-600 rounded-full"
            src="assets/img/rocket-front-color.png"
            alt=""
          />
          <div className="mb-4 mt-5">
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={(e) => handleChange(e)}
              className="bg-slate-700 shadow appearance-none rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline focus:shadow-outline"
              placeholder="Email"
            />
            <div className="text-red-500 text-xs">{formState.error.email}</div>
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={(e) => handleChange(e)}
              className="bg-slate-700 shadow appearance-none rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline focus:shadow-outline"
              placeholder="Password"
            />
            <div className="text-red-500 text-xs">{formState.error.password}</div>
          </div>
          <div className="text-red-500 text-xs">{errors}</div>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              name="Login"
              className="bg-default hover:bg-default text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
            />
            <Link
              to="/register"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Register
            </Link>
          </div>
          <div className="flex items-center justify-end mt-5">
            <Link
              to="/forgot-password"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <GoogleLoginButton setErrors={setErrors} />
            <FacebookLoginButton setErrors={setErrors} />
          </div>
        </form>
      </div>
    </div>
  );
};
