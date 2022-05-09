export function setAllContacts(state, payload) {
  state.contacts = payload;
}

export function setRecentContacts(state, payload) {
  state.recentContacts = payload;
}

export function setAssignedContacts(state, payload) {
  state.assignedContacts = payload;
}

export function setPendingContacts(state, payload) {
  state.pendingContacts = payload;
}

export function setLoading(state, payload) {
  state.loading = payload;
}

export function setUnsubscribe(state, payload) {
  state.unsubscribe = payload;
}

export function setUnsubscribeSettings(state, payload) {
  state.unsubscribeSettings = payload;
}

export function setRecentDays(state, payload) {
  state.recentDays = payload;
}

export function unsubscribeContacts(state, payload) {
  if (state.unsubscribe) {
    state.unsubscribe();
  }
  if (state.unsubscribeSettings) {
    state.unsubscribeSettings();
  }
  state.contacts = [];
  state.recentContacts = [];
  state.pendingContacts = [];
  state.assignedContacts = [];
  state.recentDays = 30;
  state.loading = false;
  state.unsubscribe = null;
  state.unsubscribeSettings;
}
