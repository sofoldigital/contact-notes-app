export const getContacts = (state, getters, rootState) => {
  const contacts = state.contacts;
  const newContacts = [];
  contacts.forEach((contact) => {
    const contactHistory = [];
    rootState.interactions.interactions.filter((x) => {
      if (x.contact === contact.id) {
        contactHistory.push(x);
      }
    });
    const updatedContact = { ...contact, contactHistory };
    newContacts.push(updatedContact);
  });
  return newContacts;
};

export const getPermissionContacts = (state, getters, rootState) => {
  const profile = rootState.users.profile;
  let permissionContacts = [];
  const allContacts = state.contacts;
  const recentContacts = state.recentContacts;
  const assignedContacts = state.assignedContacts;
  const pendingContacts = state.pendingContacts;

  if (profile.admin) {
    permissionContacts = allContacts;
  } else {
    if (profile.viewRecent) {
      permissionContacts = [...permissionContacts, ...recentContacts];
    }
    if (profile.viewAssigned) {
      permissionContacts = [...permissionContacts, ...assignedContacts];
    }
    if (profile.viewPending) {
      permissionContacts = [...permissionContacts, ...pendingContacts];
    }
  }

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const contacts = getUniqueListBy(permissionContacts, "id");
  const newContacts = [];
  contacts.forEach((contact) => {
    const contactHistory = [];
    rootState.interactions.interactions.filter((x) => {
      if (x.contact === contact.id) {
        contactHistory.push(x);
      }
    });
    const updatedContact = { ...contact, contactHistory };
    newContacts.push(updatedContact);
  });
  return newContacts;
};
