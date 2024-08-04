"use server";

import { db } from "../../../../firebase/config";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

/**
 * Fetch events details
 * @param event_id
 * @returns {Promise<{success: boolean, error: string}|{data: {[p: string]: any, event_start: *, event_end: *}, success: boolean}>}
 */
export async function fetchEvent(event_id) {
  try {
    const eventRef = doc(db, "event", event_id);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      const eventData = eventSnap.data();

      // Convert event_start and event_end to ISO strings
      const convertedEventData = {
        ...eventData,
        event_start: eventData.event_start.toDate().toISOString(),
        event_end: eventData.event_end.toDate().toISOString(),
      };

      return { success: true, data: convertedEventData };
    } else {
      return { success: false, error: "Event not found" };
    }
  } catch (error) {
    console.error("Error fetching event data: ", error);
    return { success: false, error: "Error fetching event data" };
  }
}

export async function buyTickets(event_id, user_id, ticketQuantity) {
  try {
    // Update user's tickets
    const userRef = doc(db, "users", user_id);
    await updateDoc(userRef, {
      [`tickets.${event_id}`]: increment(ticketQuantity),
    });

    // Update event attendees
    const eventRef = doc(db, "event", event_id);
    await updateDoc(eventRef, {
      attendees: increment(ticketQuantity),
    });

    return {
      success: true,
      message: `Successfully purchased ${ticketQuantity} ticket(s)!`,
    };
  } catch (error) {
    console.error("Error processing the transaction: ", error);
    return { success: false, error: "Error processing the transaction" };
  }
}
