// 1. إعدادات Firebase الخاصة بك (نسختها من صورتك)
const firebaseConfig = {
    apiKey: "AIzaSyAsaM2GkLFkP2fV8PG73otbb9e741A5oyg",
    authDomain: "team-cloud-manger.firebaseapp.com",
    projectId: "team-cloud-manger",
    storageBucket: "team-cloud-manger.firebasestorage.app",
    messagingSenderId: "905977090634",
    appId: "1:905977090634:web:f6731b4632f2cb0fdd4cb3",
    measurementId: "G-F6DCBTFZ8"
};

// 2. تشغيل Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3. دالة إضافة مهمة (Create)
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const studentInput = document.getElementById('studentInput');

    if (taskInput.value && studentInput.value) {
        await db.collection("tasks").add({
            task: taskInput.value,
            student: studentInput.value,
            status: "قيد التنفيذ",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        taskInput.value = '';
        studentInput.value = '';
    }
}

// 4. عرض البيانات وتحديثها تلقائياً (Read)
db.collection("tasks").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // مسح القائمة الحالية لإعادة الرسم

    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('div');
        li.className = 'task-item';
        li.innerHTML = `
            <span><strong>${data.task}</strong> (بواسطة: ${data.student})</span>
            <div>
                <button class="delete-btn" onclick="deleteTask('${doc.id}')">حذف</button>
            </div>
        `;
        taskList.appendChild(li);
    });
   
    // إخفاء نص التحميل إذا وجدت بيانات
    if (snapshot.size > 0) {
        document.getElementById('loadingText')?.remove();
    }
});

// 5. دالة الحذف (Delete)
async function deleteTask(id) {
  if (confirm("هل تريد حذف هذه المهمة من السحابة؟")) {
        await db.collection("tasks").doc(id).delete();
    }
// دالة التعديل - عمل فلة الشتاء لتصحيح الأسماء
window.updateTask = async function() {
    const oldTaskName = prompt("أدخل اسم المهمة الخطأ التي تريد تعديلها:");
    const newTaskName = document.getElementById('taskInput').value; // الاسم الجديد من الخانة
    const studentName = document.getElementById('studentInput').value; // اسم الطالب من الخانة

    if (!oldTaskName || !newTaskName) {
        alert("يرجى إدخال الاسم القديم والجديد");
        return;
    }

    try {
        // البحث عن المهمة في Firestore وتحديثها
        const q = query(collection(db, "tasks"), where("task", "==", oldTaskName));
        const querySnapshot = await getDocs(q);
       
        if (querySnapshot.empty) {
            alert("لم يتم العثور على مهمة بهذا الاسم!");
            return;
        }

        querySnapshot.forEach(async (docSnap) => {
            const taskRef = doc(db, "tasks", docSnap.id);
            await updateDoc(taskRef, {
                task: newTaskName,
                student: studentName
            });
        });

        alert("تم تعديل الاسم بنجاح في السحابة! حدثي الصفحة.");
    } catch (error) {
        console.error("خطأ في التعديل: ", error);
        alert("حدث خطأ أثناء التعديل");
    }
};
    
// ميزة البحث - إضافة الزميلة الثالثة
window.searchTasks = function() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let taskItems = document.querySelectorAll('.task-item'); // هذا يستهدف عناصر القائمة عندك
    
    taskItems.forEach(item => {
        let text = item.innerText.toLowerCase();
        item.style.display = text.includes(input) ? 'flex' : 'none';
    });
};    






