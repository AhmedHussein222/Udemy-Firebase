export const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // ملف مفتاح الخدمة

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
// module.exports = { db };
