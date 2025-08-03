import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

let currentUser = null;

// ✅ Redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    currentUser = user;
    loadUserEvents();
  }
});

// ✅ Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// ✅ Add Event
document.getElementById("addEventForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value.trim();
  const city = document.getElementById("city").value.trim();
  const area = document.getElementById("area").value.trim();

  if (!title || !category || !city || !area) {
    return alert("Please fill in all required fields.");
  }

  try {
    await addDoc(collection(db, `users/${currentUser.uid}/events`), {
      title,
      description,
      category,
      city,
      area,
      createdAt: serverTimestamp(),
    });
    document.getElementById("addEventForm").reset();
    loadUserEvents();
  } catch (error) {
    console.error("Error adding event:", error.message);
  }
});

// ✅ Load Events for Current User
const loadUserEvents = async () => {
  const list = document.getElementById("userEvents");
  list.innerHTML = "<p>Loading your events...</p>";

  try {
    const snapshot = await getDocs(collection(db, `users/${currentUser.uid}/events`));
    let html = "";

    snapshot.forEach((docSnap) => {
      const event = docSnap.data();
      html += `
        <div class="event-card">
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <p><strong>Category:</strong> ${event.category}</p>
          <p><strong>City:</strong> ${event.city}</p>
          <p><strong>Area:</strong> ${event.area}</p>
          <button onclick="editEvent('${docSnap.id}')">Edit</button>
          <button onclick="deleteEvent('${docSnap.id}')">Delete</button>
        </div>
      `;
    });

    list.innerHTML = html || "<p>No events found.</p>";
  } catch (error) {
    console.error("Error loading user events:", error.message);
    list.innerHTML = "<p>Error loading events.</p>";
  }
};

// ✅ Delete Event
window.deleteEvent = async (id) => {
  if (!currentUser) return;
  try {
    await deleteDoc(doc(db, `users/${currentUser.uid}/events/${id}`));
    loadUserEvents();
  } catch (error) {
    console.error("Error deleting event:", error.message);
  }
};

// ✅ Edit Event
window.editEvent = async (id) => {
  const docRef = doc(db, `users/${currentUser.uid}/events/${id}`);
  const title = prompt("Enter new title:");
  const description = prompt("Enter new description:");
  if (!title) return;

  try {
    await updateDoc(docRef, { title, description });
    loadUserEvents();
  } catch (error) {
    console.error("Error updating event:", error.message);
  }
};
