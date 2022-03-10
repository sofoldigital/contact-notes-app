export function setContacts(state, payload) {
  state.contacts = payload;
}

export function setLoading(state, payload) {
  state.loading = payload;
}

export function setUnsubscribe(state, payload) {
  state.unsubscribe = payload;
}

export function unsubscribeContacts(state, payload) {
  if (state.unsubscribe) {
    state.unsubscribe();
  }
  state.contacts = [];
  state.loading = false;
  state.unsubscribe = null;
}
