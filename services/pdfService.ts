
import { Purchase, Activity } from '../types';

declare const jspdf: any;

export const generatePdf = (purchases: Purchase[], activities: Activity[]) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Expense Report", 14, 22);

    // Purchase History Table
    doc.setFontSize(14);
    doc.text("Purchase History", 14, 32);
    const purchaseData = purchases.map(p => [
        new Date(p.date).toLocaleDateString(),
        p.item,
        p.category,
        p.type,
        `$${p.price.toFixed(2)}`
    ]);
    (doc as any).autoTable({
        startY: 36,
        head: [['Date', 'Item', 'Category', 'Type', 'Price']],
        body: purchaseData,
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105] },
    });

    // Activity Log Table
    const lastY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.text("Activity Log", 14, lastY + 10);
    const activityData = activities.slice(0, 20).map(a => [ // Limit to recent 20 activities for PDF
        new Date(a.timestamp).toLocaleString(),
        a.description
    ]);
    (doc as any).autoTable({
        startY: lastY + 14,
        head: [['Timestamp', 'Description']],
        body: activityData,
        theme: 'grid',
        headStyles: { fillColor: [75, 85, 99] },
    });

    doc.save('expense_report.pdf');
};
