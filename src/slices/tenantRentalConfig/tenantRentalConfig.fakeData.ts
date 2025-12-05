export interface TenantRentalConfig {
  id?: string;
  tenantId?: string;
  tenantName?: string;
  defaultGracePeriodDays: number;
  defaultMinimumHireWeeks: number;
  defaultInvoiceFrequency: number;
  defaultInvoiceDay: number;
  lastInvoiceGenerationDate?: string | null;
  includeWeekends: boolean;
  excludePublicHolidays: boolean;
  notifyOnOverdueRentals: boolean;
  offHireReminderDays: number;
  notifyOnDraftInvoiceGeneration: boolean;
  lastConfigurationUpdate?: string;
  lastUpdatedByUserId?: string;
  lastUpdatedByUserName?: string;
  configurationNotes: string;
  isDeleted?: boolean;
  created?: string;
  modified?: string;
}

export const tenantRentalConfigData: TenantRentalConfig = {
  id: "1",
  tenantId: "tenant-1",
  tenantName: "Euro Scaffolds Ltd",
  defaultGracePeriodDays: 7,
  defaultMinimumHireWeeks: 4,
  defaultInvoiceFrequency: 0, // 0 = Weekly, 1 = Fortnightly, 2 = Monthly
  defaultInvoiceDay: 7, // 1 = Monday, 7 = Sunday
  lastInvoiceGenerationDate: null,
  includeWeekends: true,
  excludePublicHolidays: true,
  notifyOnOverdueRentals: true,
  offHireReminderDays: 3,
  notifyOnDraftInvoiceGeneration: true,
  configurationNotes: "Default rental configuration for Euro Scaffolds",
  isDeleted: false,
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
};
