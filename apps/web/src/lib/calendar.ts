import type { CalendarEvent, EventSettings } from "@bday/shared";
import { addMinutesToIso, resolveMapQuery } from "@bday/shared";
import { EVENT, EVENT_DURATION_MINUTES } from "./config";

/**
 * Turn the shared event settings into a provider-agnostic calendar entry that
 * both the Google Calendar link and the ICS download are built from.
 */
export function toCalendarEvent(event: EventSettings): CalendarEvent {
  return {
    title: EVENT.title,
    description: `Celebrate ${EVENT.celebrant}'s birthday with us. See you there!`,
    location: resolveMapQuery(event),
    start: event.dateTime,
    end: addMinutesToIso(event.dateTime, EVENT_DURATION_MINUTES),
  };
}
