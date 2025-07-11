import { Core } from "./Core";
import { Artists } from "./Artists";
import { Statistics } from "./Statistics";
import { Sync } from "./Sync";
import { Bundles, defaultBundles } from "./Bundles";

// Helper function to generate random colors for quotas
function generateRandomColor(seed: string): string {
  // Simple hash function to generate consistent colors for the same quota type
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

// Create Core objects from mockEventsData
const mockCoreOp: Core[] = [
  // EVENT_001 Core object
  {
    eventId: "EVENT_001",
    operation: "core",
    data: {
      coreData: {
        generalData: {
          eventName: "Primavera Sound 2025",
          eventCode: "PS2025",
          description: "One of Europe's biggest music festivals",
          type: "CONCERT",
          edition: "2025 Edition",
          yearEdition: 2025,
          websiteUrl: "https://www.primaverasound.com",
          logoUrl:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
          previewImageUrl:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
          phone: "+34 933 01 00 90",
          tags: ["music", "festival", "outdoor"],
        },
        venueData: {
          venueName: "Parc del Fòrum",
          address: "Parc del Fòrum, Barcelona",
          city: "Barcelona",
          country: "Spain",
          postalCode: "08019",
          gates: ["Main Gate", "VIP Gate", "Artist Entrance"],
        },
      },
      coreQuotas: {
        quotas: [
          {
            invitationType: "GENERAL",
            quotaQuantity: 100,
            color: generateRandomColor("GENERAL"),
            description: "GENERAL ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "VIP",
            quotaQuantity: 30,
            color: generateRandomColor("VIP"),
            description: "VIP ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "BACKSTAGE",
            quotaQuantity: 20,
            color: generateRandomColor("BACKSTAGE"),
            description: "BACKSTAGE ticket quota",
            assignedQuotas: 0,
          },
        ],
        totalInvitations: 150, 
        remainingInvitations: 150,
      },
      coreStatus: {
        status: "Upcoming",
      },
      coreEventDates: {
        dates: [
          "2025-05-25T12:00:00Z",
          "2025-05-26T12:00:00Z",
          "2025-05-27T12:00:00Z",
          "2025-05-28T12:00:00Z",
          "2025-05-29T12:00:00Z",
          "2025-05-30T12:00:00Z",
        ],
        startDate: "2025-05-25T12:00:00Z",
        endDate: "2025-05-30T23:59:00Z",
        openingTime: "12:00",
        scheduleNotes: "6 day event",
      },
    },
  },

  // EVENT_002 Core object
  {
    eventId: "EVENT_002",
    operation: "core",
    data: {
      coreData: {
        generalData: {
          eventName: "Modern Art Exhibition",
          eventCode: "MAE2025",
          description: "Exhibition featuring contemporary art pieces",
          type: "EXHIBITION",
          edition: "Spring 2025",
          yearEdition: 2025,
          websiteUrl: "https://www.museunacional.cat",
          logoUrl:
            "https://images.unsplash.com/photo-1561488111-5d800fd56b8a?w=800&auto=format&fit=crop",
          previewImageUrl:
            "https://images.unsplash.com/photo-1561488111-5d800fd56b8a?w=800&auto=format&fit=crop",
          phone: "+34 936 22 03 76",
          tags: ["art", "exhibition", "cultural"],
        },
        venueData: {
          venueName: "MNAC",
          address: "MNAC, Barcelona",
          city: "Barcelona",
          country: "Spain",
          postalCode: "08038",
          gates: ["Main Entrance", "Group Entrance"],
        },
      },
      coreQuotas: {
        quotas: [
          {
            invitationType: "GENERAL",
            quotaQuantity: 400,
            color: generateRandomColor("GENERAL"),
            description: "GENERAL ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "VIP",
            quotaQuantity: 100,
            color: generateRandomColor("VIP"),
            description: "VIP ticket quota",
            assignedQuotas: 0,
          },
        ],
        totalInvitations: 500, // 400 + 100
        remainingInvitations: 500,
      },
      coreStatus: {
        status: "Draft",
      },
      coreEventDates: {
        dates: [
          "2025-04-10T09:00:00Z",
          "2025-04-11T09:00:00Z",
          "2025-04-12T09:00:00Z",
          "2025-04-13T09:00:00Z",
          "2025-04-14T09:00:00Z",
          "2025-04-15T09:00:00Z",
          "2025-04-16T09:00:00Z",
          "2025-04-17T09:00:00Z",
          "2025-04-18T09:00:00Z",
          "2025-04-19T09:00:00Z",
          "2025-04-20T09:00:00Z",
        ],
        startDate: "2025-04-10T09:00:00Z",
        endDate: "2025-04-20T23:59:00Z",
        openingTime: "09:00",
        scheduleNotes: "11 day event",
      },
    },
  },

  // EVENT_003 Core object
  {
    eventId: "EVENT_003",
    operation: "core",
    data: {
      coreData: {
        generalData: {
          eventName: "Cruïlla Festival",
          eventCode: "CRU2025",
          description: "Music and arts festival with diverse lineup",
          type: "CONCERT",
          edition: "2025 Edition",
          yearEdition: 2025,
          websiteUrl: "https://www.cruillabarcelona.com",
          logoUrl:
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
          previewImageUrl:
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
          phone: "+34 935 10 63 61",
          tags: ["music", "festival", "arts"],
        },
        venueData: {
          venueName: "Parc del Fòrum",
          address: "Parc del Fòrum, Barcelona",
          city: "Barcelona",
          country: "Spain",
          postalCode: "08019",
          gates: ["Main Entrance", "VIP Access", "Staff Entry"],
        },
      },
      coreQuotas: {
        quotas: [
          {
            invitationType: "GENERAL",
            quotaQuantity: 600,
            color: generateRandomColor("GENERAL"),
            description: "GENERAL ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "VIP",
            quotaQuantity: 150,
            color: generateRandomColor("VIP"),
            description: "VIP ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "BACKSTAGE",
            quotaQuantity: 50,
            color: generateRandomColor("BACKSTAGE"),
            description: "BACKSTAGE ticket quota",
            assignedQuotas: 0,
          },
        ],
        totalInvitations: 800, // 600 + 150 + 50
        remainingInvitations: 800,
      },
      coreStatus: {
        status: "Upcoming",
      },
      coreEventDates: {
        dates: [
          "2025-07-15T16:00:00Z",
          "2025-07-16T16:00:00Z",
          "2025-07-17T16:00:00Z",
        ],
        startDate: "2025-07-15T16:00:00Z",
        endDate: "2025-07-17T23:59:00Z",
        openingTime: "16:00",
        scheduleNotes: "3 day event",
      },
    },
  },

  // EVENT_004 Core object
  {
    eventId: "EVENT_004",
    operation: "core",
    data: {
      coreData: {
        generalData: {
          eventName: "Contemporary Art Show",
          eventCode: "CAS2025",
          description:
            "Contemporary art exhibition showcasing emerging artists",
          type: "EXHIBITION",
          edition: "Spring 2025",
          yearEdition: 2025,
          websiteUrl: "https://www.museunacional.cat",
          logoUrl:
            "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop",
          previewImageUrl:
            "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop",
          phone: "+34 936 22 03 76",
          tags: ["art", "contemporary", "emerging"],
        },
        venueData: {
          venueName: "MNAC",
          address: "MNAC, Barcelona",
          city: "Barcelona",
          country: "Spain",
          postalCode: "08038",
          gates: ["Main Entry", "Group Access"],
        },
      },
      coreQuotas: {
        quotas: [
          {
            invitationType: "GENERAL",
            quotaQuantity: 250,
            color: generateRandomColor("GENERAL"),
            description: "GENERAL ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "VIP",
            quotaQuantity: 50,
            color: generateRandomColor("VIP"),
            description: "VIP ticket quota",
            assignedQuotas: 0,
          },
        ],
        totalInvitations: 300, // 250 + 50
        remainingInvitations: 300,
      },
      coreStatus: {
        status: "Active",
      },
      coreEventDates: {
        dates: [
          "2025-03-20T10:00:00Z",
          "2025-03-21T10:00:00Z",
          "2025-03-22T10:00:00Z",
          "2025-03-23T10:00:00Z",
          "2025-03-24T10:00:00Z",
          "2025-03-25T10:00:00Z",
        ],
        startDate: "2025-03-20T10:00:00Z",
        endDate: "2025-03-25T20:00:00Z",
        openingTime: "10:00",
        scheduleNotes: "6 day event",
      },
    },
  },

  // EVENT_005 Core object
  {
    eventId: "EVENT_005",
    operation: "core",
    data: {
      coreData: {
        generalData: {
          eventName: "Electronic Music Night",
          eventCode: "EMN2025",
          description: "A night of electronic music with top DJs",
          type: "CONCERT",
          edition: "Spring 2025",
          yearEdition: 2025,
          websiteUrl: "https://www.salarazzmatazz.com",
          logoUrl:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
          previewImageUrl:
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
          phone: "+34 933 20 82 00",
          tags: ["music", "electronic", "dj"],
        },
        venueData: {
          venueName: "Razzmatazz",
          address: "C/ Pamplona 88, Barcelona",
          city: "Barcelona",
          country: "Spain",
          postalCode: "08018",
          gates: ["Main Entry", "VIP Access"],
        },
      },
      coreQuotas: {
        quotas: [
          {
            invitationType: "GENERAL",
            quotaQuantity: 350,
            color: generateRandomColor("GENERAL"),
            description: "GENERAL ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "VIP",
            quotaQuantity: 50,
            color: generateRandomColor("VIP"),
            description: "VIP ticket quota",
            assignedQuotas: 0,
          },
        ],
        totalInvitations: 400, // 350 + 50
        remainingInvitations: 400,
      },
      coreStatus: {
        status: "Active",
      },
      coreEventDates: {
        dates: ["2025-03-18T22:00:00Z"],
        startDate: "2025-03-18T22:00:00Z",
        endDate: "2025-03-19T05:00:00Z",
        openingTime: "22:00",
        scheduleNotes: "1 day event",
      },
    },
  },

  // EVENT_006 Core object
  {
    eventId: "EVENT_006",
    operation: "core",
    data: {
      coreData: {
        generalData: {
          eventName: "Art Workshop Series",
          eventCode: "AWS2025",
          description: "Series of art workshops for aspiring artists",
          type: "WORKSHOP",
          edition: "Spring 2025",
          yearEdition: 2025,
          websiteUrl: "https://www.museunacional.cat/workshops",
          logoUrl:
            "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop",
          previewImageUrl:
            "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop",
          phone: "+34 936 22 03 76",
          tags: ["art", "workshop", "education"],
        },
        venueData: {
          venueName: "MNAC Workshop Space",
          address: "MNAC, Barcelona",
          city: "Barcelona",
          country: "Spain",
          postalCode: "08038",
          gates: ["Workshop Area Entrance"],
        },
      },
      coreQuotas: {
        quotas: [
          {
            invitationType: "PARTICIPANT",
            quotaQuantity: 60,
            color: generateRandomColor("PARTICIPANT"),
            description: "PARTICIPANT ticket quota",
            assignedQuotas: 0,
          },
          {
            invitationType: "OBSERVER",
            quotaQuantity: 15,
            color: generateRandomColor("OBSERVER"),
            description: "OBSERVER ticket quota",
            assignedQuotas: 0,
          },
        ],
        totalInvitations: 75, // 60 + 15
        remainingInvitations: 75,
      },
      coreStatus: {
        status: "Draft",
      },
      coreEventDates: {
        dates: [
          "2025-05-01T10:00:00Z",
          "2025-05-02T10:00:00Z",
          "2025-05-03T10:00:00Z",
        ],
        startDate: "2025-05-01T10:00:00Z",
        endDate: "2025-05-03T19:00:00Z",
        openingTime: "10:00",
        scheduleNotes: "3 day event",
      },
    },
  },
];

// Create Artists objects from mockEventsData
const mockArtistsOp: Artists[] = [
  // EVENT_001 Artists object
  {
    eventId: "EVENT_001",
    operation: "artists",
    artists: [
      {
        headliner: true,
        genre: "Indie Rock",
        artistName: "Arctic Monkeys",
      },
      {
        headliner: true,
        genre: "Alternative",
        artistName: "Radiohead",
      },
      {
        headliner: false,
        genre: "Electronic",
        artistName: "Disclosure",
      },
    ],
    data: {
      artistsData: {
        quantity: 3,
      },
    },
  },

  // EVENT_002 Artists object
  {
    eventId: "EVENT_002",
    operation: "artists",
    artists: [
      {
        headliner: true,
        genre: "Contemporary",
        artistName: "Maria Garcia",
      },
      {
        headliner: false,
        genre: "Modern",
        artistName: "Pablo Ruiz",
      },
    ],
    data: {
      artistsData: {
        quantity: 2,
      },
    },
  },

  // EVENT_003 Artists object
  {
    eventId: "EVENT_003",
    operation: "artists",
    artists: [
      {
        headliner: true,
        genre: "Pop",
        artistName: "Dua Lipa",
      },
      {
        headliner: true,
        genre: "Rock",
        artistName: "The Killers",
      },
      {
        headliner: false,
        genre: "Indie",
        artistName: "Two Door Cinema Club",
      },
    ],
    data: {
      artistsData: {
        quantity: 3,
      },
    },
  },

  // EVENT_004 Artists object
  {
    eventId: "EVENT_004",
    operation: "artists",
    artists: [
      {
        headliner: true,
        genre: "Contemporary",
        artistName: "Elena Martínez",
      },
      {
        headliner: false,
        genre: "Mixed Media",
        artistName: "Carlos López",
      },
      {
        headliner: false,
        genre: "Sculpture",
        artistName: "Ana Torres",
      },
    ],
    data: {
      artistsData: {
        quantity: 3,
      },
    },
  },

  // EVENT_005 Artists object
  {
    eventId: "EVENT_005",
    operation: "artists",
    artists: [
      {
        headliner: true,
        genre: "Electronic",
        artistName: "Carl Cox",
      },
      {
        headliner: false,
        genre: "Techno",
        artistName: "Nina Kraviz",
      },
      {
        headliner: false,
        genre: "House",
        artistName: "Boris Brejcha",
      },
    ],
    data: {
      artistsData: {
        quantity: 3,
      },
    },
  },

  // EVENT_006 Artists object
  {
    eventId: "EVENT_006",
    operation: "artists",
    artists: [
      {
        headliner: true,
        genre: "Mixed Media",
        artistName: "Maria Sanchez",
      },
      {
        headliner: true,
        genre: "Digital Art",
        artistName: "Joan Miró Foundation",
      },
    ],
    data: {
      artistsData: {
        quantity: 2,
      },
    },
  },
];

// Create Statistics objects from mockEventsData
const mockStatisticsOp: Statistics[] = [
  // EVENT_001 Statistics object
  {
    eventId: "EVENT_001",
    operation: "statistics",
    data: {
      statisticsData: {
        openRate: 0.65,
        totalScans: 0,
        attendanceRate: 0,
      },
    },
  },

  // EVENT_002 Statistics object
  {
    eventId: "EVENT_002",
    operation: "statistics",
    data: {
      statisticsData: {
        openRate: 0,
        totalScans: 0,
        attendanceRate: 0,
      },
    },
  },

  // EVENT_003 Statistics object
  {
    eventId: "EVENT_003",
    operation: "statistics",
    data: {
      statisticsData: {
        openRate: 0.72,
        totalScans: 0,
        attendanceRate: 0,
      },
    },
  },

  // EVENT_004 Statistics object
  {
    eventId: "EVENT_004",
    operation: "statistics",
    data: {
      statisticsData: {
        openRate: 0.58,
        totalScans: 175,
        attendanceRate: 0.63,
      },
    },
  },

  // EVENT_005 Statistics object
  {
    eventId: "EVENT_005",
    operation: "statistics",
    data: {
      statisticsData: {
        openRate: 0.81,
        totalScans: 320,
        attendanceRate: 0.82,
      },
    },
  },

  // EVENT_006 Statistics object
  {
    eventId: "EVENT_006",
    operation: "statistics",
    data: {
      statisticsData: {
        openRate: 0,
        totalScans: 0,
        attendanceRate: 0,
      },
    },
  },
];

// Create Sync objects from mockEventsData
const mockSyncOP: Sync[] = [
  // EVENT_001 Sync object
  {
    eventId: "EVENT_001",
    operation: "sync",
    data: {
      timestamps: {
        core: "2025-03-15T10:00:00Z",
        bundles: "2025-03-15T10:00:00Z",
        artists: "2025-03-15T10:00:00Z",
        statistics: "2025-03-15T10:00:00Z",
      },
    },
  },

  // EVENT_002 Sync object
  {
    eventId: "EVENT_002",
    operation: "sync",
    data: {
      timestamps: {
        core: "2025-03-01T14:30:00Z",
        bundles: "2025-03-01T14:30:00Z",
        artists: "2025-03-01T14:30:00Z",
        statistics: "2025-03-01T14:30:00Z",
      },
    },
  },

  // EVENT_003 Sync object
  {
    eventId: "EVENT_003",
    operation: "sync",
    data: {
      timestamps: {
        core: "2025-02-20T09:45:00Z",
        bundles: "2025-02-20T09:45:00Z",
        artists: "2025-02-20T09:45:00Z",
        statistics: "2025-02-20T09:45:00Z",
      },
    },
  },

  // EVENT_004 Sync object
  {
    eventId: "EVENT_004",
    operation: "sync",
    data: {
      timestamps: {
        core: "2025-02-10T11:20:00Z",
        bundles: "2025-02-10T11:20:00Z",
        artists: "2025-02-10T11:20:00Z",
        statistics: "2025-03-21T15:30:00Z",
      },
    },
  },

  // EVENT_005 Sync object
  {
    eventId: "EVENT_005",
    operation: "sync",
    data: {
      timestamps: {
        core: "2025-01-25T16:45:00Z",
        bundles: "2025-01-25T16:45:00Z",
        artists: "2025-01-25T16:45:00Z",
        statistics: "2025-03-19T10:15:00Z",
      },
    },
  },

  // EVENT_006 Sync object
  {
    eventId: "EVENT_006",
    operation: "sync",
    data: {
      timestamps: {
        core: "2025-03-10T13:25:00Z",
        bundles: "2025-03-10T13:25:00Z",
        artists: "2025-03-10T13:25:00Z",
        statistics: "2025-03-10T13:25:00Z",
      },
    },
  },
];

const mockBundlesOp: Bundles[] = [
  // EVENT_001 Bundles object
  {
    ...defaultBundles,
    eventId: "EVENT_001",
  },
  // EVENT_002 Bundles object
  {
    ...defaultBundles,
    eventId: "EVENT_002",
  },
  // EVENT_003 Bundles object
  {
    ...defaultBundles,
    eventId: "EVENT_003",
  },
  // EVENT_004 Bundles object
  {
    ...defaultBundles,
    eventId: "EVENT_004",
  },
  // EVENT_005 Bundles object
  {
    ...defaultBundles,
    eventId: "EVENT_005",
  },
  // EVENT_006 Bundles object
  {
    ...defaultBundles,
    eventId: "EVENT_006",
  },
];

// Export the arrays for use in the application
export {
  mockCoreOp,
  mockArtistsOp,
  mockStatisticsOp,
  mockSyncOP,
  mockBundlesOp,
};
