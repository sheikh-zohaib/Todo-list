const firebaseConfig = {
    apiKey: "AIzaSyC1003mq1EVn8n9oS-rQ0KXPuQdQZU1k4",
    authDomain: "data-base-5db50.firebaseapp.com",
    projectId: "data-base-5db50",
    storageBucket: "data-base-5db50.firebasestorage.app",
    messagingSenderId: "943643704670",
    appId: "1:943643704670:web:2cdcb2ae19033628be23cf"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let myTodos = [];
let list = document.querySelector("#todoList");
let inp = document.querySelector("#todo-inp");

let addTodo = async () => {
    let val = inp.value.trim();
    let mt = val.length;
    console.log("mt =", mt);

    if (mt == 0) {
        console.log("please write something first");
        return;
    }

    console.log("adding task...");
    await db.collection("todos").add({
        text: val,
        isCompleted: false,
        time: Date.now()
    });
    inp.value = "";
    console.log("task added successfully");
}

let deleteTodo = async (todo_id) => {
    console.log("deleting task...");
    await db.collection("todos").doc(todo_id).delete();
    console.log("task deleted successfully");
}

let delAllTodos = async () => {
    console.log("deleting all tasks...");
    let all = await db.collection("todos").get();
    all.forEach(async (doc) => {
        await db.collection("todos").doc(doc.id).delete();
    });
    console.log("all tasks deleted successfully");
}

let doneTodo = async (todo_id, checkbox) => {
    if (checkbox.checked) {
        console.log("marking as done...");
        await db.collection("todos").doc(todo_id).update({
            isCompleted: true
        });
        console.log("task completed successfully");
    }
}

let editTodo = (todo_id) => {
    console.log("editing task...");
    let findTodo = myTodos.find((todo) => todo.id == todo_id);
    inp.value = findTodo.text;

    let addBtn = document.querySelector("#addBtn");
    addBtn.innerText = "update";
    addBtn.setAttribute("onClick", `updateTodo('${todo_id}')`);
}

let updateTodo = async (todo_id) => {
    console.log("updating task...");
    await db.collection("todos").doc(todo_id).update({
        text: inp.value
    });
    inp.value = "";
    let addBtn = document.querySelector("#addBtn");
    addBtn.innerText = "add";
    addBtn.setAttribute("onClick", "addTodo()");
    console.log("task updated successfully");
}

let renderTodos = () => {
    console.log(myTodos);
    list.innerHTML = "";
    myTodos.map((item) => {
        let div = document.createElement("div");
        div.className = "todo";

        if (item.isCompleted) {
            div.classList.add("done-task");
            div.innerHTML = `
                <input type="checkbox" checked disabled> ${item.text}
                <button disabled>del</button>
                <button disabled>edit</button>
            `;
        } else {
            div.innerHTML = `
                <input type="checkbox" onchange="doneTodo('${item.id}', this)"> ${item.text}
                <button onclick="deleteTodo('${item.id}')">del</button>
                <button onclick="editTodo('${item.id}')">edit</button>
            `;
        }
        list.appendChild(div);
    });
}

db.collection("todos").orderBy("time").onSnapshot((snapshot) => {
    myTodos = [];
    snapshot.forEach((doc) => {
        myTodos.push({ id: doc.id, ...doc.data() });
    });
    console.log("data loaded successfully");
    renderTodos();
});
