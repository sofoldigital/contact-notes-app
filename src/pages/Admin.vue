<template>
  <q-page padding v-if="profile">
    <q-list
      bordered
      class="bg-white q-mb-md q-mx-auto"
      style="max-width: 800px; width: 90%"
    >
      <q-item-label header>Application Settings</q-item-label>
      <q-separator></q-separator>
      <q-item>
        <q-item-section>
          <q-item-label>Recent Interaction timeframe </q-item-label>
          <q-item-label caption
            >If a contact or their interactions have been updated within this
            timeframe they will be visible to users with the "View recent
            contacts" permission.</q-item-label
          >
        </q-item-section>
        <q-item-section side>{{ recentDays }} day(s)</q-item-section>
        <q-item-section side v-if="profile.admin">
          <ChangeRecentDaysDialog :days="recentDays" />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="full-width q-mt-none" v-if="profiles">
      <q-list
        bordered
        class="bg-white q-mx-auto"
        style="max-width: 800px; width: 90%"
      >
        <q-item-label header>Users</q-item-label>
        <q-separator></q-separator>
        <ProfileExpansion
          v-for="profile in profiles"
          :key="profile.id"
          v-bind="profile"
        ></ProfileExpansion>
        <q-item class="q-py-md">
          <AddUserDialog />
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ProfileExpansion from "../components/ProfileExpansion.vue";
import ChangeRecentDaysDialog from "../components/ChangeRecentDaysDialog.vue";
import AddUserDialog from "../components/AddUserDialog.vue";

export default defineComponent({
  name: "UserManagement",
  components: {
    ProfileExpansion,
    AddUserDialog,
    ChangeRecentDaysDialog,
  },
  setup() {
    const $store = useStore();
    const profiles = computed(() => {
      return $store.state.users.activeProfiles;
    });
    const profile = computed(() => $store.state.users.profile);

    const $router = useRouter();
    const recentDays = computed(() => $store.state.contacts.recentDays);
    return {
      profiles,
      recentDays,
      profile,
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
