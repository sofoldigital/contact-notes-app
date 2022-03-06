<template>
  <q-page padding>
    <!-- PHONE NUMBER SEARCH -->
    <q-input
      v-model="phone"
      label="Search Phone"
      flat
      style="width: 300px"
      class="q-mx-auto q-mb-md"
      maxlength="15"
    >
      <template v-slot:prepend>
        <q-icon name="phone" />
      </template>

      <template v-slot:append>
        <q-icon
          v-if="phone !== ''"
          name="close"
          @click="phone = ''"
          class="cursor-pointer"
        />
        <q-icon name="search" />
      </template>
    </q-input>
    <q-inner-loading
      :showing="loading"
      label-class="text-teal"
      label-style="font-size: 1.1em"
    >
      <q-spinner-gears size="50px" color="primary" />
      <p class="text-black q-mt-sm">Loading Contacts...</p>
    </q-inner-loading>
    <div
      v-if="!loading && filteredContacts.length > 0"
      class="full-width q-mt-none"
    >
      <ContactExpansion
        v-for="contact in filteredContacts"
        :key="contact.id"
        v-bind="contact"
      ></ContactExpansion>
    </div>
    <div v-if="filteredContacts.length == 0" class="text-center">
      Contact does not exist...
    </div>
    <div class="text-center q-mt-md">
      <q-btn color="primary">Create New Contact</q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import ContactExpansion from "../components/ContactExpansion.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    ContactExpansion,
  },
  setup() {
    const $store = useStore();
    const phone = ref("");
    $store.commit("contacts/setLoading", true);
    $store.dispatch("contacts/fetchContacts");
    const loading = computed(() => $store.state.contacts.loading);
    const contacts = computed(() => $store.state.contacts.contacts);
    const filteredContacts = computed(() => {
      const searchValue = phone.value;
      const searchLength = searchValue.length;
      const regexp = new RegExp(searchValue, "i");
      const filteredResults = contacts.value.filter((x) => regexp.test(x.id));
      return filteredResults;
    });
    return {
      loading,
      contacts,
      phone,
      filteredContacts,
    };
  },
});
</script>
