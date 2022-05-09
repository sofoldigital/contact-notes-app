<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 70%; width: 350px">
      <q-card-section class="text-h6 text-white text-center bg-primary">
        Add Interaction
      </q-card-section>
      <q-item>
        <q-item-section top avatar>
          <q-avatar v-if="profile.contactImages && contact.imageUrl != ''">
            <img :src="contact.imageUrl" />
          </q-avatar>
          <q-avatar v-else icon="person" color="grey" class="text-white">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.contactName }}</q-item-label>
          <q-item-label caption>{{ contact.phone }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section>
        <InteractionForm
          @onSubmit="addInteraction"
          :loading="loading"
        ></InteractionForm>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import InteractionForm from "../components/InteractionForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AddInteraction",
  components: {
    InteractionForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const contact = computed(() =>
      $store.state.contacts.contacts.find(
        (c) => c.id === $router.currentRoute.value.params.id
      )
    );
    const profile = computed(() => $store.state.users.profile);
    const loading = ref(false);
    const addInteraction = async (ev) => {
      loading.value = true;
      const { interaction } = ev;
      const currentDate = new Date().toISOString();
      const actioned = interaction.actioned;
      interaction.contactDate = currentDate;
      interaction.dateActioned = actioned ? currentDate : "";
      interaction.actionedBy = actioned ? profile.value.id : "";
      interaction.createdBy = profile.value.id;
      interaction.createdByName = profile.value.displayName;
      interaction.contact = contact.value.id;
      const response = await $store.dispatch(
        "interactions/addInteraction",
        interaction
      );
      if (!response.error) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: "Interaction Added",
        });
        $router.push({ name: "Home" });
      } else {
        console.log("error ", response.error);
        $q.notify({
          color: "negative",
          textColor: "white",
          icon: "error",
          message: response.error,
        });
      }
      loading.value = false;
      // contact.lastUpdate = currentDate;
      // contact.createdAt = currentDate;
      // const response = await $store.dispatch("contacts/createContact", contact);
      // if (!response.error) {
      //   $router.push({ name: "Home", query: { phone: contact.phone } });
      // } else {
      //   console.log("error ", response.error);
      // }
      // loading.value = false;
    };
    return {
      addInteraction,
      loading,
      contact,
      profile,
    };
  },
});
</script>
