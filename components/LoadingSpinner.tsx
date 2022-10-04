const LoadingSpinner = () => (
  <div>
    {/* based on https://loading.io/css/ */}
    <div className="motion-safe:animate-spin motion-reduce:hidden inline-block box-border w-16 h-16 border-x-slate-50 border-y-transparent border-solid border-4 rounded-full" />
    <span className="motion-safe:sr-only">Loading...</span>
  </div>
);

export default LoadingSpinner;
