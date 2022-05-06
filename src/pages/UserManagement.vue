<template>
  <q-page padding>User Management Page</q-page>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "UserManagement",
  setup() {
    const $store = useStore();
    const user = computed(() => $store.state.users.user);
    const profiles = computed(() => {
      return $store.state.users.profiles;
    });

    const $router = useRouter();

    return {
      profiles,
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
