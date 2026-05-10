import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={`
            flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm text-gray-800 font-medium
            placeholder:text-gray-400 placeholder:font-normal
            transition-all duration-200
            hover:border-gray-300 hover:bg-white
            focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
            disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-50/50 disabled:hover:border-gray-200
            ${error ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : ''}
            ${className}
          `}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

