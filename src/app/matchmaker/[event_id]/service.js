"use server"
import {collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore'
import {db} from "../../../../firebase/config";
export async function getUserData(userID) {
  const userRef = doc(db, "users", userID);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) return snapshot.data();
  else throw new Error(`Could not find user with id ${userID}`);
}
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
          dob: data.dob.toDate().toISOString(),
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
