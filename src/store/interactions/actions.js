import { db } from "src/boot/firebase";

export async function fetchInteractions({ commit, state }) {
  // if function is called with an existing hook unsubscribe from the listener
  if (state.unsubscribe !== null) state.unsubscribe();
  state.unsubscribe = null;

  const unsubscribe = db.collection("interactions").onSnapshot((snapshot) => {
    const interactions = [];
    snapshot.forEach((doc) => {
      interactions.push({ id: doc.id, ...doc.data() });
    });
    commit("setInteractions", interactions);
    commit("setLoading", false);
  });
  commit("setUnsubscribe", unsubscribe);
}

export async function addInteraction({ commit, state }, interaction) {
  try {
    await db.collection("interactions").add(interaction);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

export async function editInteraction({ commit, state }, payload) {
  const { interaction, id } = payload;
  try {
    await db
      .collection("interactions")
      .doc(id)
      .set(interaction, { merge: true });
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
