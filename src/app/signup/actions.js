// app/actions/createUserDocument.js
"use server";

import { db } from "../../../firebase/config";
import { doc, setDoc } from "firebase/firestore";

export async function createUserDocument(userData) {
  try {
    await setDoc(doc(db, "users", userData.uid), {
      _id: userData.uid,
      tickets: [],
      organised_events: [],
      matchmaker: {
        matchmaker_tickets: [],
        matchmaker_pictures: [],
        matchmaker_prompts: {},
        matchmaker_bio: "",
        matchmaker_name: `${userData.firstName} ${userData.lastName}`,
        matchmaker_phone: "",
        matchmaker_preference: null,
      },
    });

    return { success: true, message: "User document created successfully" };
  } catch (error) {
    console.error("Error creating user document:", error);
    return { success: false, message: error.message };
  }
}
