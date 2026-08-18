const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🚀</div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>

        <p className="text-gray-600 text-lg mb-8">
          This page is currently under development.
          <br />
          We’ll be back soon!
        </p>

        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
