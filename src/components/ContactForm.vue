<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row">
      <q-avatar size="100px" v-if="imageUrl && isAdmin" class="q-mx-auto">
        <img :src="imageUrl" />
        <q-icon name="error"></q-icon>
      </q-avatar>
    </div>
    <q-input
      filled
      v-model="phone"
      label="Phone *"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Enter a contact phone',
        (val) =>
          validPhone ||
          'Enter a valid phone (starting with 0, 18, 13 without spaces)',
        () => !phoneExists || 'Contact already exists',
      ]"
    />

    <q-input
      filled
      v-model="contactName"
      label="Name *"
      lazy-rules
      :rules="[(val) => (val !== null && val !== '') || 'Enter a contact name']"
    />
    <q-input filled v-model="imageUrl" label="Image URL" v-if="isAdmin" />
    <q-input filled v-model="email" label="Email" />
    <q-input filled v-model="fax" label="Fax" />

    <div class="row justify-center">
      <q-btn
        label="Save"
        class="full-width"
        type="submit"
        color="positive"
        :loading="loading"
      />
      <q-btn
        label="Cancel"
        class="full-width q-mt-md"
        flat
        color="negative"
        @click="$router.back()"
      />
    </div>
  </q-form>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    originalImageUrl: {
      type: String,
      default: "",
    },

    originalPhone: {
      type: String,
      default: "",
    },

    originalEmail: {
      type: String,
      default: "",
    },

    originalFax: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    id: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const $router = useRouter();
    const $store = useStore();
    const phone = ref(props.originalPhone);
    const email = ref(props.originalEmail);
    const fax = ref(props.originalFax);
    const errorLoading = ref(false);
    const updateError = (type) => {
      if (type == "error") {
        errorLoading.value = true;
      } else {
        return (errorLoading.value = false);
      }
    };
    const isAdmin = computed(() => {
      const uid = $store.state.users.user.uid;
      const profile = $store.state.users.profiles.find((p) => p.id === uid);
      return profile.admin;
    });
    const contactName = ref(props.originalName);
    const imageUrl = ref(props.originalImageUrl);
    const id = ref(props.id);
    const phoneExists = computed(() => {
      if (!id.value) {
        console.log("original phone", props.originalPhone);
        return $store.state.contacts.contacts.some(
          (c) => c.phone === phone.value
        );
      } else {
        return false;
      }
    });
    const validPhone = computed(() => {
      if (phone.value.length == 10) {
        return (
          phone.value.substring(0, 4) === "1300" ||
          phone.value.substring(0, 4) === "1800" ||
          phone.value.substring(0, 1) === "0"
        );
      } else if (phone.value.length == 6) {
        return phone.value.substring(0, 2) === "13";
      } else {
        return false;
      }
    });
    const $q = useQuasar();
    const onSubmit = async () => {
      context.emit("onSubmit", {
        contact: {
          contactName: contactName.value,
          phone: phone.value,
          email: email.value,
          fax: fax.value,
          lastUpdate: Date.now(),
          imageUrl: imageUrl.value,
        },
        id: id.value,
      });
    };

    return {
      email,
      contactName,
      imageUrl,
      fax,
      isAdmin,
      phoneExists,
      validPhone,
      updateError,
      errorLoading,
      phone,
      onSubmit,
    };
  },
};
</script>
