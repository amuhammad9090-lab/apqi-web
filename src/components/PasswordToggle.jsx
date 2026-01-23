import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordToggle = ({ 
  value, 
  onChange, 
  placeholder = "Password", 
  name = "password", 
  disabled = false,
  className = "",
  error = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-gray-900 bg-white
          ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'}`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-600 focus:outline-none p-1 rounded-full hover:bg-slate-100 transition-colors z-10"
        disabled={disabled}
        tabIndex={-1} // Prevent tabbing to this button before the input
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={showPassword ? "hide" : "show"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.div>
        </AnimatePresence>
      </button>
    </div>
  );
};

export default PasswordToggle;