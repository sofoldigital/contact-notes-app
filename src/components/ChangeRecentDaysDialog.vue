<template>
  <q-btn icon="edit" round @click="dialog = true"></q-btn>
  <q-dialog v-model="dialog">
    <q-card style="width: 90%">
      <q-form ref="form" @submit.prevent="updateDays">
        <q-card-section class="text-h6 text-center">
          Update Recent Interaction Timeframe (days)
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            class="bg-white"
            label="# of days"
            min="1"
            type="number"
            outlined
            v-model="newDays"
          >
            <template v-slot:append> </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="CLOSE" color="negative" v-close-popup />
          <q-btn color="primary" type="submit" :loading="loading">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  props: ["days"],
  setup(props, context) {
    const $store = useStore();
    const dialog = ref(false);
    const loading = ref(false);
    const newDays = ref(0);
    const setDays = computed(() => props.days);
    if (props.days) {
      newDays.value = setDays.value;
    }
    const updateDays = async () => {
      if (newDays.value !== props.days) {
        loading.value = true;
        await $store.dispatch("contacts/updateRecentDays", newDays.value);
        loading.value = false;
        dialog.value = false;
      }
    };

    return {
      dialog,
      newDays,
      updateDays,
      loading,
    };
  },
};
</script>
