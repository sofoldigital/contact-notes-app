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

export async function createContact({ commit, state }, contact) {
  try {
    const response = await db.collection("contacts").add(contact);
    return { error: null, contact: response.id };
  } catch (err) {
    return { error: err.message };
  }
}

export async function editContact({ commit, state }, payload) {
  const { contact, id } = payload;
  try {
    await db.collection("contacts").doc(id).update(contact, { merge: true });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteContact({ commit, state }, payload) {
  const { interactions, id } = payload;
  try {
    console.log("interactions =", interactions, id);
    interactions.forEach((interaction) => {
      db.collection("interactions").doc(interaction.id).delete();
    });
    await db.collection("contacts").doc(id).delete();
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
