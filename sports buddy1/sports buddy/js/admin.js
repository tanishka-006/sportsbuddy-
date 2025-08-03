import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ✅ Ensure admin is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// ✅ Logout Handler
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// 🔧 Add Category/City/Area Logic
const handleAdd = async (e, type) => {
  e.preventDefault();
  const input = document.getElementById(`${type}Input`);
  if (!input || !input.value.trim()) return alert("Enter a valid name");

  try {
    await addDoc(collection(db, type), { name: input.value.trim() });
    input.value = "";
    loadAllEvents();
  } catch (error) {
    console.error(`Error adding ${type}:`, error.message);
  }
};

["category", "city", "area"].forEach((type) => {
  const form = document.getElementById(`add${type.charAt(0).toUpperCase() + type.slice(1)}Form`);
  if (form) form.addEventListener("submit", (e) => handleAdd(e, type));
});

// 🗑️ Delete Event
const deleteEvent = async (docId, userId) => {
  try {
    const eventRef = doc(db, `users/${userId}/events/${docId}`);
    await deleteDoc(eventRef);
    loadAllEvents();
  } catch (error) {
    console.error("Error deleting event:", error.message);
  }
};

// 📥 Load All Events from All Users
const loadAllEvents = async () => {
  const container = document.getElementById("eventList");
  container.innerHTML = "<p>Loading events...</p>";

  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    let allHTML = "";

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const eventsRef = collection(db, `users/${userId}/events`);
      const q = query(eventsRef, orderBy("createdAt", "desc"));
      const eventsSnapshot = await getDocs(q);

      eventsSnapshot.forEach((docSnap) => {
        const event = docSnap.data();
        allHTML += `
          <div class="event-card">
            <h3>${event.title || "No Title"}</h3>
            <p>${event.description || ""}</p>
            <p><strong>Category:</strong> ${event.category}</p>
            <p><strong>City:</strong> ${event.city}</p>
            <p><strong>Area:</strong> ${event.area}</p>
            <button onclick="deleteEvent('${docSnap.id}', '${userId}')">Delete</button>
          </div>
        `;
      });
    }

    container.innerHTML = allHTML || "<p>No events found.</p>";
  } catch (error) {
    console.error("Error loading events:", error.message);
    container.innerHTML = "<p>Error loading events.</p>";
  }
};

window.deleteEvent = deleteEvent;
loadAllEvents();
