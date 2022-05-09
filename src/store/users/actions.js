import { auth, db, functions } from "src/boot/firebase";

export async function logUserOut({ rootState, state, commit }, payload) {
  return auth
    .signOut()
    .then(() => {
      commit("setUser", null);
      return { error: null, user: null };
    })
    .catch((error) => {
      return { error: error.message, user: null };
    });
}

export function logUserIn(context, payload) {
  const { email, password } = payload;
  return auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return { error: null, user };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      return { error: errorMessage, user: null };
    });
}

export async function fetchProfiles({ commit, state }) {
  // if function is called with an existing hook unsubscribe from the listener
  if (state.unsubscribe !== null) state.unsubscribe();
  commit("setUnsubscribe", null);

  const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
    const profiles = [];
    const activeProfiles = [];
    snapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
      if (!doc.data().disabled) {
        activeProfiles.push({ id: doc.id, ...doc.data() });
      }
    });
    const profile = profiles.find((u) => state.user.uid === u.id);
    commit("setProfiles", profiles);
    commit("setActiveProfiles", activeProfiles);
    commit("setProfile", profile);
    commit("setLoading", false);
  });
  commit("setUnsubscribe", unsubscribe);
}

export async function updateDisplayName({ state }, displayName) {
  const uid = state.user.uid;
  return db.collection("users").doc(uid).set({ displayName }, { merge: true });
}

export async function sendResetEmail({ state }, email) {
  var actionCodeSettings = {
    // After password reset, the user will be give the ability to go back
    // to this page.
    url: process.env.redirectUrl,
    handleCodeInApp: false,
  };
  return auth
    .sendPasswordResetEmail(email, actionCodeSettings)
    .then(function () {
      console.log("email sent");
      return { success: true };
    })
    .catch(function (error) {
      console.log("email not sent");
      return { success: false, error };
    });
}

export async function createUser({ state }, profile) {
  const addUser = functions.httpsCallable("addUser");
  const response = await addUser(profile);
  return response;
}

export async function removeUser({ state }, payload) {
  const { uid, profile } = payload;
  const remove = functions.httpsCallable("removeUser");
  const response = await remove({ uid, profile });
  return response;
}

export async function updateEmail({ state }) {
  if (state.user) {
    const uid = state.user.uid;
    const email = state.user.email;
    return db.collection("users").doc(uid).set({ email }, { merge: true });
  }
}

export async function updateProfileImageUrl({ state }, payload) {
  const { id, imageUrl } = payload;
  return db.collection("users").doc(id).set({ imageUrl }, { merge: true });
}

export async function updatePermissions({ state }, payload) {
  const { id, profile } = payload;
  try {
    await db.collection("users").doc(id).set(profile, { merge: true });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
