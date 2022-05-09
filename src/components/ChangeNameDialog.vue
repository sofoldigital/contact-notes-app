<template>
  <q-btn icon="edit" round @click="dialog = true"></q-btn>
  <q-dialog v-model="dialog">
    <q-card style="width: 90%">
      <q-form ref="form" @submit.prevent="updateName">
        <q-card-section class="text-h6 text-center">
          Update display name
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input class="bg-white" label="Name" outlined v-model="newName">
            <template v-slot:append> </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="CLOSE" color="negative" v-close-popup />
          <q-btn
            color="primary"
            type="submit"
            @click="updateName"
            :loading="loading"
            >Save</q-btn
          >
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  props: ["name"],
  setup(props, context) {
    const $store = useStore();
    const dialog = ref(false);
    const loading = ref(false);
    const newName = ref("");
    const setName = computed(() => props.name);
    if (props.name) {
      newName.value = setName.value;
    }
    const updateName = async () => {
      if (newName.value !== props.name) {
        loading.value = true;
        await $store.dispatch("users/updateDisplayName", newName.value);
        loading.value = false;
      }
    };

    return {
      dialog,
      newName,
      updateName,
      loading,
    };
  },
};
</script>
