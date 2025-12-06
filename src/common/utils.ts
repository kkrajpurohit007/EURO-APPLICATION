/**
 * Common utility functions used across the application
 */

/**
 * Format date to DD-MMM-YYYY format
 * @param dateString - Date string or null/undefined
 * @returns Formatted date string (e.g., "15-Jan-2024") or "-" if invalid/null
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  } catch (error) {
    return "-";
  }
};

