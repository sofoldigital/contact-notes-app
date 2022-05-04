<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 70%; width: 350px">
      <q-card-section class="text-h6 text-white text-center bg-primary">
        Create Contact
      </q-card-section>
      <q-card-section>
        <AddContactForm
          @onSubmit="createContact"
          :loading="loading"
          :originalPhone="phone"
        ></AddContactForm>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import AddContactForm from "../components/AddContactForm";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "CreateContact",
  components: {
    AddContactForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const phone = $router.currentRoute.value.query.phone || "";
    const loading = ref(false);
    const uid = computed(() => $store.state.users.user.uid);
    const profile = computed(() =>
      $store.state.users.profiles.find((p) => p.id === uid.value)
    );
    const createContact = async (ev) => {
      loading.value = true;
      console.log("ev", ev);
      const { contact, interaction } = ev;
      const currentDate = new Date().toISOString();
      contact.lastUpdate = currentDate;
      contact.createdAt = currentDate;
      const response = await $store.dispatch("contacts/createContact", contact);
      let error = response.error;
      if (interaction && !error) {
        const currentDate = new Date().toISOString();
        const actioned = interaction.actioned;
        interaction.contactDate = currentDate;
        interaction.dateActioned = actioned ? currentDate : "";
        interaction.actionedBy = actioned ? profile.value.id : "";
        interaction.createdBy = profile.value.id;
        interaction.createdByName = profile.value.displayName;
        interaction.contact = response.contact;
        const intResponse = await $store.dispatch(
          "interactions/addInteraction",
          interaction
        );
        error = intResponse.error;
      }
      console.log("response = ", response);
      if (!error) {
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
          message: error,
        });
        console.log("error ", error);
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
