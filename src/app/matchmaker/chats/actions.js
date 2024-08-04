// app/matchmaker/chats/actions.js
"use server"

import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

import { db } from "../../../../firebase/config";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL
  });
}

export async function getMatchesForUser(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const matchmakerData = userData.matchmaker || {};
    const matchIds = matchmakerData.matchmaker_matches || [];

    const matchesData = await Promise.all(
      matchIds.map(async (matchId) => {
        const matchRef = doc(db, "users", matchId);
        const matchDoc = await getDoc(matchRef);
        
        if (matchDoc.exists()) {
          const matchData = matchDoc.data();
          const matchmakerData = matchData.matchmaker || {};
          
          return {
            id: matchId,
            name: matchmakerData.matchmaker_name || "Unknown",
            avatar: matchmakerData.matchmaker_pictures?.[0] || null,
            lastMessage: await getLastMessage(userId, matchId),
          };
        }
        return null;
      })
    );

    return matchesData.filter(Boolean);
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
}

export async function sendMessage(chatId, senderId, content) {
  if (!senderId) {
    throw new Error("User ID is required");
  }

  const db = admin.database();
  const chatRef = db.ref(`chats/${chatId}/messages`);
  
  try {
    console.log('Attempting to send message:', { chatId, senderId, content });
    const result = await chatRef.push({
      senderId,
      content,
      timestamp: Date.now(),
    });
    console.log('Message sent successfully:', result.key);
    return result.key;
  } catch (error) {
    console.error('Error sending message:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getChatId(userId1, userId2) {
  return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
}

async function getLastMessage(userId1, userId2) {
  const chatId = await getChatId(userId1, userId2);
  const db = admin.database();
  const chatRef = db.ref(`chats/${chatId}/messages`);
  
  try {
    const snapshot = await chatRef.orderByChild('timestamp').limitToLast(1).once('value');
    let lastMessage = "No messages yet";

    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      lastMessage = message.content;
    });

    return lastMessage;
  } catch (error) {
    console.error("Error fetching last message:", error);
    return "Error fetching last message";
  }
}