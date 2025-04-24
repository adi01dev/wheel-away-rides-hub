
/**
 * Format currency for display throughout the application
 * @param amount - The numerical amount to format
 * @param currency - The currency symbol to use, defaulting to Indian Rupee
 * @returns A formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format currency for display in Indian numbering system (with commas)
 * @param amount - The numerical amount to format
 * @param currency - The currency symbol to use, defaulting to Indian Rupee
 * @returns A formatted currency string with Indian numbering system
 */
export const formatIndianCurrency = (amount: number, currency: string = '₹'): string => {
  // Format with Indian numbering system (e.g., 1,00,000 instead of 100,000)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Replace the INR symbol with the provided currency symbol
  return formatter.format(amount).replace('₹', currency);
};

/**
 * Get currency symbol from code
 * @param code - Currency code (e.g., 'INR', 'USD')
 * @returns The corresponding currency symbol
 */
export const getCurrencySymbol = (code: string = 'INR'): string => {
  const currencyMap: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
  };
  
  return currencyMap[code] || '₹';
};

/**
 * Parse a string that may contain currency symbols and commas
 * @param value - String value possibly containing currency formatting
 * @returns A pure number without formatting
 */
export const parseCurrencyValue = (value: string): number => {
  // Remove currency symbols, commas, and other non-numeric characters
  const cleanValue = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleanValue) || 0;
};
