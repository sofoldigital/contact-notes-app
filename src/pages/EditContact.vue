<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 50%; width: 350px">
      <q-card-section class="text-h6 text-white text-center bg-primary">
        Update Contact Details
      </q-card-section>
      <q-card-section>
        <ContactForm
          @onSubmit="createContact"
          :loading="loading"
          :originalPhone="originalContact.phone"
          :originalName="originalContact.contactName"
          :originalFax="originalContact.fax"
          :originalEmail="originalContact.email"
          :id="originalContact.id"
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

export default defineComponent({
  name: "CreateContact",
  components: {
    ContactForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const originalContact = {
      ...$store.state.contacts.contacts.find(
        (i) => i.id === $router.currentRoute.value.params.id
      ),
    };
    const loading = ref(false);
    const createContact = async (ev) => {
      loading.value = true;
      const { contact } = ev;
      const currentDate = Date.now();
      contact.lastUpdate = currentDate;
      const response = await $store.dispatch("contacts/editContact", {
        contact,
        id: $router.currentRoute.value.params.id,
      });
      if (!response.error) {
        $router.push({ name: "Home", query: { phone: contact.phone } });
      } else {
        console.log("error ", response.error);
      }
      loading.value = false;
    };
    return {
      createContact,
      loading,
      originalContact,
    };
  },
});
</script>
