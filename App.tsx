
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Purchase, Activity, Category, PaymentType, SortConfig } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { DashboardSummary } from './components/DashboardSummary';
import { Filters } from './components/Filters';
import { PurchaseTable } from './components/PurchaseTable';
import { ActivityLog } from './components/ActivityLog';
import { PurchaseFormModal } from './components/PurchaseFormModal';
import { PlusIcon } from './components/icons/PlusIcon';
import { generatePdf } from './services/pdfService';
import { initialPurchases, initialActivities } from './constants';


const App: React.FC = () => {
    const [purchases, setPurchases] = useLocalStorage<Purchase[]>('purchases', initialPurchases);
    const [activities, setActivities] = useLocalStorage<Activity[]>('activities', initialActivities);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
    const [paymentTypeFilter, setPaymentTypeFilter] = useState<PaymentType | 'all'>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const addActivity = useCallback((description: string) => {
        const newActivity: Activity = {
            id: Date.now().toString(),
            description,
            timestamp: new Date().toISOString(),
        };
        setActivities(prev => [newActivity, ...prev]);
    }, [setActivities]);

    const handleAddPurchase = (purchase: Omit<Purchase, 'id'>) => {
        const newPurchase: Purchase = { ...purchase, id: Date.now().toString() };
        setPurchases(prev => [newPurchase, ...prev]);
        addActivity(`Added purchase: ${purchase.item} for $${purchase.price.toFixed(2)}.`);
        setIsModalOpen(false);
    };

    const handleUpdatePurchase = (updatedPurchase: Purchase) => {
        setPurchases(prev => prev.map(p => p.id === updatedPurchase.id ? updatedPurchase : p));
        addActivity(`Updated purchase: ${updatedPurchase.item}.`);
        setIsModalOpen(false);
        setEditingPurchase(null);
    };

    const handleDeletePurchase = (id: string) => {
        const purchaseToDelete = purchases.find(p => p.id === id);
        if (purchaseToDelete && window.confirm(`Are you sure you want to delete "${purchaseToDelete.item}"?`)) {
            setPurchases(prev => prev.filter(p => p.id !== id));
            addActivity(`Deleted purchase: ${purchaseToDelete.item}.`);
        }
    };
    
    const openEditModal = (purchase: Purchase) => {
        setEditingPurchase(purchase);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingPurchase(null);
        setIsModalOpen(true);
    };

    const filteredPurchases = useMemo(() => {
        return purchases
            .filter(p => {
                const searchTermMatch = p.item.toLowerCase().includes(searchTerm.toLowerCase());
                const categoryMatch = categoryFilter === 'all' || p.category === categoryFilter;
                const paymentTypeMatch = paymentTypeFilter === 'all' || p.type === paymentTypeFilter;
                const date = new Date(p.date);
                const startDate = dateRange.start ? new Date(dateRange.start) : null;
                const endDate = dateRange.end ? new Date(dateRange.end) : null;
                if(startDate) startDate.setHours(0,0,0,0);
                if(endDate) endDate.setHours(23,59,59,999);
                const dateMatch = (!startDate || date >= startDate) && (!endDate || date <= endDate);

                return searchTermMatch && categoryMatch && paymentTypeMatch && dateMatch;
            })
            .sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
    }, [purchases, searchTerm, categoryFilter, paymentTypeFilter, dateRange, sortConfig]);
    
    const paginatedPurchases = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPurchases.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPurchases, currentPage]);

    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

    const handleSort = (key: keyof Purchase) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, paymentTypeFilter, dateRange]);

    const handleExport = () => {
        generatePdf(filteredPurchases, activities);
    }

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
                <DashboardSummary purchases={purchases} />
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Purchase History</h2>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-700 transition duration-300"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add Purchase
                        </button>
                    </div>

                    <Filters 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        paymentTypeFilter={paymentTypeFilter}
                        setPaymentTypeFilter={setPaymentTypeFilter}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onExport={handleExport}
                    />

                    <PurchaseTable
                        purchases={paginatedPurchases}
                        onEdit={openEditModal}
                        onDelete={handleDeletePurchase}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
                <ActivityLog activities={activities} />
            </main>
            {isModalOpen && (
                <PurchaseFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={editingPurchase ? handleUpdatePurchase : handleAddPurchase}
                    purchase={editingPurchase}
                />
            )}
        </div>
    );
};

export default App;
