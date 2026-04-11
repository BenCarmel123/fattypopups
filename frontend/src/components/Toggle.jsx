export default function Toggle({ checked, onChange, disabled, label }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-slate-600">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                />
                <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            {label}
        </label>
    );
}
