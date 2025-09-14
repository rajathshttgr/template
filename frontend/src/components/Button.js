import React from "react";

const Button = ({
  text = "Button",
  onClick,
  disabled = false,
  loading = false,
  width = "",
  className = "",
  style = {},
  type = "button",
  variant = "primary",
  icon = null,
  ariaLabel = "",
}) => {
  const baseStyles =
    "px-4 py-2 rounded transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-2 rounded-md hover:opacity-90 cursor-pointer transition-all duration-200",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost:
      "font-medium p-2 px-5 rounded-md bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200",
  };

  const appliedVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || text}
      className={`${baseStyles} ${appliedVariant} ${className}`}
      style={{ width, ...style }}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon && <span>{icon}</span>}
        {loading ? <span>Loading...</span> : <span>{text}</span>}
      </div>
    </button>
  );
};

export default Button;
