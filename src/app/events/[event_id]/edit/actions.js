"use server";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";
import { db, storage } from "../../../../../firebase/config";

export async function createEvent(eventData) {
  try {
    const eventRef = await addDoc(collection(db, "event"), {
      event_picture: eventData.event_picture,
      event_name: eventData.event_name,
      event_description: eventData.event_description,
      event_start: new Date(eventData.event_start),
      event_end: new Date(eventData.event_end),
      event_location: eventData.event_location,
      event_price: eventData.event_price,
      event_capacity: eventData.event_capacity,
      matchmaker_attendees: [],
      attendees: [],
      organizer_id: eventData.organizer_id, // Make sure to pass this from the client
    });

    // Update the user's organised_events field
    const userRef = doc(db, "users", eventData.organizer_id);
    await updateDoc(userRef, {
      organised_events: arrayUnion(eventRef.id),
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Event created successfully",
      eventId: eventRef.id,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function loadEvent(eventId) {
  try {
    const eventRef = doc(db, "event", eventId);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      const eventData = eventSnap.data();
      return {
        success: true,
        data: {
          id: eventSnap.id,
          ...eventData,
          event_start: eventData.event_start.toDate().toISOString(),
          event_end: eventData.event_end.toDate().toISOString(),
        },
      };
    } else {
      return {
        success: false,
        error: `Event with ID '${eventId}' doesn't exist.`,
      };
    }
  } catch (error) {
    console.error("Error loading event:", error);
    return { success: false, error: "Failed to load event" };
  }
}

export async function uploadImage(file) {
  try {
    const fileName = `event_images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function updateEvent(eventId, eventData) {
  try {
    const eventRef = doc(db, "event", eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return { success: false, error: "Event not found" };
    }

    await updateDoc(eventRef, {
      event_picture: eventData.event_picture,
      event_name: eventData.event_name,
      event_description: eventData.event_description,
      event_start: new Date(eventData.event_start),
      event_end: new Date(eventData.event_end),
      event_location: eventData.event_location,
      event_price: eventData.event_price,
      event_capacity: eventData.event_capacity,
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Event updated successfully" };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Failed to update event" };
  }
}
