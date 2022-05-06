<template>
  <q-page padding> Profile Page for user: {{ profile }}</q-page>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ProfilePage",
  setup() {
    const $store = useStore();
    const user = computed(() => $store.state.users.user);
    const profile = computed(() => {
      return $store.state.users.profiles.find((p) => p.id === user.value.uid);
    });

    const $router = useRouter();

    return {
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
