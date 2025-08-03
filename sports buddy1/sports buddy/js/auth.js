import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ✅ Admin Emails
const ADMIN_EMAILS = ["admin@sportsbuddy.com"];

// ✅ DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showLoginBtn = document.getElementById("showLogin");
const showRegisterBtn = document.getElementById("showRegister");
const msg = document.getElementById("loginMsg") || document.getElementById("userLoginMsg");

// ✅ Utility Function for Message Display
function showMessage(text, type = "info") {
  if (msg) {
    msg.textContent = text;
    msg.style.color =
      type === "error" ? "crimson" :
      type === "success" ? "limegreen" :
      "#ffffff";
  }
}

// ✅ Toggle Login/Register (For user.html only)
if (showLoginBtn && showRegisterBtn && loginForm && registerForm) {
  showLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    showMessage("");
  });

  showRegisterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    showMessage("");
  });
}

// ✅ Login Handler
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("loginPassword")?.value.trim();

    if (!email || !password) {
      return showMessage("⚠️ Please enter both email and password.", "error");
    }

    try {
      loginForm.querySelector("button").disabled = true;
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("✅ Login successful! Redirecting...", "success");

      setTimeout(() => {
        const isAdmin = ADMIN_EMAILS.includes(email);
        window.location.href = isAdmin ? "admin-panel.html" : "user-dashboard.html";
      }, 1000);

    } catch (error) {
      console.error("Login Error:", error.message);
      showMessage(`❌ Login failed: ${error.message}`, "error");
    } finally {
      loginForm.querySelector("button").disabled = false;
    }
  });
}

// ✅ Register Handler
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("registerPassword")?.value.trim();

    if (!email || !password) {
      return showMessage("⚠️ Please enter both email and password to register.", "error");
    }

    if (password.length < 6) {
      return showMessage("⚠️ Password must be at least 6 characters.", "error");
    }

    try {
      registerForm.querySelector("button").disabled = true;
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage("✅ Registration successful! You can now log in.", "success");

      registerForm.reset();
      if (loginForm && registerForm) {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
      }

    } catch (error) {
      console.error("Registration Error:", error.message);
      showMessage(`❌ Registration failed: ${error.message}`, "error");
    } finally {
      registerForm.querySelector("button").disabled = false;
    }
  });
}
