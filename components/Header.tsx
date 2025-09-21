
import React from 'react';
import { ChartPieIcon } from './icons/ChartPieIcon';

export const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <ChartPieIcon className="h-8 w-8 text-primary-600" />
                        <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
                            Expense Tracker Pro
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-300 mr-4 font-medium">Welcome, User!</span>
                        <img
                            className="h-10 w-10 rounded-full"
                            src="https://picsum.photos/100/100"
                            alt="User Avatar"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
