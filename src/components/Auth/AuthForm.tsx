"use client";

import Modal from "@/components/Basic/Modal";
import Button from "@/components/Basic/Button";
import { useState } from "react";

import { PiSignIn } from "react-icons/pi";
import { CgUserAdd } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { LuLock } from "react-icons/lu";
import { FiUser } from "react-icons/fi";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/clientApp";
import { createUser } from "@/services/userService";

export default function AuthForm({
  isOpen,
  onClose,
}: Readonly<{ isOpen: boolean; onClose: () => void }>) {
  type AuthType = "sign-in" | "sign-up";

  const [authMode, setAuthMode] = useState<AuthType>("sign-in");

  const buttons = [
    {
      msg: "Sign In",
      mode: "sign-in",
      icon: <PiSignIn />,
      toggleMode: () => setAuthMode("sign-in"),
    },
    {
      msg: "Sign Up",
      mode: "sign-up",
      icon: <CgUserAdd />,
      toggleMode: () => setAuthMode("sign-up"),
    },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear previous errors
    setAuthError(null);

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      // Success, clear states, store automatically updates via listener
      setLoading(false);
      handleClose();
    } catch (error: unknown) {
      setLoading(false);
      // 2. Handle errors (e.g., user not found, wrong password)
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? (error as { code: string }).code
          : "";
      const friendlyMessage = errorCode.includes("wrong-password")
        ? "Invalid password. Please try again."
        : errorCode.includes("user-not-found")
          ? "No user found with this email."
          : "Login failed. Please check your credentials.";

      setAuthError(friendlyMessage);
      console.error("Email/Password Sign-In Failed:", error);
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      setLoading(true);
      // Create the user account in Firebase Auth
      const trimmedFullName = fullName.trim();
      const fallbackFullName = trimmedFullName || email.split("@")[0] || "User";
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the displayName in Firebase Auth so the listener can use it
      // This ensures the fullName from the form is available when creating the backend record
      if (trimmedFullName) {
        await updateProfile(user, {
          displayName: trimmedFullName,
        });
      }

      try {
        const token = await user.getIdToken();
        await createUser({ fullName: trimmedFullName || fallbackFullName, photo: null }, token);
      } catch (backendError) {
        console.error("Failed to create user in backend after sign-up:", backendError);
        // Listener will retry via ensureUserInBackend
      }

      // Success, clear states and close modal
      setLoading(false);
      handleClose();
    } catch (error: unknown) {
      setLoading(false);
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? (error as { code: string }).code
          : "";
      const friendlyMessage = errorCode.includes("weak-password")
        ? "Password should be at least 6 characters."
        : errorCode.includes("email-already-in-use")
          ? "This email address is already registered."
          : "Registration failed. Please check the details.";

      setAuthError(friendlyMessage);
      console.error("Email/Password Sign-Up Failed:", error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      setLoading(false);
      handleClose();
    } catch (error: unknown) {
      setLoading(false);
      // Handle Errors here. For example:
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? (error as { code: string }).code
          : undefined;
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Unknown error";
      console.error("Google Sign-In Failed:", errorMessage);

      // Common error: User closes the popup (error.code will be 'auth/popup-closed-by-user')
      if (errorCode === "auth/popup-closed-by-user") {
        alert("Sign-in process cancelled.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
    setEmail("");
    setPassword("");
    setFullName("");
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h1 className="text-lg font-bold text-[var(--text)]">Welcome to Tubilletera</h1>
      <p className="text-sm text-[var(--secondary-muted)] mb-4">
        Sign in to your account or create a new one to get started
      </p>
      <div className="flex flex-row rounded-full w-full bg-[var(--muted)] mb-2">
        {buttons.map((button) => (
          <button
            className={`flex flex-row w-1/2 cursor-pointer py-1.5 gap-2 items-center justify-center font-semibold text-sm ${button.mode === authMode ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
            key={button.msg}
            onClick={button.toggleMode}
          >
            {button.icon} {button.msg}
          </button>
        ))}
      </div>
      <form onSubmit={authMode === "sign-in" ? signIn : signUp}>
        {authError && (
          <div className="p-2 w-full bg-[var(--error)] rounded-md my-3">
            <p className="text-sm font-semibold text-white">{authError}</p>
          </div>
        )}
        {authMode === "sign-up" && (
          <div>
            <label className="font-semibold text-sm" htmlFor="fullName">
              Full Name
            </label>
            <div className="flex flex-row gap-3 items-center bg-[var(--input-bg)] px-3 py-1 mb-2 rounded-lg border border-transparent focus-within:border-[var(--muted-foreground)]">
              <FiUser className="text-[var(--muted-foreground)]" size={16} />
              <input
                className="outline-none w-full"
                type="text"
                value={fullName}
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
        )}
        <div>
          <label className="font-semibold text-sm" htmlFor="email">
            Email
          </label>
          <div className="flex flex-row gap-3 items-center bg-[var(--input-bg)] px-3 py-1 mb-2 rounded-lg border border-transparent focus-within:border-[var(--muted-foreground)]">
            <MdOutlineEmail className="text-[var(--muted-foreground)]" size={16} />
            <input
              className="outline-none w-full"
              type="email"
              value={email}
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <label className="font-semibold text-sm" htmlFor="password">
            Password
          </label>
          <div className="flex flex-row gap-3 items-center bg-[var(--input-bg)] px-3 py-1 mb-2 rounded-lg border border-transparent focus-within:border-[var(--muted-foreground)]">
            <LuLock className="text-[var(--muted-foreground)]" size={16} />
            <input
              className="outline-none w-full"
              type="password"
              value={password}
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full px-3 py-2 text-center font-semibold mt-4"
            variant="primary"
            loading={loading}
            type="submit"
          >
            {authMode === "sign-up" ? "Create account" : "Sign In"}
          </Button>
        </div>
      </form>
      {authMode === "sign-in" && (
        <div>
          <div className="flex flex-row items-center justify-center my-4">
            <hr className="w-full border-0 h-[1px] bg-[var(--border)]" />
            <p className="w-full whitespace-nowrap px-3 text-xs text-[var(--muted-foreground)] font-semibold">
              OR CONTINUE WITH
            </p>
            <hr className="w-full border-0 h-[1px] bg-[var(--border)]" />
          </div>
          <Button
            className="w-full px-3 py-2 text-center font-semibold mt-4"
            variant="secondary"
            onClick={signInWithGoogle}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            Sign in with Google
          </Button>
        </div>
      )}
    </Modal>
  );
}
