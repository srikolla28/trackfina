
import React, { useMemo } from 'react';
import { Purchase, PaymentType } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ScaleIcon } from './icons/ScaleIcon';

interface DashboardSummaryProps {
    purchases: Purchase[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ purchases }) => {
    const summary = useMemo(() => {
        const income = purchases
            .filter(p => p.type === PaymentType.Deposit)
            .reduce((acc, p) => acc + p.price, 0);
        
        const expenses = purchases
            .filter(p => p.type === PaymentType.Credit || p.type === PaymentType.Withdrawal)
            .reduce((acc, p) => acc + p.price, 0);
        
        const balance = income - expenses;
        return { income, expenses, balance };
    }, [purchases]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard 
                title="Total Income"
                value={formatCurrency(summary.income)}
                icon={<div className="p-3 rounded-full bg-green-100 dark:bg-green-800"><ArrowUpIcon className="h-6 w-6 text-green-600 dark:text-green-300" /></div>}
            />
            <StatCard 
                title="Total Expenses"
                value={formatCurrency(summary.expenses)}
                icon={<div className="p-3 rounded-full bg-red-100 dark:bg-red-800"><ArrowDownIcon className="h-6 w-6 text-red-600 dark:text-red-300" /></div>}
            />
            <StatCard 
                title="Current Balance"
                value={formatCurrency(summary.balance)}
                icon={<div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-800"><ScaleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" /></div>}
            />
        </div>
    );
};
