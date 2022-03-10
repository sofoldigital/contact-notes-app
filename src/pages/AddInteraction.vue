<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 70%; width: 350px">
      <q-card-section class="text-h6 text-white text-center bg-primary">
        Add Interaction
      </q-card-section>
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

export default defineComponent({
  name: "AddInteraction",
  components: {
    InteractionForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const contact = computed(() =>
      $store.state.contacts.contacts.find(
        (c) => c.id === $router.currentRoute.value.params.id
      )
    );
    const uid = computed(() => $store.state.users.user.uid);
    const profile = computed(() =>
      $store.state.users.profiles.find((p) => p.id === uid.value)
    );
    const loading = ref(false);
    const addInteraction = async (ev) => {
      loading.value = true;
      const { interaction } = ev;
      const currentDate = new Date().toISOString();
      console.log("current date = ", currentDate);
      const actioned = interaction.actioned;
      interaction.contactDate = currentDate;
      interaction.dateActioned = actioned ? currentDate : "";
      interaction.actionedBy = actioned ? profile.value.id : "";
      interaction.contact = contact.value.id;
      const response = await $store.dispatch(
        "interactions/addInteraction",
        interaction
      );
      if (!response.error) {
        $router.push({ name: "Home", query: { phone: contact.value.phone } });
      } else {
        console.log("error ", response.error);
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
    };
  },
});
</script>
