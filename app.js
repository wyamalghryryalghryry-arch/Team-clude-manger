// 1. إعدادات Firebase الخاصة بك
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
    taskList.innerHTML = '';

    snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('div');
        li.className = 'task-item';
       
        // بناء شكل السطر مع زر الحذف الأساسي
        li.innerHTML = `
            <span><strong>${data.task}</strong> (بواسطة: ${data.student})</span>
            <div class="buttons-container" style="display: inline-block;">
                <button class="delete-btn" onclick="deleteTask('${doc.id}')">حذف</button>
            </div>
        `;
       
        // --- إضافة زر التعديل برمجياً بواسطة فلة الشتاء ---
        const editBtn = document.createElement('button');
        editBtn.innerText = 'تعديل';
        editBtn.style.backgroundColor = '#f39c12'; // برتقالي
        editBtn.style.color = 'white';
        editBtn.style.border = 'none';
        editBtn.style.marginRight = '5px';
        editBtn.style.padding = '2px 8px';
        editBtn.style.borderRadius = '4px';
        editBtn.style.cursor = 'pointer';

        // وظيفة التعديل مع رسالة التأكيد
        editBtn.onclick = async () => {
            const confirmEdit = confirm("هل تريد تعديل هذه المهمة؟");
            if (confirmEdit) {
                const newValue = prompt("أدخل الاسم الجديد للمهمة:", data.task);
                if (newValue && newValue !== data.task) {
                    await db.collection("tasks").doc(doc.id).update({
                        task: newValue
                    });
                    alert("تم التعديل بنجاح!");
                }
            }
        };

        // إضافة زر التعديل بجانب زر الحذف داخل الـ div
        li.querySelector('.buttons-container').appendChild(editBtn);
        taskList.appendChild(li);
    });
  
    if (snapshot.size > 0) {
        document.getElementById('loadingText')?.remove();
    }
});

// 5. دالة الحذف (Delete)
async function deleteTask(id) {
    if (confirm("هل تريد حذف هذه المهمة من السحابة؟")) {
        await db.collection("tasks").doc(id).delete();
    }
}

