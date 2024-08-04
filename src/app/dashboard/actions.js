// app/actions/userDashboardActions.js
"use server";

import { db, auth } from "../../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";

/**
 * Getting all user's registered event
 * @param userId
 * @returns the events of the users
 */
export async function getUserEvents(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    const userData = userSnap.data();
    const userTickets = userData.tickets || {};

    const eventPromises = Object.entries(userTickets).map(
      async ([eventId, quantity]) => {
        const eventRef = doc(db, "event", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();

          // Convert Firestore timestamps to ISO strings
          const convertedEventData = {
            ...eventData,
            event_start: eventData.event_start.toDate().toISOString(),
            event_end: eventData.event_end.toDate().toISOString(),
          };

          return {
            ...convertedEventData,
            _id: eventSnap.id,
            user_tickets: quantity,
            isMatchMaker:
              userData.matchmaker?.matchmaker_tickets?.includes(eventSnap.id) ||
              false,
          };
        }
        return null;
      },
    );

    const events = await Promise.all(eventPromises);
    return events.filter((event) => event !== null);
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
}

/**
 * Enrolled into the Matchmaking of that event
 * @param userId
 * @param eventId
 * @param isMatchMaker
 * @returns {Promise<{success: boolean}|{success: boolean, error: string}>}
 */
export async function toggleMatchMaker(userId, eventId, isMatchMaker) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    // Check if user is found
    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    const userData = userSnap.data();
    let matchmakerTickets = userData.matchmaker?.matchmaker_tickets || [];

    if (isMatchMaker) {
      matchmakerTickets = [...new Set([...matchmakerTickets, eventId])];
    } else {
      matchmakerTickets = matchmakerTickets.filter((id) => id !== eventId);
    }
    // Update the database
    await updateDoc(userRef, {
      "matchmaker.matchmaker_tickets": matchmakerTickets,
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling matchmaker status:", error);
    throw error;
  }
}

/**
 * Get user's organised events
 * @param userId
 * @returns {Promise<Awaited<{[p: string]: any, event_start: *, event_end: *, attendees, _id: string}|null>[]|{success: boolean, error: string}>}
 */
export async function getOrganizerEvents(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    const userData = userSnap.data();
    const organizedEventIds = userData.organised_events || [];

    const eventPromises = organizedEventIds.map(async (eventId) => {
      const eventRef = doc(db, "event", eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        const eventData = eventSnap.data();

        // Convert Firestore timestamps to ISO strings
        const convertedEventData = {
          ...eventData,
          event_start: eventData.event_start.toDate().toISOString(),
          event_end: eventData.event_end.toDate().toISOString(),
        };

        return {
          ...convertedEventData,
          _id: eventSnap.id,
          attendees: eventData.attendees || [],
        };
      }
      return null;
    });

    const events = await Promise.all(eventPromises);
    return events.filter((event) => event !== null);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    throw error;
  }
}
