import React from "react";
import { v4 as uuid } from "uuid";
import { analytics } from "./firebase";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { EventMap } from "./analyticsEvents";

const userId = getOrCreateFromStorage(localStorage, "id", () => uuid());
const sessionId = getOrCreateFromStorage(sessionStorage, "id", () => uuid());

analytics.setUserId(userId);

function makeEvent<K extends keyof EventMap>(
  name: K,
  properties: EventMap[K]
): Event<K> {
  return {
    name,
    timestamp: new Date(),
    properties,
  };
}

interface Event<K extends keyof EventMap> {
  name: K;
  timestamp: Date;
  properties: EventMap[K];
}

interface AnalyticsContextType {
  unsentEvents: Event<any>[];
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  unsentEvents: [],
});

interface Props {
  children: any;
}

export const AnalyticsProvider = (props: Props) => {
  const unsentEvents = useRef([]);

  useEffect(() => {
    async function sendAnalyticsEvents() {
      // TODO: Implement This
      console.log(sessionId);
    }

    let timeout: NodeJS.Timeout;
    function scheduleNextSend() {
      timeout = setTimeout(async () => {
        await sendAnalyticsEvents();
        scheduleNextSend();
      }, 500);
    }

    scheduleNextSend();

    return () => clearTimeout(timeout);
  });

  return (
    <AnalyticsContext.Provider value={{ unsentEvents: unsentEvents.current }}>
      {props.children}
    </AnalyticsContext.Provider>
  );
};

type TrackEventFn = <K extends keyof EventMap>(
  name: K,
  properties: EventMap[K]
) => void;

export function useTrack(): TrackEventFn {
  const context = useContext(AnalyticsContext);

  return useCallback(
    <K extends keyof EventMap>(name: K, properties: EventMap[K]) => {
      const event = makeEvent(name, properties);
      context.unsentEvents.push(event);
    },
    [context]
  );
}

export function useTrackViewed<K extends keyof EventMap>(
  key: K,
  properties: EventMap[K]
) {
  const track = useTrack();
  useEffect(() => track(key, properties), []);
}

export function useTrackFn<K extends keyof EventMap>(
  key: K,
  properties: EventMap[K]
) {
  const track = useTrack();

  return useCallback(() => track(key, properties), []);
}

function getOrCreateFromStorage(
  storage: Storage,
  key: string,
  create: () => string
): string {
  const item = storage.getItem(key);
  if (item) {
    return item;
  }

  const newItem = create();
  storage.setItem(key, newItem);
  return newItem;
}
