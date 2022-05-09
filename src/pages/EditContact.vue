<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 50%; width: 350px">
      <q-card-section class="text-h6 text-white bg-primary">
        <q-item>
          <q-item-section> Update Contact </q-item-section>
          <q-item-section side
            ><q-btn
              round
              v-if="profile.deleteAccess"
              color="negative"
              icon="delete"
              @click="confirm = true"
              :loading="deleteLoading"
            ></q-btn
          ></q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section>
        <UpdateContact
          @onSubmit="createContact"
          :loading="loading"
          :originalPhone="originalContact.phone"
          :originalName="originalContact.contactName"
          :originalFax="originalContact.fax"
          :originalAssignee="
            typeof originalContact.assignee === 'undefined'
              ? ''
              : originalContact.assignee
          "
          :originalEmail="originalContact.email"
          :originalImageUrl="originalContact.imageUrl"
          :originalNotes="
            typeof originalContact.notes === 'undefined'
              ? ''
              : originalContact.notes
          "
          :originalRedFlag="
            typeof originalContact.redFlag === 'undefined'
              ? false
              : originalContact.redFlag
          "
          :id="originalContact.id"
        ></UpdateContact>
        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-card-section>
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-avatar
                    icon="warning"
                    color="negative"
                    text-color="white"
                  />
                </q-item-section>
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
import UpdateContact from "../components/UpdateContact";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CreateContact",
  components: {
    UpdateContact,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const originalContact = {
      ...$store.state.contacts.contacts.find(
        (i) => i.id === $router.currentRoute.value.params.id
      ),
    };
    const profile = computed(() => $store.state.users.profile);
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
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: `Contact Updated`,
        });
        $router.push({ name: "Home" });
      } else {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: response.error,
        });
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

      const response = await $store.dispatch("contacts/deleteContact", payload);
      if (!response.error) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: "Contact Deleted",
        });
        $router.push({ name: "Home" });
      } else {
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: response.error,
        });
      }
      deleteLoading.value = false;
    };
    return {
      createContact,
      loading,
      deleteLoading,
      profile,
      originalContact,
      deleteContact,
      confirm,
    };
  },
});
</script>
