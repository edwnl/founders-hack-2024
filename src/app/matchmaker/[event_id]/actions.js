// app/matchmaker/[eventId]/actions.js
"use server";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase/config";

/**
 * Fetch match maker's profile
 * @param eventId
 * @param currentUserId
 * @returns {Promise<*>}
 */
export async function fetchMatchmakerProfiles(eventId, currentUserId) {
  try {
    const eventDoc = await getDoc(doc(db, "event", eventId));

    if (!eventDoc.exists()) {
      throw new Error("Event not found");
    }

    const eventData = eventDoc.data();
    const matchmakerAttendees = eventData.matchmaker_attendees || [];

    const userProfiles = await Promise.all(
      matchmakerAttendees.map(async (userId) => {
        // Skip the current user
        if (userId === currentUserId) {
          return null;
        }

        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const matchmakerData = userData.matchmaker || {};

          // Convert Timestamp to ISO string
          if (
            matchmakerData.date_of_birth &&
            typeof matchmakerData.date_of_birth.toDate === "function"
          ) {
            matchmakerData.date_of_birth = matchmakerData.date_of_birth
              .toDate()
              .toISOString();
          }

          return {
            id: userDoc.id,
            matchmaker: matchmakerData,
            tickets: userData.tickets || {},
            organised_events: userData.organised_events || [],
          };
        }
        return null;
      }),
    );

    const validProfiles = userProfiles.filter((profile) => profile !== null);
    const sortedProfiles = sortProfilesBySimilarity(validProfiles);

    return sortedProfiles;
  } catch (error) {
    console.error("Error fetching matchmaker profiles:", error);
    throw error;
  }
}

function sortProfilesBySimilarity(profiles) {
  // Implement your similarity algorithm here
  // For now, we'll just return the profiles in their original order
  return profiles;
}
