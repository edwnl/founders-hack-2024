// app/actions/eventActions.js
"use server";

import { db } from "../../../firebase/config";
import {
  collection,
  query,
  getDocs,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";

export async function getAllEvents(searchTerm = "") {
  try {
    let eventsQuery;
    if (searchTerm) {
      // If there's a search term, create a query that filters events
      eventsQuery = query(
        collection(db, "event"),
        orderBy("event_name"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff"),
      );
    } else {
      // If no search term, fetch all events
      eventsQuery = query(collection(db, "event"));
    }

    const eventSnapshots = await getDocs(eventsQuery);

    const events = eventSnapshots.docs.map((doc) => {
      const eventData = doc.data();
      return {
        ...eventData,
        _id: doc.id,
        event_start: eventData.event_start.toDate().toISOString(),
        event_end: eventData.event_end.toDate().toISOString(),
      };
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
