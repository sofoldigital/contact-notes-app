export function setInteractions(state, payload) {
  state.interactions = payload;
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
  state.loading = false;
  state.unsubscribe = null;
}
