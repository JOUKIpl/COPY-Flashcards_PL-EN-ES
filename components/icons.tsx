import React from 'react';

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const UKFlag: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="t"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" clipPath="url(#t)"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" strokeWidth="4" clipPath="url(#t)"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
    </svg>
);

export const SpainFlag: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 H60 V40 H0 z" fill="#c60b1e"/>
        <path d="M0 10 H60 V30 H0 z" fill="#ffc400"/>
    </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export const RepeatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 2l4 4-4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 019-9h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 22l-4-4 4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9H3" />
    </svg>
);