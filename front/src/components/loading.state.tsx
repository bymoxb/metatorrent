const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
            <p className="text-slate-200 font-semibold text-lg">Fetching metadata</p>
            <p className="text-slate-500 text-sm">This may take a few seconds depending on peers...</p>
        </div>
    </div>
);

export default LoadingState