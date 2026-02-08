 const InputField = ({ label, name, type = "text", icon: Icon, placeholder, value, onChange, required = false }) => (
    <div className="space-y-2 group">
      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold group-focus-within:text-white transition-colors">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-zinc-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  )
export default InputField