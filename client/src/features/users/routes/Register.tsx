import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLoginButton } from '../../../components/GoogleLogin';
import { Button } from '../../../components/CustomButton';
import { registerValidation } from '../../../utils/validation';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../../utils/mutations';

const inputFields: Array<formInfo> = [
  {
    name: 'given_name',
    type: 'text',
    placeholder: 'First Name',
  },
  {
    name: 'family_name',
    type: 'text',
    placeholder: 'Last Name',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
  },
  {
    name: 'confirm_password',
    type: 'password',
    placeholder: 'Confirm Password',
  },
];

const initialState = {
  given_name: '',
  family_name: '',
  email: '',
  password: '',
  confirm_password: '',
  error: {
    given_name: '',
    family_name: '',
    email: '',
    password: '',
    confirm_password: '',
  },
};

export const Register: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<String>('');
  const [registerError, setRegisterError] = useState<RegisterInfo>({
    success: false,
    message: '',
    subMessage: '',
  });
  const [formState, setFormState] = useState<RegisterFormState>(initialState);
  const [register] = useMutation(REGISTER);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const isValid = registerValidation(formState, setFormState);

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        variables: {
          givenName: formState.given_name,
          familyName: formState.family_name,
          email: formState.email,
          password: formState.password,
        },
      });

      const { success, message, subMessage } = response.data.register;

      setRegisterError({
        success,
        message,
        subMessage,
      });

      setLoading(false);
      setFormState(initialState);
    } catch (err: any) {
      if (err.message === 'Email already exists') {
        setRegisterError({
          success: false,
          message: 'Email already exists,',
          subMessage: 'Please try another email.',
        });

        setLoading(false);
        setFormState(initialState);
        return;
      } else {
        setErrors('Something went wrong. Please try again later.');
        setLoading(false);
        return;
      }
    }
  };

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;
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
    <div className='px-2 flex flex-1 items-center justify-center my-3'>
      <div className='w-full max-w-md'>
        <form
          onSubmit={handleSubmit}
          className='bg-slate-800 shadow-md border border-slate-700 rounded-lg px-12 pt-6 pb-8 mb-4'
        >
          <h1 className='text-2xl text-center text-slate-300 font-bold mb-3'>
            Register
          </h1>
          <img
            className='h-40 w-40 mx-auto bg-gradient-to-r from-blue-600 to to-red-600 rounded-full'
            src='assets/img/rocket-front-color.png'
            alt=''
          />
          <div className='mt-3'>
            {inputFields.map(({ name, type, placeholder }) => (
              <div key={name} className='mb-4'>
                <input
                  type={type}
                  name={name}
                  onChange={(e) => handleChange(e)}
                  className='bg-slate-700 shadow appearance-none rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline focus:shadow-outline'
                  placeholder={placeholder}
                  value={formState[name as keyof RegisterFormState['error']]}
                />
                <div className='text-red-500 text-xs'>
                  {formState.error[name as keyof RegisterFormState['error']]}
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${
              registerError.success ? 'text-blue-300' : 'text-red-500'
            } text-xs`}
          >
            {registerError.message}
          </div>
          <div
            className={`${
              registerError.success ? 'text-blue-300' : 'text-red-500'
            } text-xs`}
          >
            {registerError.subMessage}
          </div>
          <div className='text-red-500 text-xs'>{errors}</div>
          <div className='flex items-center justify-between'>
            <Button
              disabled={loading}
              type='submit'
              name='Register'
              className='bg-gradient-to-r from-blue-600 to to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5'
            />
            <Link
              to='/login'
              className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
            >
              Login
            </Link>
          </div>
          <div className='relative flex py-5 items-center'>
            <div className='flex-grow border-t border-gray-400'></div>
            <span className='flex-shrink mx-4 text-gray-400'>or</span>
            <div className='flex-grow border-t border-gray-400'></div>
          </div>
          <div className='flex items-center justify-center'>
            <GoogleLoginButton setErrors={setErrors} />
          </div>
        </form>
      </div>
    </div>
  );
};
