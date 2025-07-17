import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useEventStorageContext } from "./EventStorageContext";
import { Core, emptyEventData } from "../../../model/EventItemModel/Core";

/* Context for managing event details */
interface EventDetailContextType {
  currentEvent: any;
  dispatch: React.Dispatch<Action>;
}

const EventDetailContext = createContext<EventDetailContextType | undefined>(
  undefined
);

export const useEventDetailContext = () => {
  const context = useContext(EventDetailContext);
  if (!context) {
    throw new Error(
      "useEventDetailContext must be used within an EventDetailProvider"
    );
  }
  return context;
};

interface CoreReducerState {
  eventCore: Core;
  lastAction: string;
  lastPayload: GeneralInfoForm | any;
}

export const EventDetailProvider: React.FC<{
  children: React.ReactNode;
  id: string;
}> = ({ children, id }) => {
  const { eventCoreStorageApi } = useEventStorageContext();

  const initReducer = (id: string) => {
    if (id) {
      const eventData = eventCoreStorageApi.getEventCoreById(id);
      if (eventData) {
        console.info("Loading event data into reducer", eventData);
        return {
          eventCore: eventData,
          lastAction: "INIT",
          lastPayload: {},
        } as CoreReducerState;
      } else {
        console.error(
          "Failed to load event data, initializing empty event data"
        );
        return {
          eventCore: emptyEventData,
          lastAction: "INIT",
          lastPayload: {},
        } as CoreReducerState;
      }
    }
    console.info("No event data found, initializing empty event data");
    return {
      eventCore: emptyEventData,
      lastAction: "INIT",
      lastPayload: {},
    } as CoreReducerState;
  };

  const [eventCoreState, dispatch] = useReducer(eventReducer, {}, () =>
    initReducer(id)
  );

  useEffect(() => {
    console.info("Last action:", eventCoreState.lastAction);
    console.info("Last payload:", eventCoreState.lastPayload);
    eventCoreStorageApi.updateEventCore(eventCoreState.eventCore);
  }, [eventCoreState.lastAction, eventCoreState.lastPayload]);

  return (
    <EventDetailContext.Provider value={{ currentEvent: eventCoreState.eventCore, dispatch }}>
      {children}
    </EventDetailContext.Provider>
  );
};

export interface GeneralInfoForm {
  eventCode: string;
  name: string;
  tags: string[];
  venue: string;
  city: string;
  address: string;
  gates: string[];
}

/* Reducer for managing event details */
type Action = { type: "GENERAL_INFO"; payload: GeneralInfoForm };

const eventReducer = (state: CoreReducerState, action: Action) => {
  switch (action.type) {
    case "GENERAL_INFO":
      return {
        eventCore: {
          ...state.eventCore,
          data: {
            ...state.eventCore.data,
            coreData: {
              ...state.eventCore.data.coreData,
              generalData: {
                ...state.eventCore.data.coreData.generalData,
                eventCode: action.payload.eventCode,
                eventName: action.payload.name,
                tags: action.payload.tags,
              },
              venueData: {
                ...state.eventCore.data.coreData.venueData,
                venueName: action.payload.venue,
                city: action.payload.city,
                address: action.payload.address,
                gates: action.payload.gates,
              },
            },
          },
        },
        lastAction: action.type,
        lastPayload: action.payload as GeneralInfoForm,
      };
    default:
      return state;
  }
};

