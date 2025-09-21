
import React from 'react';
import { Purchase, SortConfig, PaymentType } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';


interface PurchaseTableProps {
    purchases: Purchase[];
    onEdit: (purchase: Purchase) => void;
    onDelete: (id: string) => void;
    sortConfig: SortConfig;
    onSort: (key: keyof Purchase) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getPaymentTypeColor = (type: PaymentType) => {
    switch (type) {
        case PaymentType.Deposit: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case PaymentType.Credit: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case PaymentType.Withdrawal: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const SortableHeader: React.FC<{
    title: string;
    sortKey: keyof Purchase;
    sortConfig: SortConfig;
    onSort: (key: keyof Purchase) => void;
}> = ({ title, sortKey, sortConfig, onSort }) => (
    <th
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
        onClick={() => onSort(sortKey)}
    >
        <div className="flex items-center">
            {title}
            {sortConfig.key === sortKey && (
                sortConfig.direction === 'ascending' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />
            )}
        </div>
    </th>
);

export const PurchaseTable: React.FC<PurchaseTableProps> = ({
    purchases, onEdit, onDelete, sortConfig, onSort, currentPage, totalPages, onPageChange
}) => {
    if (purchases.length === 0) {
        return <p className="text-center py-10 text-gray-500 dark:text-gray-400">No purchases found. Try adjusting your filters.</p>;
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <SortableHeader title="Item" sortKey="item" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader title="Category" sortKey="category" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader title="Price" sortKey="price" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader title="Type" sortKey="type" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader title="Date" sortKey="date" sortConfig={sortConfig} onSort={onSort} />
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {purchases.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{p.item}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{p.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${p.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentTypeColor(p.type)}`}>
                                        {p.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(p)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 mr-4"><EditIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><DeleteIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-700 dark:text-gray-400">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
                <div className="flex-1 flex justify-end">
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                       <ChevronLeftIcon className="h-5 w-5"/> Previous
                    </button>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next <ChevronRightIcon className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        </>
    );
};
