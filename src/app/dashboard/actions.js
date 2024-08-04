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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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

export async function toggleMatchMaker(userId, eventId, isMatchMaker) {
  try {
    const userRef = doc(db, "users", userId);
    const eventRef = doc(db, "event", eventId);

    // Get user and event data
    const [userSnap, eventSnap] = await Promise.all([
      getDoc(userRef),
      getDoc(eventRef),
    ]);

    if (!userSnap.exists()) {
      return { success: false, error: "User not found" };
    }

    if (!eventSnap.exists()) {
      return { success: false, error: "Event not found" };
    }

    // Prepare update operations
    const userUpdate = {
      "matchmaker.matchmaker_tickets": isMatchMaker
        ? arrayUnion(eventId)
        : arrayRemove(eventId),
    };

    const eventUpdate = {
      matchmaker_attendees: isMatchMaker
        ? arrayUnion(userId)
        : arrayRemove(userId),
    };

    // Perform updates
    await Promise.all([
      updateDoc(userRef, userUpdate),
      updateDoc(eventRef, eventUpdate),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error toggling matchmaker status:", error);
    throw error;
  }
}

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
