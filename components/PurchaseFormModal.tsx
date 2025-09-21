
import React, { useState, useEffect, useCallback } from 'react';
import { Purchase, Category, PaymentType } from '../types';
import { XIcon } from './icons/XIcon';
import { CATEGORY_OPTIONS, PAYMENT_TYPE_OPTIONS } from '../constants';
import { suggestCategory } from '../services/geminiService';

interface PurchaseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (purchase: Purchase | Omit<Purchase, 'id'>) => void;
    purchase: Purchase | null;
}

export const PurchaseFormModal: React.FC<PurchaseFormModalProps> = ({ isOpen, onClose, onSave, purchase }) => {
    const [formData, setFormData] = useState({
        item: '',
        category: Category.Other,
        price: '',
        type: PaymentType.Credit,
        date: new Date().toISOString().split('T')[0],
    });
    const [suggestion, setSuggestion] = useState<Category | null>(null);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState<boolean>(false);
    
    useEffect(() => {
        if (purchase) {
            setFormData({
                item: purchase.item,
                category: purchase.category,
                price: purchase.price.toString(),
                type: purchase.type,
                date: new Date(purchase.date).toISOString().split('T')[0],
            });
        } else {
             setFormData({
                item: '',
                category: Category.Other,
                price: '',
                type: PaymentType.Credit,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [purchase, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price),
            date: new Date(formData.date).toISOString(),
        };
        if (purchase) {
            onSave({ ...purchase, ...dataToSave });
        } else {
            onSave(dataToSave);
        }
    };
    
    const debouncedSuggestCategory = useCallback((itemName: string) => {
        setIsLoadingSuggestion(true);
        suggestCategory(itemName).then(category => {
            if (category) setSuggestion(category);
            setIsLoadingSuggestion(false);
        }).catch(() => setIsLoadingSuggestion(false));
    }, []);

    useEffect(() => {
        if (formData.item.length > 3) {
            const handler = setTimeout(() => {
                debouncedSuggestCategory(formData.item);
            }, 500);
            return () => clearTimeout(handler);
        } else {
            setSuggestion(null);
        }
    }, [formData.item, debouncedSuggestCategory]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{purchase ? 'Edit' : 'Add'} Purchase</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="item" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                        <input type="text" name="item" id="item" value={formData.item} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                            {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        {isLoadingSuggestion && <p className="text-xs text-gray-500 mt-1">Getting AI suggestion...</p>}
                        {suggestion && formData.category !== suggestion && !isLoadingSuggestion && (
                            <div className="mt-2 text-sm">
                                AI Suggestion: <button type="button" onClick={() => setFormData(prev => ({...prev, category: suggestion}))} className="font-semibold text-primary-600 hover:underline">{suggestion}</button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Type</label>
                        <select name="type" id="type" value={formData.type} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                             {PAYMENT_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
