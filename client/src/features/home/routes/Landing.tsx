import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/CustomButton";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1">
      <div className="w-full mx-auto">
        <div className="flex flex-wrap justify-center h-full p-3 md:p-5">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-center">
            <img
              className="w-3/5 md:w-10/12 lg:w-1/2"
              src="/assets/img/social-media.png"
              alt=""
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col md:justify-center bg-gradient-to-b md:bg-gradient-to-r from-slate-900 to-blue-800 rounded-b-2xl md:rounded-r-2xl">
            <div className="p-10 text-center md:text-start">
              <h1 className="text-4xl text-white font-bold">Welcome to</h1>
              <h2 className="text-4xl text-white font-bold mt-3">
                Connect{" "}
                <span className="bg-green-500 p-1 rounded-xl border">ME</span>
              </h2>
              <p className="text-xl text-slate-300 mt-5">
                A social media platform where you can connect with people around
                the world.
              </p>
              <p className="text-slate-300">Sign up or login to get started</p>
              <Button
                type="button"
                onClick={() => navigate("/login")}
                name="Get Started"
                className="bg-gradient-to-r from-blue-600 to to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
