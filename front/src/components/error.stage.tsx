import { AlertCircle } from "lucide-react";

const ErrorState = ({ message }: { message: string }) => {
    return (
        <div className="border-2 border-dashed border-red-900/40 rounded-[2.5rem] py-32 flex flex-col items-center justify-center text-center px-6 transition-all">
            <div className="w-20 h-20 bg-red-950/30 rounded-full flex items-center justify-center mb-6 border border-red-900/40 shadow-inner">
                <AlertCircle size={32} className="text-red-500" />
            </div>

            <h3 className="text-slate-200 font-bold text-lg mb-2">
                Something went wrong
            </h3>

            <p className="text-slate-500 max-w-sm leading-relaxed text-sm mb-8">
                {message}
            </p>
        </div>
    );
};

export default ErrorState;
