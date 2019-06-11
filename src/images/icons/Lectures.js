import React from "react";

const SvgLectures = props => (
    <svg fill="none" height="1em" viewBox="0 0 50 50" width="1em" {...props}>
        <g stroke="#2185d0" strokeLinecap="square" strokeWidth={2}>
            <path d="M6 7h38M5 7h40M5 33h40M25 33.5v3" />
            <circle cx={25} cy={38} fill="#fff" r={2} />
            <path d="M11 44l14-28 14 28" />
            <path d="M7 7h36v26H7z" fill="#fff" />
        </g>
    </svg>
);

export default SvgLectures;
