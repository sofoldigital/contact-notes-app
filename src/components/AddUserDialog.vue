<template>
  <q-btn icon="add" @click="dialog = true" color="primary">Add User</q-btn>
  <q-dialog v-model="dialog">
    <q-card style="width: 90%">
      <q-form ref="form" @submit.prevent="addUser">
        <q-card-section class="text-h6 text-center text-white bg-primary">
          Add New User
        </q-card-section>
        <q-card-section>
          Enter the users details below and they will be emailed a link to set
          their password.
        </q-card-section>
        <q-card-section>
          <q-input
            class="bg-white q-mt-md"
            label="Email"
            outlined
            v-model="email"
            :rules="[
              (val) => (val && val.length > 0) || 'Required Field',
              (val) => validEmail || 'Enter a Valid email',
              () => !emailExists || 'User email already exists',
            ]"
          >
            <template v-slot:prepend><q-icon name="email"></q-icon></template>
          </q-input>
          <q-input
            class="bg-white"
            label="Display Name"
            outlined
            :rules="[(val) => (val && val.length > 0) || 'Required Field']"
            v-model="displayName"
          >
            <template v-slot:prepend><q-icon name="person"></q-icon></template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="CLOSE" color="negative" v-close-popup />
          <q-btn color="primary" type="submit" :loading="loading"
            >Create Account</q-btn
          >
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

export default {
  setup(props, context) {
    const $q = useQuasar();
    const $store = useStore();
    const dialog = ref(false);
    const displayName = ref("");
    const loading = ref(false);
    const email = ref("");

    const addUser = async () => {
      loading.value = true;
      // const chars =
      //   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      // const string_length = 8;
      // const randomstring = "";
      // for (var i = 0; i < string_length; i++) {
      //   var rnum = Math.floor(Math.random() * chars.length);
      //   randomstring += chars.substring(rnum, rnum + 1);
      // }
      const profile = {
        displayName: displayName.value,
        email: email.value,
        imageUrl: "",
        admin: false,
        contactImages: false,
        deleteAccess: false,
        viewAssigned: false,
        viewRecent: false,
        viewPending: false,
        viewSpecific: false,
      };

      const response = await $store.dispatch("users/createUser", profile);
      const error = response.data.errorInfo;
      if (error) {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "warning",
          message: `${error.message}`,
        });
      } else {
        await $store.dispatch("users/sendResetEmail", profile.email);
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "email",
          message: `An email has been sent to ${response.data.email} for them to set their password and log in.`,
        });
        dialog.value = false;
      }
      loading.value = false;
    };

    const emailExists = computed(() =>
      $store.state.users.profiles.some((e) => {
        if (e.email) {
          return e.email === email.value;
        }
      })
    );

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
      dialog,
      emailExists,
      loading,
      addUser,
      displayName,
      validEmail,
      email,
    };
  },
};
</script>
