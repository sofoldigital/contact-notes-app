import { db } from "src/boot/firebase";

export async function fetchInteractions({ commit, state, rootState }) {
  // if function is called with an existing hook unsubscribe from the listener
  if (state.unsubscribe !== null) state.unsubscribe();
  commit("setUnsubscribe", null);

  const unsubscribe = db
    .collection("interactions")
    .orderBy("contactDate", "desc")
    .onSnapshot((snapshot) => {
      const interactions = [];
      const contactsWithPendingInteractions = [];
      snapshot.forEach((doc) => {
        const interaction = { id: doc.id, ...doc.data() };
        interactions.push(interaction);
        if (!interaction.actioned && interaction.status != "Reach Out") {
          contactsWithPendingInteractions.push(interaction.contact);
        }
      });
      commit("setInteractions", interactions);
      commit("setPendingContacts", contactsWithPendingInteractions);
      commit("setLoading", false);
    });
  commit("setUnsubscribe", unsubscribe);
}

export async function addInteraction({ commit, state }, interaction) {
  const currentDate = new Date().toISOString();
  try {
    await db.collection("interactions").add(interaction);
    await db
      .collection("contacts")
      .doc(interaction.contact)
      .update({ lastUpdate: currentDate }, { merge: true });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function editInteraction({ commit, state }, payload) {
  const { interaction, id } = payload;
  const currentDate = new Date().toISOString();
  try {
    await db
      .collection("interactions")
      .doc(id)
      .update(interaction, { merge: true });
    await db
      .collection("contacts")
      .doc(interaction.contact)
      .update({ lastUpdate: currentDate }, { merge: true });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteInteraction({ commit, state }, id) {
  try {
    await db.collection("interactions").doc(id).delete();
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
