
import React from 'react';
import { Activity } from '../types';

interface ActivityLogProps {
    activities: Activity[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Activity Log</h2>
            <div className="max-h-96 overflow-y-auto pr-4">
                <ul className="space-y-4">
                    {activities.map(activity => (
                        <li key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-3 w-3 rounded-full bg-primary-500 mt-1.5"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">{activity.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
