import { useState } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDialog({isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel'}: ConfirmDialogProps) {
    return isOpen && (
        <div onClick={onCancel} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-slate-800 p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                <p className="text-gray-200 text-sm mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={onCancel} 
                        className="bg-slate-600 text-white px-4 py-2 rounded font-semibold hover:bg-slate-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}