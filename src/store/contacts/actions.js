import { db } from "src/boot/firebase";

export async function fetchContacts({ commit, state }) {
  // if function is called with an existing hook unsubscribe from the listener
  if (state.unsubscribe !== null) state.unsubscribe();
  state.unsubscribe = null;

  const unsubscribe = db.collection("contacts").onSnapshot((snapshot) => {
    const contacts = [];
    snapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    commit("setContacts", contacts);
    commit("setLoading", false);
  });
  commit("setUnsubscribe", unsubscribe);
}
