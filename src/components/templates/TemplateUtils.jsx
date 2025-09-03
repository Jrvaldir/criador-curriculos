import React from 'react';

export const templateColorOptions = [
    { id: 'blue', hex: '#2563EB' },
    { id: 'green', hex: '#16A34A' },
    { id: 'indigo', hex: '#4F46E5' },
    { id: 'slate', hex: '#475569' },
    { id: 'red', hex: '#DC2626' }
];

export const TemplateWrapper = ({ children, isPdfExport = false }) => (
    <div className={`bg-white ${isPdfExport ? '' : 'shadow-lg rounded-lg overflow-hidden w-full h-full'} text-sm`}>
        {children}
    </div>
);