<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width: 70%; width: 350px">
      <q-card-section class="text-h6 text-white bg-primary">
        <q-item>
          <q-item-section> Update Interaction </q-item-section>
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
      <q-item v-if="originalInteraction">
        <q-item-section top avatar>
          <q-avatar v-if="isAdmin && contact.imageUrl != ''">
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
      <q-card-section v-if="originalInteraction">
        <InteractionForm
          @onSubmit="updateInteraction"
          :loading="loading"
          :originalType="originalInteraction.type"
          :originalActioned="originalInteraction.actioned"
          :originalMessage="originalInteraction.message"
          :originalActionTaken="originalInteraction.actionTaken"
          :originalReachOut="originalInteraction.reachOut"
          :id="originalInteraction.id"
        ></InteractionForm>
        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-card-section>
              <q-item class="row items-center">
                <q-item-section avatar>
                  <q-avatar icon="warning" color="negative" text-color="white"
                /></q-item-section>
                <q-item-section>
                  <span class="q-ml-sm"
                    >Are you sure you want to delete this interaction?</span
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
                @click="deleteInteraction"
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
import InteractionForm from "../components/InteractionForm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "EditInteraction",
  components: {
    InteractionForm,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const originalInteraction = {
      ...$store.state.interactions.interactions.find(
        (i) => i.id === $router.currentRoute.value.params.id
      ),
    };
    const contact = computed(() =>
      $store.state.contacts.contacts.find(
        (c) => c.id === originalInteraction.contact
      )
    );
    const isAdmin = computed(() => {
      const uid = $store.state.users.user.uid;
      const profile = $store.state.users.profiles.find((p) => p.id === uid);
      console.log("isAdmin", profile.admin);
      return profile.admin;
    });
    const uid = computed(() => $store.state.users.user.uid);
    const confirm = ref(false);
    const deleteLoading = ref(false);
    const loading = ref(false);
    const updateInteraction = async (ev) => {
      loading.value = true;
      const { interaction, contact } = ev;
      const currentDate = new Date().toISOString();
      const actioned = interaction.actioned;
      interaction.contact = originalInteraction.contact;
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
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: "Interaction Updated",
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
    };

    const deleteInteraction = async () => {
      deleteLoading.value = true;
      const response = await $store.dispatch(
        "interactions/deleteInteraction",
        originalInteraction.id
      );
      if (!response.error) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: "Interaction Deleted",
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
      updateInteraction,
      deleteInteraction,
      deleteLoading,
      loading,
      confirm,
      originalInteraction,
      contact,
      isAdmin,
    };
  },
});
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
