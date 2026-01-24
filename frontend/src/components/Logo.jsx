import React from 'react';

export default function Logo({ size = 40, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="3" fill="none" opacity="0.3"/>
      
      {/* Inner circle */}
      <circle cx="50" cy="50" r="30" fill="white" opacity="0.9"/>
      
      {/* Letter C */}
      <path 
        d="M 50 25 A 25 25 0 1 0 50 75" 
        stroke="#667eea" 
        strokeWidth="6" 
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Connection nodes */}
      <circle cx="50" cy="25" r="4" fill="#764ba2"/>
      <circle cx="72" cy="50" r="4" fill="#764ba2"/>
      <circle cx="50" cy="75" r="4" fill="#764ba2"/>
      
      {/* Community dots */}
      <circle cx="35" cy="35" r="2.5" fill="#667eea" opacity="0.6"/>
      <circle cx="35" cy="65" r="2.5" fill="#667eea" opacity="0.6"/>
      <circle cx="20" cy="50" r="2.5" fill="#667eea" opacity="0.6"/>
    </svg>
  );
}
