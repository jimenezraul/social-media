import { useState } from "react";
import { Link } from "react-router-dom";

type FormEvent = React.FormEvent<HTMLFormElement>;

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 shadow-md border border-slate-700 rounded-lg px-12 pt-6 pb-8 mb-4"
      >
        <h1 className="text-2xl text-center text-slate-300 font-bold mb-5">Login</h1>
        <div className="mb-4">
          <label className="block text-slate-300 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-700 shadow appearance-none rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline focus:shadow-outline"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-700 shadow appearance-none rounded w-full py-2 px-3 text-gray-400 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <Link
            to="/register"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};
