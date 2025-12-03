export interface TenantRentalConfig {
  id: number;
  gracePeriodEnabled: boolean;
  gracePeriodDays: number;
  minimumHireEnabled: boolean;
  minimumHireWeeks: number;
  includeWeekends: boolean;
  excludePublicHolidays: boolean;
  notifyOnOverdue: boolean;
  offHireReminderDays: number;
  updatedAt?: string;
}

// Singleton tenant configuration
export const tenantRentalConfigData: TenantRentalConfig = {
  id: 1,
  gracePeriodEnabled: true,
  gracePeriodDays: 7,
  minimumHireEnabled: true,
  minimumHireWeeks: 2,
  includeWeekends: true,
  excludePublicHolidays: true,
  notifyOnOverdue: true,
  offHireReminderDays: 3,
  updatedAt: "2024-11-28",
};
