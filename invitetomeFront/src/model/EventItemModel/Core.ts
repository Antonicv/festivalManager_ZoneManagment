export interface Core {
  eventId: string;
  operation: "core";
  data: {
    coreData: {
      generalData: GeneralData;
      venueData: VenueData;
    };
    coreQuotas: {
      quotas: Quota[];
      totalInvitations: number; // total invitations quota available
      remainingInvitations: number; // total invitations - sum of all assigned quotas
    };
    coreStatus: {
      status: EventStatus;
    };
    coreEventDates: {
      /* Dates are in ISO 8601 format */
      dates: string[];
      startDate: string;
      endDate: string;
      openingTime: string; // Time in 24h format
      scheduleNotes: string;
    };
  };
}

export type EventStatus =
  | "Upcoming"
  | "Draft"
  | "Active"
  | "In Progress"
  | "Archived";

export interface GeneralData {
  eventName: string;
  eventCode: string;
  description: string;
  type: string;
  edition: string;
  yearEdition: number;
  websiteUrl: string;
  logoUrl: string;
  previewImageUrl: string;
  phone: string;
  tags: string[];
}

export interface VenueData {
  venueName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  gates: string[];
}

export interface Quota {
  invitationType: string; // e.g. "VIP", "Backstage"
  quotaQuantity: number; // allocated quota to this type of invitation
  color: string; // color in hexadecimal
  description: string;
  assignedQuotas: number; // Number of invitations assigned to this quota type
}

// Empty event core data for initialization
export const emptyEventData: Core = {
  eventId: "",
  operation: "core",
  data: {
    coreData: {
      generalData: {
        eventName: "",
        eventCode: "",
        description: "",
        type: "",
        edition: "",
        yearEdition: 0,
        websiteUrl: "",
        logoUrl: "",
        previewImageUrl: "",
        phone: "",
        tags: [],
      },
      venueData: {
        venueName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        gates: [],
      },
    },
    coreQuotas: {
      quotas: [
        {
          invitationType: "Fast Track",
          quotaQuantity: 0,
          description: "",
          color: "#000000",
          assignedQuotas: 0,
        },
      ],
      totalInvitations: 0,
      remainingInvitations: 0,
    },
    coreStatus: {
      status: "Draft",
    },
    coreEventDates: {
      dates: [],
      startDate: "",
      endDate: "",
      openingTime: "",
      scheduleNotes: "",
    },
  },
};
