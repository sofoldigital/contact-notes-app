export function setUser(state, payload) {
  state.user = payload;
}

export function setProfiles(state, payload) {
  state.profiles = payload;
}

export function setActiveProfiles(state, payload) {
  state.activeProfiles = payload;
}

export function setProfile(state, payload) {
  state.profile = payload;
}

export function setLoading(state, payload) {
  state.loading = payload;
}

export function setUnsubscribe(state, payload) {
  state.unsubscribe = payload;
}

export function unsubscribeUsers(state, payload) {
  if (state.unsubscribe) {
    state.unsubscribe();
  }
  state.user = null;
  state.profiles = [];
  state.profile = null;
  state.loading = false;
  state.activeProfiles = [];
  state.unsubscribe = null;
}
