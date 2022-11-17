import { reactive } from "vue";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { createToast } from "mosha-vue-toastify";

import { firebaseApp } from "./firebase";
import router from "./router";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const state = reactive({
  authenticating: false,
  user: null,
});

const actions = {
  initializeAuthListener: () => {
    return new Promise(resolve => {
      onAuthStateChanged(auth, async user => {
        if (user) {
          const docRef = doc(db, "users", user.email);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) { // user not in db, reject login
            createToast("You are not authorized to access this application.", { type: "danger" });
            state.user = null;
            await actions.logout();
            return resolve(true);
          }

          const data = docSnap.data();
          state.user = { name: data.name, email: user.email, type: data.type, team: data.team };
          createToast(`Welcome back, ${data.name}!`, { type: "info" });
          router.push(`/${data.type}`);
        } else {
          state.user = null;
        }

        resolve(true);
      });
    });
  },
  loginG: async () => {
    try {
      state.authenticating = true;
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Error - actions.loginG", err);
      createToast("Error logging you in. Please try again shortly.", { type: "danger" });
    } finally {
      state.authenticating = false;
    }
  },
  loginEP: async () => {
    try {
      state.authenticating = true;
      await signInWithEmailAndPassword(auth, state.email, state.password);
    } catch (err) {
      console.error("Error - actions.loginEP", err);
      if (err.code == "auth/wrong-password" || err.code == "auth/user-not-found") {
        createToast("Incorrect email and/or password. Please try again.", { type: "danger" });
      } else {
        createToast("Error logging you in. Please try again shortly.", { type: "danger" });
      }
    } finally {
      state.authenticating = false;
    }
  },
  logout: async () => {
    try {
      state.authenticating = true;
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error - actions.logout", err);
      createToast("Error logging you out. Please try again shortly.", { type: "danger" });
    } finally {
      state.authenticating = false;
    }
  },
};

export default { state, actions };
