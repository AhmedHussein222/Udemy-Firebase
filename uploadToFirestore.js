const { db } = require("./firebase-admin");
const fs = require("fs");

// 1. قراءة ملف JSON
const rawData = fs.readFileSync("./Data/Users.json");
const usersData = JSON.parse(rawData);

// 2. رفع بيانات المستخدمين (Upload Users Data)
async function uploadUsersData() {
  try {
    // رفع بيانات المسؤول
    // const adminDocRef = db.collection("users").doc("admin");
    // await adminDocRef.set(usersData.admin["1"]);
    // console.log("Admin Data Uploaded ✅");

    // رفع بيانات المدربين
    const instructorsCollectionRef = db
      .collection("users")
      .collection("instructors")
    for (const [id, instructor] of Object.entries(usersData.instructor)) {
      await instructorsCollectionRef.doc(id).set(instructor);
    }
    console.log("Instructors Data Uploaded ✅");

    // رفع بيانات الطلاب
    const studentsCollectionRef = db
      .collection("users")
      .collection("students")
    for (const [id, student] of Object.entries(usersData.students)) {
      await studentsCollectionRef.doc(id).set(student);
    }
    console.log("Students Data Uploaded ✅");
  } catch (error) {
    console.error("Error Uploading Users Data ❌:", error);
  }
}

uploadUsersData();
