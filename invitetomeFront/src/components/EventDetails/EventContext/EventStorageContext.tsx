import React, { createContext, useContext, useState } from "react";
import {
  mockBundlesOp,
  mockCoreOp,
} from "../../../model/EventItemModel/MockData";
import { Core } from "../../../model/EventItemModel/Core";
import { getItem, setItem, removeItem } from "../../../utils/localStorage";
import { DateTimeForm } from "../Steps/Calendar";
import { QuotaStateForm } from "../Steps/quotaReducer";
import { Bundles } from "../../../model/EventItemModel/Bundles";

// Local storage key for storing event ids
const EVENT_IDS_KEY = "eventIds";
const CORE_KEY_SUFFIX = "#core";
const BUNDLES_KEY_SUFFIX = "#bundles";

interface EventStorageContextType {
  eventCores: Core[];
  eventCoreStorageApi: {
    addEventCore: (eventCore: Core) => void;
    getEventCoreById: (id: string) => Core | undefined;
    updateEventCore: (updatedEventCore: Core) => void;
    removeEventCore: (id: string) => void;
    updateTimeDates: (id: string, dateTimeForm: DateTimeForm) => void;
    updateInvitationQuotas: (
      id: string,
      invitationQuotaData: QuotaStateForm
    ) => void;
  };
  eventBundlesStorageApi: {
    setEventBundles: (eventId: string, bundles: Bundles) => void;
    getEventBundles: (eventId: string) => Bundles | undefined;
    removeEventBundles: (eventId: string) => void;
  };
}

const EventStorageContext = createContext<EventStorageContextType | undefined>(
  undefined
);

export const useEventStorageContext = () => {
  const context = useContext(EventStorageContext);
  if (!context) {
    throw new Error(
      "useEventStorageContext must be used within an EventProvider"
    );
  }
  return context;
};

const initializeEvents = () => {
  // Arrays of event ids stored in local storage
  const storedIds = getItem(EVENT_IDS_KEY) || [];
  // If no ids are found, return mock data and store them in local storage
  if (storedIds.length === 0) {
    const idsArray = mockCoreOp.map((event) => {
      // We create a key for accessing the event core operation "eventId#core"
      setItem(event.eventId + CORE_KEY_SUFFIX, event);
      return event.eventId;
    });
    setItem(EVENT_IDS_KEY, idsArray);
    return mockCoreOp;
  }
  // If ids are found, retrieve the events from local storage
  return storedIds
    .map((id: string) => {
      const eventCoreData = getItem(id + CORE_KEY_SUFFIX);
      return eventCoreData || null;
    })
    .filter(Boolean) as Core[];
};

// Provider component
export const EventStorageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [eventCores, setEventCores] = useState<Core[]>(initializeEvents);

  const eventCoreStorageApi = {
    addEventCore: (eventCore: Core) => {
      const updatedEvents = [...eventCores, eventCore];

      setItem(
        EVENT_IDS_KEY,
        updatedEvents.map((e) => e.eventId)
      );
      setItem(eventCore.eventId + CORE_KEY_SUFFIX, eventCore);

      setEventCores(updatedEvents);
    },
    getEventCoreById: (id: string) =>
      eventCores.find((eventCore) => eventCore.eventId === id),
    updateEventCore: (updatedEventCore: Core) => {
      const updatedEventCores = eventCores.map((eventCore) =>
        eventCore.eventId === updatedEventCore.eventId
          ? updatedEventCore
          : eventCore
      );

      setItem(updatedEventCore.eventId + CORE_KEY_SUFFIX, updatedEventCore);

      setEventCores(updatedEventCores);
    },
    removeEventCore: (id: string) => {
      const updatedEventCores = eventCores.filter(
        (eventCore) => eventCore.eventId !== id
      );
      const updatedIds = updatedEventCores.map(
        (eventCore) => eventCore.eventId
      );

      setItem(EVENT_IDS_KEY, updatedIds);
      removeItem(id + CORE_KEY_SUFFIX);

      setEventCores(updatedEventCores);
    },
    updateTimeDates: (id: string, dateTimeForm: DateTimeForm) => {
      let eventCore = eventCores.find((eventCore) => eventCore.eventId === id);
      if (!eventCore) {
        console.error("Event core not found for id:", id);
        return;
      }

      // Preserve the day by creating ISO strings without timezone offset
      const datesIsoformatted = dateTimeForm.selectedDates.map((date) => {
        // Create a date string that preserves the selected day regardless of timezone
        return new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            10,
            0,
            0
          )
        ).toISOString();
      });
      const startDate = datesIsoformatted[0];
      const endDate = datesIsoformatted[datesIsoformatted.length - 1];

      // Update the event core with the new dates and times
      eventCore = {
        ...eventCore,
        data: {
          ...eventCore.data,
          coreEventDates: {
            ...eventCore.data.coreEventDates,
            dates: datesIsoformatted,
            openingTime: dateTimeForm.openingTime,
            scheduleNotes: dateTimeForm.scheduleNotes,
            startDate: startDate,
            endDate: endDate,
          },
        },
      };

      const updatedEventCores = eventCores.map((eventCoreItem) =>
        eventCoreItem.eventId === id ? eventCore : eventCoreItem
      );

      setItem(id + CORE_KEY_SUFFIX, eventCore);

      setEventCores(updatedEventCores);
    },
    updateInvitationQuotas: (
      id: string,
      invitationQuotaData: QuotaStateForm
    ) => {
      let eventCore = eventCores.find((eventCore) => eventCore.eventId === id);
      if (!eventCore) {
        console.error("Event core not found for id:", id);
        return;
      }

      // Update the event core with the new quotas
      eventCore = {
        ...eventCore,
        data: {
          ...eventCore.data,
          coreQuotas: {
            ...eventCore.data.coreQuotas,
            quotas: invitationQuotaData.quotas,
            totalInvitations: invitationQuotaData.totalInvitations,
            //remainingInvitations: invitationQuotaData.remainingInvitations,
          },
        },
      };

      const updatedEventCores = eventCores.map((eventCoreItem) =>
        eventCoreItem.eventId === id ? eventCore : eventCoreItem
      );

      setItem(id + CORE_KEY_SUFFIX, eventCore);

      setEventCores(updatedEventCores);
    },
  };

  const eventBundlesStorageApi = {
    setEventBundles: (eventId: string, bundles: Bundles) => {
      setItem(eventId + BUNDLES_KEY_SUFFIX, bundles);
    },
    getEventBundles: (eventId: string) => {
      if (!eventId) {
        console.error("Event ID is required to get event bundles.");
        return;
      }
      // Check if there are events with the same ID
      const eventExists = getItem(EVENT_IDS_KEY).includes(eventId);
      if (!eventExists) {
        console.error("Event ID does not exist in local storage.");
        return;
      }
      const bundles = getItem(eventId + BUNDLES_KEY_SUFFIX);
      // Event exists, but bundles are not in local storage
      if (!bundles) {
        const bundlesData = mockBundlesOp.find(
          (bundle) => bundle.eventId === eventId
        );

        setItem(eventId + BUNDLES_KEY_SUFFIX, bundlesData);
        return bundlesData;
      }
      return bundles;
    },
    removeEventBundles: (eventId: string) => {
      removeItem(eventId + BUNDLES_KEY_SUFFIX);
    },
  };

  return (
    <EventStorageContext.Provider
      value={{ eventCores, eventCoreStorageApi, eventBundlesStorageApi }}
    >
      {children}
    </EventStorageContext.Provider>
  );
};
