// app/events/actions.js
"use server";

import { db } from "../../../firebase/config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export async function createNewEvent(userId) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Create the new event document
    const newEventRef = await addDoc(collection(db, "event"), {
      event_picture: "",
      event_name: "New Event",
      event_description: "",
      event_start: new Date(),
      event_end: new Date(),
      event_location: "",
      event_price: 0,
      attendees: [],
      matchmaker_attendees: [],
      organizer_id: userId,
    });

    // Update the user's organised_events array
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      organised_events: arrayUnion(newEventRef.id),
    });

    return { success: true, eventId: newEventRef.id };
  } catch (error) {
    console.error("Error creating new event: ", error);
    return { success: false, error: error.message };
  }
}
