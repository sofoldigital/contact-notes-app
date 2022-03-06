<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Contact Notes App </q-toolbar-title>
        <div class="text-right" v-if="user">
          Logged in as: <br />{{ user.email }}
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
    const user = computed(() => $store.state.users.user);

    const logOut = async () => {
      await $store.dispatch("users/logUserOut");
      $router.replace({ name: "Login" });
    };
    return {
      user,
      logOut,
    };
  },
});
</script>
