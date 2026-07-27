/**
 * 
// This function formats date from ISO to MM/DD/YYYY
*/
export default function formatDate(isoString: string | null, timeToo?: boolean): string {
    if (!isoString) return '—';
    const d = new Date(isoString);    
    if (typeof d !== 'object') return 'Invalid date';

    if (!timeToo) {
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
