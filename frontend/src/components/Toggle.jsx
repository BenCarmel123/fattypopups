export default function Toggle({ checked, onChange, disabled, label }) {
    return (
        <div className="flex items-center gap-3 select-none">
            <span className="text-sm text-white bg-[#a1c4fd] rounded-xl px-3 py-1 shadow-md">
                {label}
            </span>
            <label className="relative cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
            </label>
        </div>
    );
}
