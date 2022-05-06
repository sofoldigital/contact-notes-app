<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar v-if="showToolBar">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> {{ title }} </q-toolbar-title>
        <div class="text-right" v-if="profile && !$q.screen.lt.sm"></div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-if="showToolBar"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple :to="{ name: 'Home' }">
            <q-item-section avatar>
              <q-icon name="contacts" />
            </q-item-section>
            <q-item-section> Contacts </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="event" />
            </q-item-section>

            <q-item-section> Calendar </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'Profile' }">
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section> My Profile </q-item-section>
          </q-item>
          <q-item clickable v-ripple :to="{ name: 'Management' }">
            <q-item-section avatar>
              <q-icon name="manage_accounts" />
            </q-item-section>
            <q-item-section> User Management </q-item-section>
          </q-item>
        </q-list>
        <q-item clickable v-ripple class="q-mb-lg" @click="logOut">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section v-if="profile">
            Logout ({{ profile.displayName }}) <span v-if="profile"></span
          ></q-item-section>
        </q-item>
      </q-scroll-area>
    </q-drawer>
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
    const leftDrawerOpen = ref(false);
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
    const miniState = ref(true);
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
    const showToolBar = computed(() => {
      const name = $router.currentRoute.value.name;
      return name === "Home" || name === "Profile" || name === "Management";
    });

    const title = computed(() => {
      return $router.currentRoute.value.meta.title;
    });
    return {
      profile,
      title,
      logOut,
      showToolBar,
      miniState,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      loaded,
    };
  },
});
</script>
