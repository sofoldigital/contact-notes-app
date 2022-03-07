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
