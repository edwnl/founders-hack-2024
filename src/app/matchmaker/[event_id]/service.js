"use server"
import {collection, doc, setDoc, getDoc} from 'firebase/firestore'
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
        console.log(data);
        const transformedData = {
          ...data,
          dob: data.dob.toDate().toISOString(),
        }
        attendeesData.push(transformedData);
      }

    }
    // console.log(attendeesData);
    return attendeesData;
  } else {
    console.log(":(");
  }

}

