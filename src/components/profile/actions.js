// app/matchmaker/profile/actions.js

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

export async function loadMatchmakerProfile(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return { success: true, data: userData.matchmaker || {} };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error loading matchmaker profile:", error);
    return { success: false, error: error.message };
  }
}

export async function saveMatchmakerProfile(userId, profileData) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { matchmaker: profileData });
    return { success: true, message: "Profile saved successfully" };
  } catch (error) {
    console.error("Error saving matchmaker profile:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDateOfBirth(userId, dateOfBirth) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      "matchmaker.date_of_birth": dateOfBirth,
    });
    return { success: true, message: "Date of birth updated successfully" };
  } catch (error) {
    console.error("Error updating date of birth:", error);
    return { success: false, error: error.message };
  }
}
