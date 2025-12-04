export interface TenantRentalConfig {
  id?: number;
  tenantId?: string;
  defaultGracePeriodDays: number;
  isGracePeriodEnabled: boolean;
  defaultMinimumHireWeeks: number;
  isMinimumHireEnabled: boolean;
  defaultInvoiceFrequency: number;
  defaultInvoiceDay: number;
  includeWeekends: boolean;
  excludePublicHolidays: boolean;
  notifyOnOverdueRentals: boolean;
  offHireReminderDays: number;
  notifyOnDraftInvoiceGeneration: boolean;
  defaultInvoiceNotes: string;
  configurationNotes: string;
  createdAt?: string;
  updatedAt?: string;
}

export const tenantRentalConfigData: TenantRentalConfig = {
  id: 1,
  tenantId: "tenant-1",
  defaultGracePeriodDays: 7,
  isGracePeriodEnabled: true,
  defaultMinimumHireWeeks: 4,
  isMinimumHireEnabled: true,
  defaultInvoiceFrequency: 1, // 1 = Weekly, 2 = Fortnightly, 3 = Monthly
  defaultInvoiceDay: 1, // 1 = Monday, 7 = Sunday
  includeWeekends: true,
  excludePublicHolidays: true,
  notifyOnOverdueRentals: true,
  offHireReminderDays: 3,
  notifyOnDraftInvoiceGeneration: true,
  defaultInvoiceNotes: "Payment due within 30 days of invoice date.",
  configurationNotes: "Default rental configuration for Euro Scaffolds",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
