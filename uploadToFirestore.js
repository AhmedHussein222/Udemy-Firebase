const { db } = require("./firebase-admin");
const fs = require("fs");

// 1. قراءة ملف JSON
const rawData = fs.readFileSync("./Final Data/courses.json");

const coursesData = JSON.parse(rawData).courses; // Access the courses array

// 2. رفع الدفعات (Batch Upload)
async function uploadCourses() {
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
uploadCourses();

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

// 4. رفع التصنيفات (Upload Categories)
async function uploadCategories() {
  const filePath = "./Final Data/category.json";

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath);
  const categoriesData = JSON.parse(rawData);

  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  const categoriesCollection = db.collection("Categories");

  try {
    for (let i = 0; i < categoriesData.length; i++) {
      const category = categoriesData[i];
      const docRef = categoriesCollection.doc(category.category_id);
      batch.set(docRef, category);
      operationCount++;

      if (operationCount === batchSize || i === categoriesData.length - 1) {
        await batch.commit();
        console.log(
          `Uploaded categories batch: ${Math.ceil((i + 1) / batchSize)} (${
            i + 1
          }/${categoriesData.length} categories)`
        );
        batch = db.batch();
        operationCount = 0;
      }
    }
    console.log("All Categories Uploaded Successfully ✅");
  } catch (error) {
    console.error("Error uploading categories ❌:", error);
    throw error;
  }
}

// Call the function to upload categories
// uploadCategories();

// 5. رفع التصنيفات الفرعية (Upload Sub Categories)
async function uploadSubCategories() {
  const filePath = "./Final Data/sub_category.json";

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath);
  const subCategoriesData = JSON.parse(rawData);

  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  const subCategoriesCollection = db.collection("SubCategories");

  try {
    for (let i = 0; i < subCategoriesData.length; i++) {
      const subCategory = subCategoriesData[i];
      const docRef = subCategoriesCollection.doc(subCategory.subcategory_id);
      batch.set(docRef, subCategory);
      operationCount++;

      if (operationCount === batchSize || i === subCategoriesData.length - 1) {
        await batch.commit();
        console.log(
          `Uploaded subcategories batch: ${Math.ceil((i + 1) / batchSize)} (${
            i + 1
          }/${subCategoriesData.length} subcategories)`
        );
        batch = db.batch();
        operationCount = 0;
      }
    }
    console.log("All SubCategories Uploaded Successfully ✅");
  } catch (error) {
    console.error("Error uploading subcategories ❌:", error);
    throw error;
  }
}

// Call the function to upload subcategories
// uploadSubCategories();

// 6. رفع التسجيلات (Upload Enrollments)
async function uploadEnrollments() {
  const filePath = "./Final Data/Enrollments.json";

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath);
  const enrollmentsData = JSON.parse(rawData);

  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  const enrollmentsCollection = db.collection("Enrollments");

  try {
    for (let i = 0; i < enrollmentsData.length; i++) {
      const enrollment = enrollmentsData[i];
      const docRef = enrollmentsCollection.doc(enrollment.enrollmentId);
      batch.set(docRef, enrollment);
      operationCount++;

      if (operationCount === batchSize || i === enrollmentsData.length - 1) {
        await batch.commit();
        console.log(
          `Uploaded enrollments batch: ${Math.ceil((i + 1) / batchSize)} (${
            i + 1
          }/${enrollmentsData.length} enrollments)`
        );
        batch = db.batch();
        operationCount = 0;
      }
    }
    console.log("All Enrollments Uploaded Successfully ✅");
  } catch (error) {
    console.error("Error uploading enrollments ❌:", error);
    throw error;
  }
}

// Call the function to upload enrollments
// uploadEnrollments();

// 7. رفع التقييمات (Upload Reviews)
async function uploadReviews() {
  const filePath = "./Final Data/Review.json";

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath);
  const reviewsData = JSON.parse(rawData);

  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  const reviewsCollection = db.collection("Reviews");

  try {
    for (let i = 0; i < reviewsData.length; i++) {
      const review = reviewsData[i];
      const docRef = reviewsCollection.doc(review.reviewId);
      batch.set(docRef, review);
      operationCount++;

      if (operationCount === batchSize || i === reviewsData.length - 1) {
        await batch.commit();
        console.log(
          `Uploaded reviews batch: ${Math.ceil((i + 1) / batchSize)} (${
            i + 1
          }/${reviewsData.length} reviews)`
        );
        batch = db.batch();
        operationCount = 0;
      }
    }
    console.log("All Reviews Uploaded Successfully ✅");
  } catch (error) {
    console.error("Error uploading reviews ❌:", error);
    throw error;
  }
}

// Call the function to upload reviews
// uploadReviews();

// 8. رفع الدروس (Upload Lessons)
async function uploadLessons() {
  const filePath = "./Final Data/lessons.json";

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath);
  const lessonsData = JSON.parse(rawData).lessons;

  const batchSize = 500;
  let batch = db.batch();
  let operationCount = 0;

  const lessonsCollection = db.collection("Lessons");

  try {
    for (let i = 0; i < lessonsData.length; i++) {
      const lesson = lessonsData[i];
      const docRef = lessonsCollection.doc(lesson.lesson_id);
      batch.set(docRef, lesson);
      operationCount++;

      if (operationCount === batchSize || i === lessonsData.length - 1) {
        await batch.commit();
        console.log(
          `Uploaded lessons batch: ${Math.ceil((i + 1) / batchSize)} (${
            i + 1
          }/${lessonsData.length} lessons)`
        );
        batch = db.batch();
        operationCount = 0;
      }
    }
    console.log("All Lessons Uploaded Successfully ✅");
  } catch (error) {
    console.error("Error uploading lessons ❌:", error);
    throw error;
  }
}

// Call the function to upload lessons
// uploadLessons();
