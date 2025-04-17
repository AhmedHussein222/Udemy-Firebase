const { db } = require('./firebase-admin');
const fs = require('fs');

// 1. قراءة ملف JSON
const rawData = fs.readFileSync('./Data/Courses/Development/WebDevelopment.json');
const coursesData = JSON.parse(rawData);

// 2. رفع الدفعات (Batch Upload)
async function uploadInBatches() {
  const batchSize = 500; // الحد الأقصى للدفعة في Firestore
  let batch = db.batch();
  const coursesCollection = db.collection('courses');

  try {
    for (let i = 0; i < coursesData.length; i++) {
      const docRef = coursesCollection.doc(); // إنشاء مُعرف فريد
      batch.set(docRef, coursesData[i]);

      // إرسال الدفعة عند الوغول إلى الحد الأقصى
      if ((i + 1) % batchSize === 0 || i === coursesData.length - 1) {
        await batch.commit();
        console.log(`تم رفع الدفعة: ${Math.ceil((i + 1) / batchSize)}`);
        batch = db.batch(); // إعادة تهيئة الدفعة
      }
    }
    console.log('✅ تم رفع جميع الدورات بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}
console.log(coursesData);


// uploadInBatches();