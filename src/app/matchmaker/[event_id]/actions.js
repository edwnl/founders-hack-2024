"use server"
import {collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore'
import {db} from "../../../../firebase/config";

/**
 * Get user data from UID
 * @param userID
 * @returns userData in JSON
 */
export async function getUserData(userID) {
  const userRef = doc(db, "users", userID);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) return snapshot.data();
  else throw new Error(`Could not find user with id ${userID}`);
}

/**
 * Get attendees from an events
 * @param eventID
 * @returns attendeesData
 */
export async function getAttendeesOfAnEvent(eventID){
  const eventsRef = doc(db, "event", eventID);
  const snapshot = await getDoc(eventsRef);
  if (snapshot.exists()){

    const attendeesID = snapshot.data().matchmaker_attendees;
    let attendeesData = [];
    for (const attendee of attendeesID){
      const data = await getUserData(attendee)
          .catch(console.error);
      if (data){

        const transformedData = {
          ...data,
          matchmaker: {
            ... (this.matchmaker),
            date_of_birth: this.date_of_birth.toDate().toISOString(),
          },
          id: attendee
        }
        attendeesData.push(transformedData);
      }

    }
    return attendeesData;
  } else {
    throw new Error(`Could not find event`);
  }
}


export async function addLikes(userIDSrc, userIDEnd) {
  const userRefSrc = doc(db, "users", userIDSrc);
  const snapshot = await getDoc(userRefSrc);
  const userRefEnd = doc(db, "users", userIDEnd);
  const endUserSnapshot = await getDoc(userRefEnd);

  if (snapshot.exists() && endUserSnapshot.exists()){
    // Check for pending array
    if (!snapshot.data().hasOwnProperty("pendingMatches")){
      await updateDoc(userRefSrc, {
        pendingMatches: []
      });
    }
    if (!snapshot.data().hasOwnProperty("pendingMatches")){
      await updateDoc(userRefSrc, {
        pendingMatches: []
      });
    }

    // Check if the end user have the current user ID in it
    const foundUser = endUserSnapshot.data().pendingMatches.find(item => item === userIDSrc);

    if (foundUser){

      // remove them from pending matches
      await updateDoc(userRefEnd, {
        pendingMatches: arrayRemove(userIDSrc)
      })
      // add them to the match
      await updateDoc(userRefEnd, {
        matchSucceed: arrayUnion(userIDSrc)
      });
      await updateDoc(userRefSrc, {
        matchSucceed: arrayUnion(userIDEnd)
      });

      return "matched";
    }

    // Update pending matches if no matches from the other end
    await updateDoc(userRefSrc, {
      pendingMatches: arrayUnion(userIDEnd)
    });

    await updateDoc(userRefEnd, {
      pendingMatches: arrayUnion(userIDSrc)
    });
    return "pending";
  }
}

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
