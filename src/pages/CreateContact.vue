<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 50%; width: 350px">
      <q-card-section class="text-h6 text-white text-center bg-primary">
        Create Contact
      </q-card-section>
      <q-card-section>
        <ContactForm
          @onSubmit="createContact"
          :loading="loading"
          :originalPhone="phone"
        ></ContactForm>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import ContactForm from "../components/ContactForm";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CreateContact",
  components: {
    ContactForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const phone = $router.currentRoute.value.query.phone || "";
    const loading = ref(false);
    const createContact = async (ev) => {
      loading.value = true;
      const { contact } = ev;
      const currentDate = new Date().toISOString();
      contact.lastUpdate = currentDate;
      contact.createdAt = currentDate;
      const response = await $store.dispatch("contacts/createContact", contact);
      if (!response.error) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: "Contact Created",
        });
        $router.push({ name: "Home" });
      } else {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: response.error,
        });
        console.log("error ", response.error);
      }
      loading.value = false;
    };
    return {
      createContact,
      loading,
      phone,
    };
  },
});
</script>
