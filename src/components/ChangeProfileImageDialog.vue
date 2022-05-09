<template>
  <q-btn v-if="!adminPage" icon="edit" round @click="dialog = true"></q-btn>
  <q-btn v-else class="q-mr-md" color="primary" @click="dialog = true"
    >Edit Profile Image</q-btn
  >
  <q-dialog v-model="dialog">
    <q-card style="width: 90%">
      <q-form ref="form" @submit.prevent="updateUrl">
        <q-card-section class="text-h6 text-center">
          Update Profile Image Url
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar size="200px" v-if="newUrl" v-show="!imageError">
            <img :src="newUrl" :onerror="resetImage" :onload="removeError" />
          </q-avatar>
          <q-avatar
            v-if="!newUrl || imageError"
            round="round"
            color="primary"
            size="200px"
            text-color="white"
            >{{ initials }}</q-avatar
          >
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            class="bg-white"
            label="Profile Image Url"
            clearable
            outlined
            v-model="newUrl"
          >
            <template v-slot:append> </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="CLOSE" color="negative" v-close-popup />
          <q-btn
            color="primary"
            type="submit"
            @click="updateUrl"
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
  props: {
    id: { type: String, required: true },
    url: { type: String },
    initials: { type: String },
    adminPage: { type: Boolean, default: false },
  },
  setup(props, context) {
    const $store = useStore();
    const dialog = ref(false);
    const loading = ref(false);
    const newUrl = ref("");
    const setUrl = computed(() => props.url);
    const imageError = ref(false);
    if (props.url) {
      newUrl.value = setUrl.value;
    }
    const updateUrl = async () => {
      if (newUrl.value !== props.url) {
        if (imageError.value) {
          await $store.dispatch("users/updateProfileImageUrl", {
            id: props.id,
            imageUrl: "",
          });
        } else {
          await $store.dispatch("users/updateProfileImageUrl", {
            id: props.id,
            imageUrl: newUrl.value,
          });
        }
        dialog.value = false;
      }
    };

    const resetImage = () => {
      imageError.value = true;
    };

    const removeError = () => {
      imageError.value = false;
    };

    return {
      dialog,
      newUrl,
      updateUrl,
      resetImage,
      imageError,
      removeError,
      loading,
    };
  },
};
</script>
