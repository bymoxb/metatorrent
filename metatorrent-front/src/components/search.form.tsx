import { LinkIcon, Search, X, Loader2 } from "lucide-react";

const SearchForm = ({
    url, setUrl, onSubmit, loading
}: {
    url: string, setUrl: (val: string) => void, onSubmit: (e: React.FormEvent) => void, loading: boolean
}) => (
    <section className="space-y-4">
        <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2 uppercase tracking-wider">
                <LinkIcon size={14} className="text-blue-500" />
                Paste Magnet or Torrent Link
            </h2>
            <form onSubmit={onSubmit} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>

                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="magnet:?xt=urn:btih:..."
                    className="w-full bg-slate-900 border border-slate-800 text-slate-50 pl-12 pr-12 md:pr-36 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-2xl text-sm md:text-base"
                />

                <div className="absolute inset-y-2 right-2 flex items-center gap-2">
                    {url && !loading && (
                        <button
                            type="button"
                            onClick={() => setUrl('')}
                            className="flex justify-center items-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-xl h-10 w-10"
                        >
                            <X size={18} />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="hidden md:flex h-full px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all items-center gap-2 shadow-lg active:scale-95 border border-blue-400/20"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Analyze"}
                    </button>
                </div>
            </form>

            <button
                type="submit"
                disabled={loading || !url}
                onClick={onSubmit}
                className="md:hidden w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Analyze Link"}
            </button>
        </div>
    </section>
);

export default SearchForm;