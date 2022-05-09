<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 300px">
      <q-card-section class="text-h6 text-white text-center bg-primary"
        >User Login</q-card-section
      >
      <q-card-section>
        <login-form></login-form>
        <q-btn class="full-width q-mt-lg" flat @click="resetDialog = true"
          >Reset password</q-btn
        >
        <q-dialog v-model="resetDialog">
          <q-card style="width: 90%">
            <q-form ref="form" @submit.prevent="sendResetEmail">
              <q-card-section class="text-h6 text-center text-white bg-primary">
                Forgot Password
              </q-card-section>
              <q-card-section>
                Enter your email below and we will send you a link to reset your
                password.
                <q-input
                  class="bg-white q-mt-md"
                  label="Email"
                  outlined
                  v-model="email"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Required Field',
                    (val) => validEmail || 'Enter a Valid email',
                  ]"
                >
                  <template v-slot:prepend
                    ><q-icon name="email"></q-icon
                  ></template>
                </q-input>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="CLOSE" color="negative" v-close-popup />
                <q-btn color="primary" type="submit" :loading="loading"
                  >Send Email</q-btn
                >
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import LoginForm from "../components/LoginForm.vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageIndex",
  components: {
    LoginForm,
  },
  setup() {
    const resetDialog = ref(false);
    const $store = useStore();
    const $q = useQuasar();
    const email = ref("");
    const loading = ref(false);
    const sendResetEmail = async () => {
      loading.value = true;
      const resp = await $store.dispatch("users/sendResetEmail", email.value);
      if (resp.success) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "email",
          message: `An email has been sent to ${email.value} with a link to reset your password.`,
        });
        resetDialog.value = false;
        loading.value = false;
      } else {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "warning",
          message: `${resp.error.message}`,
        });
        loading.value = false;
      }
    };
    const validEmail = computed(() => {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (regex.test(email.value)) {
        return true;
      } else {
        return false;
      }
    });
    return {
      resetDialog,
      validEmail,
      loading,
      sendResetEmail,
      email,
    };
  },
});
</script>
