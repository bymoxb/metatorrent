import { ArrowDownCircle, Check, Copy, ExternalLink, Files, HardDrive, Info, Magnet, Users } from "lucide-react";
import { useState } from "react";
import type { Torrent } from "../type";
import { formatBytes, getFileEmoji } from "../utils";
import StatBadge from "./stat.badge";

const TorrentDetails = ({ torrent }: { torrent: Torrent }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(torrent.magnet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };
    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                {/* Header Info */}
                <div className="p-6 md:p-8 border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/50">

                    {/* Main Header Layout: Stacked on mobile, side-by-side on desktop */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                        {/* Title and Hash Container */}
                        <div className="space-y-2 min-w-0 flex-1">
                            <h1 className="text-xl md:text-2xl font-bold text-white break-words leading-tight tracking-tight">
                                {torrent.name}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-300 group">
                                <Magnet size={12} className="shrink-0" />
                                <p className="text-[10px] md:text-xs font-mono truncate opacity-60 group-hover:opacity-100 transition-opacity">
                                    {torrent.magnet}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons: 2 columns on small mobile, flex on desktop */}
                        <div className="grid grid-cols-2 sm:flex items-center gap-2 md:gap-3 shrink-0">
                            <button
                                onClick={handleCopy}
                                className={`flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border ${copied
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white"
                                    }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                <span className="whitespace-nowrap">{copied ? "Copied!" : "Copy Link"}</span>
                            </button>

                            <a
                                href={torrent.magnet}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 border border-blue-400/20"
                            >
                                <Magnet size={16} className="hidden xs:block" />
                                <span className="whitespace-nowrap">Open Client</span>
                                <ExternalLink size={14} className="opacity-50 hidden md:block" />
                            </a>
                        </div>
                    </div>

                    {/* Stats Badges: Optimized for wrapping on small screens */}
                    <div className="flex flex-wrap gap-2 md:gap-3 mt-8">
                        <StatBadge
                            icon={HardDrive}
                            label="Size"
                            value={formatBytes(torrent.size)}
                            colorClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
                        />
                        <StatBadge
                            icon={ArrowDownCircle}
                            label="Seeds"
                            value={torrent.seeds}
                            colorClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        />
                        <StatBadge
                            icon={Users}
                            label="Peers"
                            value={torrent.peers}
                            colorClass="bg-purple-500/10 text-purple-400 border-purple-500/20"
                        />
                    </div>
                </div>

                {/* Files List */}
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-xs tracking-[0.2em]">
                            <Files size={16} className="text-blue-500" />
                            Files ({torrent.files.length})
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {torrent.files.map((file, index) => (
                            <div
                                key={index}
                                className="group flex justify-between items-center p-3.5 rounded-xl bg-slate-800/20 hover:bg-slate-800/50 transition-all border border-slate-800/50 hover:border-slate-700"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
                                        {getFileEmoji(file.path)}
                                    </div>
                                    <span className="truncate text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                                        {file.path}
                                    </span>
                                </div>
                                <span className="shrink-0 text-[11px] text-slate-400 font-mono bg-slate-950/50 px-2.5 py-1 rounded-lg border border-slate-800">
                                    {formatBytes(file.size)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trackers Section */}
                <div className="p-6 md:p-8 bg-slate-950/40 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-slate-300 font-bold uppercase text-xs tracking-[0.2em]">
                            <Info size={16} className="text-blue-500" />
                            Trackers List ({torrent.trackers.length})
                        </div>
                        {torrent.trackers.length > 0 && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                ONLINE
                            </span>
                        )}
                    </div>

                    {torrent.trackers.length > 0 ? (
                        <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {torrent.trackers.map((tracker, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 group hover:border-slate-600 transition-all"
                                >
                                    <code className="text-[11px] md:text-xs text-slate-400 font-mono truncate flex-1 group-hover:text-slate-200 transition-colors">
                                        {tracker}
                                    </code>
                                    <span className="shrink-0 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                        {tracker.split(':')[0]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                            <p className="text-sm text-slate-500 italic">No active trackers found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default TorrentDetails;
