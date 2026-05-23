import React from "react";

export const Notification = ({ type, message, onClose }) => {
    if (!message) return null;

    const bgClass = type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';

    return (
        <div className={`p-3 my-3 border rounded flex justify-between items-center ${bgClass}`}>
            <span>{message}</span>
            <button onClick={onClose} className="font-bold opacity-50 hover:opacity-100 px-2">×</button>
        </div>
    )
}