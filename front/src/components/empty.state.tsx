import { Link as LinkIcon, PlusCircle } from 'lucide-react';
import { useRegisterProtocolHandler } from '../hooks';

const EmptyState = () => {
    const { showRegister, handleRegisterProtocol } = useRegisterProtocolHandler()

    return (
        <div className="border-2 border-dashed border-slate-800 rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center px-6 transition-all">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
                <LinkIcon size={32} className="text-slate-700" />
            </div>

            <h3 className="text-slate-300 font-bold text-lg mb-2">Ready to fetch?</h3>
            <p className="text-slate-500 max-w-xs leading-relaxed text-sm mb-8">
                Enter a magnet link or a torrent hash above to inspect its content, size, and health.
            </p>

            {showRegister && (
                <button
                    onClick={handleRegisterProtocol}
                    className="flex items-center gap-2 text-[11px] font-medium text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest py-2 px-4 rounded-full hover:bg-slate-900/50 border border-transparent hover:border-slate-800"
                >
                    <PlusCircle size={14} />
                    Enable browser link integration
                </button>
            )}
    </div>
    );
};

export default EmptyState
