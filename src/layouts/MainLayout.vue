<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Contact Notes App </q-toolbar-title>
        <div class="text-right" v-if="profile && !$q.screen.lt.sm">
          Logged in as: <br />{{ profile.displayName }}
        </div>
        <q-btn
          icon="exit_to_app"
          class="q-ml-md"
          round
          flat
          @click="logOut"
          color="white"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
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

    const logOut = async () => {
      await $store.dispatch("users/logUserOut");
      $router.replace({ name: "Login" });
    };
    return {
      profile,
      logOut,
    };
  },
});
</script>
