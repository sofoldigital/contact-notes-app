<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar v-if="isHomeView">
        <q-toolbar-title> Contacts </q-toolbar-title>
        <div class="text-right" v-if="profile && !$q.screen.lt.sm">
          Logged in as {{ profile.displayName }}
        </div>
        <q-btn class="q-ml-md" flat @click="logOut" color="white"
          >Logout <q-icon class="q-ml-sm" name="exit_to_app"></q-icon
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-3" v-if="loaded">
      <router-view />
    </q-page-container>
    <q-inner-loading
      v-else
      :showing="!loaded"
      label-class="text-teal"
      label-style="font-size: 1.1em"
    >
      <q-spinner-gears size="50px" color="primary" />
      <p class="text-black q-mt-sm">Loading Data...</p>
    </q-inner-loading>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const $store = useStore();
    const $router = useRouter();
    const profile = computed(() => {
      const profile = $store.state.users.profiles.find((profile) => {
        return profile.id === $store.state.users.user.uid;
      });
      return profile;
    });

    $store.commit("contacts/setLoading", true);
    $store.commit("users/setLoading", true);
    $store.commit("interactions/setLoading", true);
    $store.dispatch("contacts/fetchContacts");
    $store.dispatch("users/fetchProfiles");
    $store.dispatch("interactions/fetchInteractions");

    const contactsLoading = computed(() => $store.state.contacts.loading);
    const interactionsLoading = computed(
      () => $store.state.interactions.loading
    );
    const usersLoading = computed(() => $store.state.users.loading);

    const loaded = computed(
      () =>
        !usersLoading.value &&
        !contactsLoading.value &&
        !interactionsLoading.value
    );

    const logOut = async () => {
      $store.commit("contacts/unsubscribeContacts");
      $store.commit("users/unsubscribeUsers");
      $store.commit("interactions/unsubscribeInteractions");
      await $store.dispatch("users/logUserOut");
      $router.replace({ name: "Login" });
    };
    const isHomeView = computed(() => {
      return $router.currentRoute.value.name === "Home";
    });
    return {
      profile,
      logOut,
      isHomeView,
      loaded,
    };
  },
});
</script>
