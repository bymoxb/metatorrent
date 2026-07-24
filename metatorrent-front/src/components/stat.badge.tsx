const StatBadge = ({ icon: Icon, label, value, colorClass }: {
    icon: any, label: string, value: string | number, colorClass: string
}) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium border ${colorClass}`}>
        <Icon size={14} />
        <span>{label}: {value}</span>
    </div>
);

export default StatBadge