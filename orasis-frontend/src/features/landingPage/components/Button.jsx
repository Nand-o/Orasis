import React from 'react'

import { useNavigate } from 'react-router-dom';

const Button = ({ id, title, leftIcon, rightIcon, containerClass, to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    return (
        <button
            id={id}
            className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black ${containerClass}`}
            onClick={handleClick}
        >
            {leftIcon}
            <span className='relative inline-flex overflow-hidden font-family-general text-xs uppercase'>
                <div>
                    {title}
                </div>
            </span>
            {rightIcon}
        </button>
    )
}

export default Button
