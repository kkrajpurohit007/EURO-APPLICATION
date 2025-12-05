// Utility functions for Client Rental Configuration

// Format date to DD-MMM-YYYY
export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');
  } catch (error) {
    return "-";
  }
};

// Get user name by ID (mock implementation)
export const getUserNameById = (userId: string): string => {
  // In a real app, this would come from a user service
  const users: Record<string, string> = {
    "user-1": "John Smith",
    "user-2": "Jane Doe",
    "user-3": "Robert Johnson"
  };
  return users[userId] || userId;
};

// Validate rental configuration data
export const validateRentalConfig = (data: any): string[] => {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.reason) {
    errors.push("Reason is required");
  }
  
  if (!data.effectiveFrom) {
    errors.push("Effective from date is required");
  }
  
  if (!data.approvedByUserId) {
    errors.push("Approved by user is required");
  }
  
  // Validate numeric fields
  if (data.overrideMinimumHireWeeks !== null && data.overrideMinimumHireWeeks < 0) {
    errors.push("Minimum hire weeks must be greater than or equal to 0");
  }
  
  if (data.overrideGracePeriodDays !== null && data.overrideGracePeriodDays < 0) {
    errors.push("Grace period days must be greater than or equal to 0");
  }
  
  return errors;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Check if configuration has overrides
export const hasOverrides = (config: any): boolean => {
  return (
    config.overrideGracePeriodDays !== null ||
    config.overrideMinimumHireWeeks !== null ||
    config.overrideInvoiceFrequency !== null ||
    config.overrideInvoiceDay !== null ||
    config.overrideIncludeWeekends !== false ||
    config.overrideExcludePublicHolidays !== false
  );
};