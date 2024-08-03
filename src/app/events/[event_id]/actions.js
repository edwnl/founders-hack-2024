// actions.js
import { db, auth } from "../../../../firebase/config";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

export const updateUserTickets = async (userId, eventId, quantity) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`tickets.${eventId}`]: increment(quantity),
    });
    console.log("User tickets updated successfully.");
  } catch (error) {
    console.error("Error updating user tickets: ", error);
  }
};

export const updateEventAttendees = async (eventId, userId, quantity) => {
  try {
    const eventRef = doc(db, "events", eventId);
    for (let i = 0; i < quantity; i++) {
      await updateDoc(eventRef, {
        attendees: arrayUnion(userId),
      });
    }
    console.log("Event attendees updated successfully.");
  } catch (error) {
    console.error("Error updating event attendees: ", error);
  }
};
