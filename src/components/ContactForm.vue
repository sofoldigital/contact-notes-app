<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="phone"
      label="Phone *"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Enter a contact phone',
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
    const contactName = ref(props.originalName);
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
    const $q = useQuasar();
    const onSubmit = async () => {
      context.emit("onSubmit", {
        contact: {
          contactName: contactName.value,
          phone: phone.value,
          email: email.value,
          fax: fax.value,
          lastUpdate: Date.now(),
        },
        id: id.value,
      });
    };

    return {
      email,
      contactName,
      fax,
      phoneExists,
      phone,
      onSubmit,
    };
  },
};
</script>
