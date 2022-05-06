<template>
  <q-page padding>
    <!-- <q-page-sticky
      style="z-index: 3000"
      position="top-right"
      :offset="[10, -30]"
    >
      <q-fab
        label="New Contact"
        label-position="left"
        icon="add"
        color="white"
        text-color="primary"
        @click="$router.push({ name: 'Add Contact', query: { phone: phone } })"
      />
    </q-page-sticky> -->
    <!-- PHONE NUMBER SEARCH -->
    <div class="row justify-around q-gutter-sm">
      <div class="col-12 col-md-2">
        <q-select
          v-model="sortContacts"
          style="width: 200px; max-width: 95%"
          class="q-mx-auto q-mb-md"
          :options="['Recent Updates', 'Oldest', 'Pending', 'Urgent']"
          label="Sort by"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="phone"
          label="Phone"
          style="width: 250px; max-width: 95%"
          class="q-mx-auto q-mb-md"
          maxlength="15"
          type="number"
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
      <div class="col-12 col-md-3">
        <q-input
          v-model="textSearch"
          label="Search"
          style="width: 250px; max-width: 95%"
          class="q-mx-auto q-mb-md"
          maxlength="30"
        >
          <template v-slot:prepend>
            <q-icon name="notes" />
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
      <div class="col-12 col-md-3">
        <q-select
          clearable
          style="width: 250px; max-width: 95%"
          class="q-mx-auto q-mb-md"
          v-model="assigneeSearch"
          :options="userOptions"
          label="Assignee"
        >
          <template v-slot:prepend>
            <q-icon name="person_search" @click.stop />
          </template>
        </q-select>
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
      No contacts found...
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
    console.log("setup", $store.state.contacts);

    const phone = ref("");
    const assigneeSearch = ref(null);

    const sortContacts = ref("Recent Updates");

    const textSearch = ref("");

    const userOptions = computed(() => {
      const users = $store.state.users.profiles;
      const transformedUsers = [
        {
          label: "Unassigned",
          value: "",
        },
      ];
      users.forEach((user) => {
        transformedUsers.push({
          label: user.displayName,
          value: user.id,
        });
      });
      return transformedUsers;
    });

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
        $store.state.interactions.interactions.forEach((x) => {
          if (regexp.test(x.message)) {
            validContacts.push(x.contact);
          }
        });
        contacts.value.forEach((c) => {
          if (regexp.test(c.contactName)) {
            validContacts.push(c.id);
          }
        });
        return validContacts;
      } else {
        $store.state.contacts.contacts.forEach((c) => validContacts.push(c.id));
        return validContacts;
      }
    });

    const contactsWithAssignee = computed(() => {
      const searchValue = assigneeSearch.value;
      const validContacts = [];
      if (searchValue) {
        $store.state.contacts.contacts.forEach((x) => {
          if (x.assignee) {
            console.log("search value.value", searchValue.value);
            if (x.assignee == searchValue.value) {
              validContacts.push(x.id);
            }
          } else {
            if (searchValue.value === "") {
              validContacts.push(x.id);
            }
          }
        });
        console.log("valid contacts = ", validContacts);
        return validContacts;
      } else {
        $store.state.contacts.contacts.forEach((c) => validContacts.push(c.id));
        return validContacts;
      }
    });

    const filteredContacts = computed(() => {
      const sortedContacts = [...contactSorted.value];
      contacts.value.forEach((o) => {
        if (!sortedContacts.includes(o.id)) sortedContacts.push(o.id);
      });
      let result = [...contacts.value].sort((a, b) => {
        return sortedContacts.indexOf(a.id) - sortedContacts.indexOf(b.id);
      });
      const searchValue = phone.value;
      const regexp = new RegExp(searchValue, "i");
      let filteredResults = result.sort().filter((x) => {
        if (
          interactionsWithSearchText.value.some((id) => id === x.id) &&
          contactsWithAssignee.value.some((id) => id === x.id)
        ) {
          return regexp.test(x.phone);
        }
      });
      return filteredResults;
    });

    const contactSorted = computed(() => {
      const ints = [...interactions.value];
      if (sortContacts.value == "Pending") {
        const contactList = [];
        // SORT BASED ON PENDING
        const map = ints.reduce(function (p, c) {
          if (c.status == "Pending") {
            p[c.contact] = (p[c.contact] || 0) + 1;
          }
          return p;
        }, {});
        var array = [];
        for (var a in map) {
          array.push({ k: a, count: map[a] });
        }
        array
          .sort(function (a, b) {
            return b.count - a.count;
          })
          .map((a) => contactList.push(a.k));
        console.log("array sorted = ", array);
        return contactList;
      } else if (sortContacts.value == "Oldest") {
        const contactList = [];
        const sortedContacts = [...contacts.value].sort(function (a, b) {
          return new Date(a.lastUpdate) - new Date(b.lastUpdate);
        });

        sortedContacts.map((c) => contactList.push(c.id));
        return contactList;
      } else if (sortContacts.value == "Urgent") {
        const contactList = [];
        // SORT BASED ON URGENT
        const map = ints.reduce(function (p, c) {
          if (c.status == "Urgent") {
            p[c.contact] = (p[c.contact] || 0) + 1;
          }
          return p;
        }, {});
        var array = [];
        for (var a in map) {
          array.push({ k: a, count: map[a] });
        }
        array
          .sort(function (a, b) {
            return b.count - a.count;
          })
          .map((a) => contactList.push(a.k));
        console.log("array sorted = ", array);
        return contactList;
      } else {
        // Default latest update first
        const contactList = [];
        const sortedContacts = [...contacts.value].sort(function (a, b) {
          return new Date(b.lastUpdate) - new Date(a.lastUpdate);
        });

        sortedContacts.map((c) => contactList.push(c.id));
        return contactList;
      }
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
      userOptions,
      assigneeSearch,
      sortContacts,
      contactsWithAssignee,
      phone,
      filteredContacts,
    };
  },
});
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
