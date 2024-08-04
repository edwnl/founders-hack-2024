// app/actions/user.js
// @/app/actions/userActions.js
'use server'

import { db } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export async function getUserData(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  } else {
    throw new Error("User not found");
  }
}