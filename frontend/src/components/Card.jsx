import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Card = ({ title, desc, icon, className = "" , href}) => {
  return (
    <Link
      to={href}
      className={`cursor-pointer bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-xl p-6 hover:bg-slate-700/70 transition-all duration-200 ${className}`}
    >
      <div className="w-full flex justify-between">
        <div className="contentsx">
          {icon && <div className="text-3xl mb-4">{icon}</div>}
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-slate-300 leading-relaxed">{desc}</p>
        </div>
        <div className="arrow-icon">
          <FaArrowRight className="text-xl text-slate-400" />
        </div>
      </div>
    </Link>
  );
};

export default Card;
