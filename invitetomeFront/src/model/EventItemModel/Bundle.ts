/* Bundle operation (individual), do not confuse with Bundles */
export interface Bundle {
  eventId: string;
  operation: string; // "e.g. bundle#01#cocacola"
  contacts: Contact[];
  data: {
    bundleData: BundleData;
    bundleDates: {
      dates: string[];
    };
    bundleQuotas: BundleQuotas;
    bundleStatus: {
      statusCode: BundleStatus;
    };
  };
  gsiPK: "BUNDLES";
  invitations: string[]; // List of invitation operations
}

export type BundleStatus = "Draft" | "Active" | "In Progress" | "Archived";

export interface Contact {
  name: string;
  email: string;
}
export interface BundleData {
  bundleName: string;
  sponsorName: string;
  sponsorEmail: string;
  sponsorContactName: string;
  bundleDescription: string;
}

export interface BundleQuotas {
  quotas: AssignedQuota[];
  totalAssignedQuota: number; // summation of all assigned quotas
}

export interface AssignedQuota {
  invitationType: string; // e.g. "VIP", "Backstage"
  assignedQuotaQty: number;
  color: string; // color in hexadecimal
}

export const defaultBundle: Bundle = {
  eventId: "",
  operation: "bundle#00#fasttrack",
  contacts: [],
  data: {
    bundleData: {
      bundleName: "Fast Track",
      sponsorName: "",
      sponsorEmail: "",
      sponsorContactName: "",
      bundleDescription: "Default bundle",
    },
    bundleDates: {
      dates: [],
    },
    bundleQuotas: {
      quotas: [],
      totalAssignedQuota: 0,
    },
    bundleStatus: {
      statusCode: "Draft",
    },
  },
  gsiPK: "BUNDLES",
  invitations: [],
};
