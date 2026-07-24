import { LinkIcon } from "lucide-react";

const EmptyState = () => (
    <div className="border-2 border-dashed border-slate-800 rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
            <LinkIcon size={32} className="text-slate-700" />
        </div>
        <h3 className="text-slate-300 font-bold text-lg mb-2">Ready to fetch?</h3>
        <p className="text-slate-500 max-w-xs leading-relaxed text-sm">
            Enter a magnet link or a torrent hash above to inspect its content, size, and health.
        </p>
    </div>
);

export default EmptyState