const { db } = require("./firebase-admin");
const fs = require("fs");

// 1. قراءة ملف JSON
const rawData = fs.readFileSync(
  "./Data/Courses/Development/WebDevelopment.json"
);

const coursesData = JSON.parse(rawData);

// 2. رفع الدفعات (Batch Upload)
async function uploadInBatches() {
  const batchSize = 1; // الحد الأقصى للدفعة في Firestore
  let batch = db.batch();

  // تحديد مجموعة Firestore
  const coursesCollection = db.collection("Courses/Development/WebDevelopment");
  try {
    for (let i = 0; i < 2; i++) {
      const course = coursesData[i];
      // Ensure content is an array of objects
      if (Array.isArray(course.content)) {
        course.content = course.content.map((item, index) => ({
          ...item,
          id: index + 1, // Add unique IDs to content objects
        }));
      }

      const docRef = coursesCollection.doc(); // إنشاء مُعرف فريد
      batch.set(docRef, course);

      // إرسال الدفعة عند الوغول إلى الحد الأقصى
      if ((i + 1) % batchSize === 0 || i === coursesData.length - 1) {
        await batch.commit();
        console.log(`Uplaoded Done ${Math.ceil((i + 1) / batchSize)}`);
        batch = db.batch(); // إعادة تهيئة الدفعة
      }
    }
    console.log("All Courses Uploaded ✅ ");
  } catch (error) {
    console.error("Error ❌:", error);
  }
}

uploadInBatches();
