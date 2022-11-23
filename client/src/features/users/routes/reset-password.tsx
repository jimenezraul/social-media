import { Button } from '../../../components/CustomButton';

const ResetPassword = () => {
  const token = window.location.href.split('token=')[1];
  console.log(token);
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
        <form className="bg-slate-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-slate-700">
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
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
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
