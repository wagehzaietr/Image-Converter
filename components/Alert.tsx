import React from 'react';
import { CloseIcon } from './Icons';

interface AlertProps {
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
    return (
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-start shadow-lg" role="alert">
            <span className="block sm:inline flex-grow font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 -mr-1 -mt-1 p-1 rounded-full hover:bg-red-500/20 transition-colors">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Alert;
