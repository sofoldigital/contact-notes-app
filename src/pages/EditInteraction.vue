<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 70%; width: 350px">
      <q-card-section class="text-h6 text-white text-center bg-primary">
        Update Interaction Details
      </q-card-section>
      <q-card-section v-if="originalInteraction">
        <InteractionForm
          @onSubmit="updateInteraction"
          :loading="loading"
          :originalType="originalInteraction.type"
          :originalActioned="originalInteraction.actioned"
          :originalMessage="originalInteraction.message"
          :originalActionTaken="originalInteraction.actionTaken"
          :id="originalInteraction.id"
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
  name: "EditInteraction",
  components: {
    InteractionForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const originalInteraction = {
      ...$store.state.interactions.interactions.find(
        (i) => i.id === $router.currentRoute.value.params.id
      ),
    };

    const contact = computed(() =>
      $store.state.contacts.contacts.find(
        (c) => c.id === $router.currentRoute.value.params.id
      )
    );

    const uid = computed(() => $store.state.users.user.uid);
    const loading = ref(false);
    const updateInteraction = async (ev) => {
      loading.value = true;
      const { interaction, contact } = ev;
      const currentDate = Date.now();
      const actioned = interaction.actioned;
      if (actioned !== originalInteraction.actioned) {
        if (actioned) {
          interaction.actionedBy = uid.value;
          interaction.dateActioned = currentDate;
        } else {
          interaction.actionedBy = "";
          interaction.actionTaken = "";
          interaction.dateActioned = "";
        }
      }
      const response = await $store.dispatch("interactions/editInteraction", {
        interaction,
        id: $router.currentRoute.value.params.id,
      });
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
      updateInteraction,
      loading,
      originalInteraction,
    };
  },
});
</script>
