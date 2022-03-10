<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 50%; width: 350px">
      <q-card-section class="text-h6 text-white bg-primary">
        <q-item>
          <q-item-section> Update Contact </q-item-section>
          <q-item-section side
            ><q-btn
              round
              color="negative"
              icon="delete"
              @click="confirm = true"
              :loading="deleteLoading"
            ></q-btn
          ></q-item-section>
        </q-item>
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
        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-card-section>
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-avatar icon="warning" color="negative" text-color="white"
                /></q-item-section>
                <q-item-section>
                  <span class="q-ml-sm"
                    >Are you sure? Deleting this contact will remove any
                    interaction history also.</span
                  >
                </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                label="Confirm Delete"
                color="negative"
                :loading="deleteLoading"
                @click="deleteContact"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
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
    const confirm = ref(false);
    const loading = ref(false);
    const deleteLoading = ref(false);
    const createContact = async (ev) => {
      loading.value = true;
      const { contact } = ev;
      const currentDate = new Date().toISOString();
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

    const contactInteractions = computed(() => {
      return $store.state.interactions.interactions.filter(
        (interaction) =>
          interaction.contact === $router.currentRoute.value.params.id
      );
    });

    const deleteContact = async () => {
      deleteLoading.value = true;
      const payload = {
        id: $router.currentRoute.value.params.id,
        interactions: contactInteractions.value,
      };
      console.log("payload", payload);
      const response = await $store.dispatch("contacts/deleteContact", payload);
      if (!response.error) {
        $router.push({ name: "Home" });
      } else {
        console.log("error ", response.error);
      }
      deleteLoading.value = false;
    };
    return {
      createContact,
      loading,
      deleteLoading,
      originalContact,
      deleteContact,
      confirm,
    };
  },
});
</script>
