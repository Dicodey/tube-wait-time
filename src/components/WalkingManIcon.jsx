import React from 'react';

const WalkingManIcon = ({ className = '', size = 24 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Walk"
        >
            <circle cx="12" cy="12" r="12" fill="#2A2A35" />
            <path
                d="M13.5 7C13.5 7.82843 12.8284 8.5 12 8.5C11.1716 8.5 10.5 7.82843 10.5 7C10.5 6.17157 11.1716 5.5 12 5.5C12.8284 5.5 13.5 6.17157 13.5 7Z"
                fill="#00D466"
            />
            <path
                d="M9.5 11.5L10.5 9H13.5L15 11.5V14H14V12L13 11V16L15 20H13.5L12 17L10.5 20H9L11 16V11.5H9.5V11.5Z"
                fill="#00D466"
            />
            {/* Refined "Green Man" shape - replacing simple path with more iconic walking figure */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.28 10.82L15.5 12.5V14.5H16.5V12.1L15.1 10.1C14.88 9.77 14.52 9.57 14.13 9.53L12.03 9.38C11.66 9.35 11.3 9.5 11.05 9.78L9 12.05V14.5H10V12.45L11.38 10.95L12.55 13.68L10.5 16.5L8.5 15.5L8 16.5L10.4 17.7C10.68 17.84 11.02 17.79 11.25 17.58L13.15 15.83L13.88 18.25L16.03 18.25L16.03 17.25H14.63L14.05 15.35L14.28 10.82Z"
                fill="#00D466"
            />
        </svg>
    );
};

export default WalkingManIcon;
