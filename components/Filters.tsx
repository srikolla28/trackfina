
import React from 'react';
import { Category, PaymentType } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface FiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categoryFilter: Category | 'all';
    setCategoryFilter: (category: Category | 'all') => void;
    paymentTypeFilter: PaymentType | 'all';
    setPaymentTypeFilter: (type: PaymentType | 'all') => void;
    dateRange: { start: string; end: string };
    setDateRange: (range: { start: string; end: string }) => void;
    onExport: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    paymentTypeFilter,
    setPaymentTypeFilter,
    dateRange,
    setDateRange,
    onExport,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <input
                type="text"
                placeholder="Search by item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lg:col-span-2 w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            />
            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
                <option value="all">All Categories</option>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value as PaymentType | 'all')}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
                <option value="all">All Types</option>
                {Object.values(PaymentType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <div className="flex items-center gap-2">
                 <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
             <button
                onClick={onExport}
                className="lg:col-start-5 flex items-center justify-center gap-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
            >
                <DownloadIcon className="h-5 w-5" />
                Export PDF
            </button>
        </div>
    );
};
