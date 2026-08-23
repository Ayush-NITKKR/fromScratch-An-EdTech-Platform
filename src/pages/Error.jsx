import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0d0d0d] text-white px-6">
      <h1 className="text-[8rem] md:text-[10rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#7C3AED] to-[#3b1470]">
        404
      </h1>

      <p className="text-2xl md:text-3xl font-semibold text-white mb-2">
        Page Not Found
      </p>

      <p className="text-gray-400 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-lg border border-[#7C3AED] text-white hover:bg-[#7C3AED]  transition-colors duration-300 font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Error;