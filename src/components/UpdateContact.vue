<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row">
      <q-avatar size="100px" v-if="imageUrl && isAdmin" class="q-mx-auto">
        <img :src="imageUrl" />
        <q-icon name="error"></q-icon>
      </q-avatar>
    </div>
    <div class="row items-center">
      <div class="col col-12 col-md-5 q-mt-md q-mr-sm">
        <q-input
          filled
          v-model="contactName"
          label="Name *"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Enter a contact name',
          ]"
        />
      </div>
      <div class="col col-12 col-md-5 q-mt-md q-mr-sm">
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
      </div>
      <div class="col col-12 col-md-5 q-mt-md">
        <q-select
          filled
          v-model="assignee"
          :options="userOptions"
          label="Assignee"
        />
      </div>
    </div>
    <q-input filled v-model="imageUrl" label="Image URL" v-if="isAdmin" />
    <q-input filled v-model="email" label="Email" />
    <q-input filled v-model="fax" label="Fax" />

    <div class="row">
      <div class="col col-12">
        <q-checkbox v-model="redFlag" color="red" label="Red Flag" />
      </div>
    </div>
    <q-input filled autogrow v-model="notes" label="Contact Notes" />

    <div class="row justify-center">
      <q-btn
        label="Save"
        class="full-width"
        type="submit"
        color="primary"
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

    originalAssignee: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    originalRedFlag: {
      type: Boolean,
      default: false,
    },

    originalNotes: {
      type: String,
      default: "",
    },

    id: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const $store = useStore();
    const phone = ref(props.originalPhone);
    const email = ref(props.originalEmail);
    const redFlag = ref(props.originalRedFlag);
    const notes = ref(props.originalNotes);
    const fax = ref(props.originalFax);

    const getLabel = (id) => {
      if (id === "") {
        return "Unassigned";
      } else {
        const profile = $store.state.users.profiles.find((p) => p.id === id);
        if (profile) {
          return profile.displayName;
        } else {
          return "Unassigned";
        }
      }
    };
    const assignee = ref({
      value: props.originalAssignee,
      label: getLabel(props.originalAssignee),
    });

    const userOptions = computed(() => {
      const users = $store.state.users.profiles;
      const transformedUsers = [
        {
          label: "Unassigned",
          value: "",
        },
      ];
      users.forEach((user) => {
        transformedUsers.push({
          label: user.displayName,
          value: user.id,
        });
      });
      return transformedUsers;
    });
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
      if (props.originalPhone != phone.value) {
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
      console.log("phone exists", phoneExists);
      console.log("phone value", phone.value);
      context.emit("onSubmit", {
        contact: {
          contactName: contactName.value,
          phone: phone.value,
          email: email.value,
          notes: notes.value,
          assignee: assignee.value.value,
          redFlag: redFlag.value,
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
      notes,
      userOptions,
      assignee,
      redFlag,
      phone,
      onSubmit,
    };
  },
};
</script>
