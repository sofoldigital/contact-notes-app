<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="email"
      label="Your email *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Password *"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Please type your password',
      ]"
    />

    <div class="row justify-center">
      <q-btn
        label="Login"
        class="full-width"
        type="submit"
        color="primary"
        :loading="loading"
      />
      <!-- <reset-password-dialog /> -->
    </div>
  </q-form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
// import ResetPasswordDialog from "./ResetPasswordDialog.vue";

export default {
  // components: { ResetPasswordDialog },
  setup() {
    const $router = useRouter();
    const $store = useStore();
    const email = ref("");
    const password = ref("");
    const $q = useQuasar();
    const loading = ref(false);
    const onSubmit = async () => {
      loading.value = true;
      const response = await $store.dispatch("users/logUserIn", {
        email: email.value,
        password: password.value,
      });
      if (!response.error) {
        loading.value = false;
        $router.push({ name: "Home" });
      } else {
        loading.value = false;
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: response.error,
        });
      }
    };

    return {
      email,
      password,
      loading,
      onSubmit,
    };
  },
};
</script>
