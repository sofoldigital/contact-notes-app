import { auth, db } from "src/boot/firebase";

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
  state.unsubscribe = null;

  const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
    const profiles = [];
    snapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    commit("setProfiles", profiles);
    commit("setLoading", false);
  });
  commit("setUnsubscribe", unsubscribe);
}
