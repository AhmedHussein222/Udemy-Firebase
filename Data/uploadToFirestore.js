const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// تحميل بيانات الاتصال بـ Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const files = [{ file: "Users.json", collection: "Users" }];

// عملية الرفع
files.forEach(({ file, collection }) => {
  const filePath = path.join(__dirname, file);
  console.log(`[INFO] Processing file: ${file} -> collection: ${collection}`);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const items = data.collection?.[collection]; // Access nested structure

    if (!items || typeof items !== "object") {
      console.warn(
        `[WARN] No valid data found for collection '${collection}' in file '${file}'`
      );
      return;
    }

    const itemsArray = Object.entries(items); // Convert object to array of [id, data]
    itemsArray.forEach(async ([id, item]) => {
      try {
        if (!item?.first_name || !item?.last_name) {
          console.warn(
            `[WARN] Skipping item with missing first_name or last_name in [${collection}] from file '${file}'`
          );
          return;
        }

        await db.collection(collection).doc(id).set(item); // Use id as document ID
        console.log(
          `[INFO] ✅ Uploaded to [${collection}]: ${item.first_name} ${item.last_name}`
        );
      } catch (error) {
        console.error(
          `[ERROR] ❌ Failed to upload item from [${collection}] in file '${file}':`,
          error.message
        );
      }
    });
  } catch (err) {
    console.error(
      `[ERROR] Error reading or parsing file '${file}':`,
      err.message
    );
  }
});
