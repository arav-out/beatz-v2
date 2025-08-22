import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const GradientButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="h-[50px] w-[120px] m-1 px-4 py-2 font-mono text-[16px] text-gray-400 rounded-md cursor-pointer transition-all duration-500
        bg-gradient-to-br from-[#2e2d2d] to-[#212121]
        shadow-[inset_5px_5px_10px_#212121,inset_-5px_-5px_10px_#212121,-1px_-5px_15px_#41465b,5px_5px_15px_#41465b]
        border border-[#404c5d]
        hover:text-gray-200 hover:shadow-[1px_1px_13px_#20232e,-1px_-1px_13px_#545b78]
        active:shadow-[1px_1px_13px_#20232e,-1px_-1px_33px_#545b78] active:duration-100"
    >
      {label}
    </button>
  );
};

export default GradientButton;
