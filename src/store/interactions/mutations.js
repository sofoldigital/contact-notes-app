export function setInteractions(state, payload) {
  state.interactions = payload;
}

export function setPendingContacts(state, payload) {
  state.contactsWithPendingInteractions = payload;
}
export function setLoading(state, payload) {
  state.loading = payload;
}

export function setUnsubscribe(state, payload) {
  state.unsubscribe = payload;
}

export function unsubscribeInteractions(state, payload) {
  if (state.unsubscribe) {
    state.unsubscribe();
  }
  state.interactions = [];
  state.contactsWithPendingInteractions = [];
  state.loading = false;
  state.unsubscribe = null;
}
