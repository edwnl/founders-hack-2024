import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADDRESS_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

export default admin;
