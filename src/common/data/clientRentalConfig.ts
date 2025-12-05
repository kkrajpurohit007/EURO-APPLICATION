export interface ClientRentalConfig {
  id: number;
  clientId: number;
  clientName: string;
  overrideGracePeriodDays: number | null;
  overrideMinimumHireWeeks: number | null;
  overrideInvoiceFrequency: number | null;
  overrideInvoiceDay: number | null;
  overrideIncludeWeekends: boolean;
  overrideExcludePublicHolidays: boolean;
  reason: string;
  effectiveFrom: string;
  effectiveTo: string;
  approvedByUserId: string;
  approvedDate: string;
  tenantId?: number;
  updatedAt?: string;
}

// Client-specific rental configuration overrides
const clientRentalConfigData: ClientRentalConfig[] = [
  {
    id: 1,
    clientId: 1,
    clientName: "Euro Scaffolds",
    overrideGracePeriodDays: 10,
    overrideMinimumHireWeeks: 4,
    overrideInvoiceFrequency: 1,
    overrideInvoiceDay: 15,
    overrideIncludeWeekends: false,
    overrideExcludePublicHolidays: true,
    reason: "Special client agreement",
    effectiveFrom: "2024-01-01",
    effectiveTo: "2025-12-31",
    approvedByUserId: "user-1",
    approvedDate: "2023-12-15",
    updatedAt: "2024-11-25",
  },
  {
    id: 2,
    clientId: 2,
    clientName: "BuildRight Construction",
    overrideGracePeriodDays: null,
    overrideMinimumHireWeeks: 1,
    overrideInvoiceFrequency: null,
    overrideInvoiceDay: null,
    overrideIncludeWeekends: true,
    overrideExcludePublicHolidays: false,
    reason: "Standard terms with weekend billing",
    effectiveFrom: "2024-03-01",
    effectiveTo: "2025-02-28",
    approvedByUserId: "user-2",
    approvedDate: "2024-02-20",
    updatedAt: "2024-11-20",
  },
];

export { clientRentalConfigData };