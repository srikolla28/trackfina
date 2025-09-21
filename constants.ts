
import { Purchase, Activity, Category, PaymentType } from './types';

export const initialPurchases: Purchase[] = [
    { id: '1', item: 'Monthly Groceries', category: Category.Groceries, price: 250.75, type: PaymentType.Credit, date: '2023-10-26T10:00:00Z' },
    { id: '2', item: 'Electricity Bill', category: Category.Utilities, price: 75.50, type: PaymentType.Withdrawal, date: '2023-10-25T14:30:00Z' },
    { id: '3', item: 'Gasoline', category: Category.Transportation, price: 45.00, type: PaymentType.Credit, date: '2023-10-24T08:15:00Z' },
    { id: '4', item: 'Movie Tickets', category: Category.Entertainment, price: 30.00, type: PaymentType.Credit, date: '2023-10-22T19:45:00Z' },
    { id: '5', item: 'Salary', category: Category.Other, price: 2500.00, type: PaymentType.Deposit, date: '2023-10-20T09:00:00Z' },
    { id: '6', item: 'New T-shirt', category: Category.Shopping, price: 25.99, type: PaymentType.Credit, date: '2023-10-19T16:20:00Z' },
    { id: '7', item: 'Lunch at Cafe', category: Category.FoodAndDrink, price: 15.80, type: PaymentType.Withdrawal, date: '2023-10-18T12:30:00Z' },
];

export const initialActivities: Activity[] = [
    { id: 'a1', description: 'Application loaded.', timestamp: new Date().toISOString() },
];

export const CATEGORY_OPTIONS = Object.values(Category);
export const PAYMENT_TYPE_OPTIONS = Object.values(PaymentType);
