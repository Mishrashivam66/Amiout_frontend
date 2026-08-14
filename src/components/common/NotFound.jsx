import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-6">
      <h1 className="text-8xl font-black text-blue-600">404</h1>

      <h2 className="mt-4 text-3xl font-bold text-slate-800">Page Not Found</h2>

      <p className="mt-3 text-slate-500 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
