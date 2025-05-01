const { db } = require("./firebase-admin");
const fs = require("fs");

// 1. قراءة ملف JSON
const rawData = fs.readFileSync("./Final Data/courses.json");

const coursesData = JSON.parse(rawData).courses; // Access the courses array

// 2. رفع الدفعات (Batch Upload)
async function uploadInBatches() {
  const batchSize = 500; // زيادة حجم الدفعة للأداء الأفضل
  let batch = db.batch();
  let operationCount = 0;

  // تحديد مجموعة Firestore
  const coursesCollection = db.collection("Courses");
  try {
    for (let i = 0; i < coursesData.length; i++) {
      const course = coursesData[i];
      const docRef = coursesCollection.doc(course.course_id.toString()); // استخدام course_id كمعرف
      batch.set(docRef, course);
      operationCount++;

      // إرسال الدفعة عند الوصول إلى الحد الأقصى
      if (operationCount === batchSize || i === coursesData.length - 1) {
        await batch.commit();
        console.log(
          `Uploaded batch: ${Math.ceil((i + 1) / batchSize)} (${i + 1}/${
            coursesData.length
          } courses)`
        );
        batch = db.batch();
        operationCount = 0;
      }
    }
    console.log("All Courses Uploaded Successfully ✅");
  } catch (error) {
    console.error("Error uploading courses ❌:", error);
    throw error; // Re-throw to handle it in the calling code if needed
  }
}

// Uncomment to run the upload
uploadInBatches();

// 3. رفع المستخدمين (Upload Users)
async function uploadUsers() {
  const filePath = "./Final Data/users.json"; // Path to users.json

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath);
  const usersData = JSON.parse(rawData);

  const usersCollection = db.collection("Users");
  const users = usersData.collection.Users;

  try {
    for (const userId in users) {
      if (users.hasOwnProperty(userId)) {
        const user = users[userId];
        await usersCollection.doc(userId).set(user);
        console.log(`Uploaded user: ${userId}`);
      }
    }
    console.log("All Users Uploaded ✅");
  } catch (error) {
    console.error("Error uploading users ❌:", error);
  }
}

// Call the function to upload users
// uploadUsers();
