const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🚀</div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3">Coming Soon</h1>

        <p className="text-gray-600 mb-8">
          This page is currently under development. We’re working hard to bring
          it to you soon.
        </p>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
