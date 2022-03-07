<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 300px">
      <q-card-section class="text-h6 text-white text-center bg-primary"
        >User Login</q-card-section
      >
      <q-card-section>
        <login-form></login-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import LoginForm from "../components/LoginForm.vue";

export default defineComponent({
  name: "PageIndex",
  components: {
    LoginForm,
  },
  setup() {},
});
</script>
