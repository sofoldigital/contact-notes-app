<template>
  <q-page padding>
    <!-- PHONE NUMBER SEARCH -->
    <div class="row justify-around q-gutter-sm">
      <div class="col-12 col-sm-5">
        <q-input
          v-model="phone"
          label="Phone Search"
          style="width: 250px; max-width: 95%"
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
      </div>
      <div class="col-12 col-sm-5">
        <q-input
          v-model="textSearch"
          label="Message Search"
          style="width: 250px; max-width: 95%"
          class="q-mx-auto q-mb-md"
          maxlength="30"
        >
          <template v-slot:prepend>
            <q-icon name="sms" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="textSearch !== ''"
              name="close"
              @click="textSearch = ''"
              class="cursor-pointer"
            />
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <div v-if="filteredContacts.length > 0" class="full-width q-mt-none">
      <ContactExpansion
        v-for="contact in filteredContacts"
        :key="contact.id"
        v-bind="contact"
        :textSearch="textSearch"
        :phoneSearch="phone"
      ></ContactExpansion>
    </div>
    <div v-if="filteredContacts.length == 0" class="text-center">
      Contact does not exist...
    </div>
    <div class="text-center q-mt-md">
      <q-btn
        color="primary"
        @click="$router.push({ name: 'Add Contact', query: { phone: phone } })"
        >Create New Contact</q-btn
      >
    </div>
  </q-page>
  <q-page-sticky position="bottom-right" :offset="[10, 10]">
    <q-btn color="primary" round icon="download" @click="exportData"></q-btn>
  </q-page-sticky>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import ContactExpansion from "../components/ContactExpansion.vue";

import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageIndex",
  components: {
    ContactExpansion,
  },
  setup() {
    const $store = useStore();

    const $router = useRouter();

    const phone = ref("");

    const textSearch = ref("");

    if ($router.currentRoute.value.query.phone) {
      phone.value = $router.currentRoute.value.query.phone;
    }

    const interactions = computed(() => $store.state.interactions.interactions);

    const contacts = computed(() => {
      return $store.getters["contacts/getContacts"];
    });

    const interactionsWithSearchText = computed(() => {
      const searchValue = textSearch.value;
      const regexp = new RegExp(searchValue, "i");
      const validContacts = [];
      if (searchValue) {
        $store.state.interactions.interactions.filter((x) => {
          if (regexp.test(x.message)) {
            validContacts.push(x.contact);
          }
        });
        return validContacts;
      } else {
        $store.state.contacts.contacts.forEach((c) => validContacts.push(c.id));
        return validContacts;
      }
    });

    const filteredContacts = computed(() => {
      const searchValue = phone.value;
      const regexp = new RegExp(searchValue, "i");
      let filteredResults = contacts.value.filter((x) => {
        if (interactionsWithSearchText.value.some((id) => id === x.id)) {
          return regexp.test(x.phone);
        }
      });
      return filteredResults;
    });
    const exportData = () => {
      const filename = "data.json";
      const jsonStr = JSON.stringify(filteredContacts.value, null, 4);
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    return {
      textSearch,
      exportData,
      phone,
      filteredContacts,
    };
  },
});
</script>
