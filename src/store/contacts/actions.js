import { db } from "src/boot/firebase";

export async function fetchContacts({ commit, state, rootState }) {
  // if function is called with an existing hook unsubscribe from the listener
  if (state.unsubscribe !== null) state.unsubscribe();
  commit("setUnsubscribe", null);
  let recentDays = state.recentDays;
  const unsubscribe = db.collection("contacts").onSnapshot((snapshot) => {
    const contacts = [];
    const recentContacts = [];
    const assignedContacts = [];
    const pendingContacts = [];
    const thirtyDaysInMs = recentDays * 24 * 60 * 60 * 1000;
    const now = new Date();

    snapshot.forEach((doc) => {
      const c = { id: doc.id, ...doc.data() };
      contacts.push(c);

      if (c.assignee) {
        if (c.assignee === rootState.users.user.uid) {
          assignedContacts.push(c);
        }
      }
      if (c.lastUpdate) {
        const pastTime = new Date(c.lastUpdate);
        const timeDiffInMs = now.getTime() - pastTime.getTime();
        if (timeDiffInMs <= thirtyDaysInMs) {
          recentContacts.push(c);
        }
      }
      if (
        rootState.interactions.contactsWithPendingInteractions.some(
          (i) => i === c.id
        )
      ) {
        pendingContacts.push(c);
      }
    });
    commit("setAllContacts", contacts);
    commit("setAssignedContacts", assignedContacts);
    commit("setRecentContacts", recentContacts);
    commit("setRecentDays", recentDays);
    commit("setPendingContacts", pendingContacts);
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
    interactions.forEach((interaction) => {
      db.collection("interactions").doc(interaction.id).delete();
    });
    await db.collection("contacts").doc(id).delete();
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateRecentDays({ commit, state }, recentDays) {
  return db
    .collection("config")
    .doc("settings")
    .set({ recentDays }, { merge: true });
}

export async function fetchSettings({ dispatch, commit, state }) {
  // if function is called with an existing hook unsubscribe from the listener
  if (state.unsubscribeSettings !== null) state.unsubscribeSettings();
  commit("setUnsubscribeSettings", null);

  const unsubscribeSettings = db
    .collection("config")
    .doc("settings")
    .onSnapshot((docSnap) => {
      if (docSnap.exists) {
        commit("setRecentDays", docSnap.data().recentDays);
        dispatch("fetchContacts");
      } else {
        commit("setRecentDays", 30);
        db.collection("config").doc("settings").set({ recentDays: 30 });
        dispatch("fetchContacts");
      }
    });

  commit("setUnsubscribeSettings", unsubscribeSettings);
}
