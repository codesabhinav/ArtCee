
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 bg-gradient-to-b from-teal-600 via-teal-500 to-teal-400 text-white">

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">Coming Soon</h1>
        <p className="text-sm sm:text-base text-white/85 mb-6">We’re polishing things to make your experience even better. No spam — we won’t ask for info here.</p>


        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white/10 border border-white/10 text-white font-medium hover:bg-white/5 transition"
          >
            Go Back
          </button>
        </div>


        <div className="mt-6 text-xs text-white/60">© {new Date().getFullYear()} Artcee</div>
      </div>
    </div>
  );
};
export default NotFoundPage
