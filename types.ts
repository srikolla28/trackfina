
export enum Category {
    Groceries = 'Groceries',
    Utilities = 'Utilities',
    Transportation = 'Transportation',
    Entertainment = 'Entertainment',
    Health = 'Health',
    Shopping = 'Shopping',
    FoodAndDrink = 'Food & Drink',
    Other = 'Other'
}

export enum PaymentType {
    Credit = 'Credit',
    Deposit = 'Deposit',
    Withdrawal = 'Withdrawal'
}

export interface Purchase {
    id: string;
    item: string;
    category: Category;
    price: number;
    type: PaymentType;
    date: string; // ISO string format
}

export interface Activity {
    id: string;
    description: string;
    timestamp: string; // ISO string format
}

export interface SortConfig {
    key: keyof Purchase;
    direction: 'ascending' | 'descending';
}
