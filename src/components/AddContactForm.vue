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
    <q-toggle v-model="showInteraction" label="Add Interaction" />
    <q-card bordered flat v-if="showInteraction">
      <q-card-section>
        <q-item-label caption>Interaction Details</q-item-label>
      </q-card-section>
      <q-card-section>
        <div class="text-center q-mb-md">
          <q-btn-toggle
            v-model="typeOfContact"
            class="my-custom-toggle"
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="primary"
            :options="options"
          >
            <template v-slot:call>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="call" v-if="!$q.screen.lt.sm" />
                <div class="text-center">Call</div>
              </div>
            </template>
            <template v-slot:sms>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="sms" v-if="!$q.screen.lt.sm" />
                <div class="text-center">SMS</div>
              </div>
            </template>
            <template v-slot:mail>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="mail" v-if="!$q.screen.lt.sm" />
                <div class="text-center">Email</div>
              </div>
            </template>
            <template v-slot:fax>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="fax" v-if="!$q.screen.lt.sm" />
                <div class="text-center">Fax</div>
              </div>
            </template>
          </q-btn-toggle>
        </div>
        <q-input
          filled
          autogrow
          v-model="message"
          label="Contact Message *"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Enter a contact message',
          ]"
        />
        <div class="row">
          <div class="col col-12 col-sm-6">
            <q-checkbox left-label v-model="actioned" label="Actioned" />
          </div>
          <!-- <div class="col col-12 col-sm-6">
            <q-checkbox
              left-label
              :disable="actioned"
              v-model="urgent"
              color="red"
              label="Urgent"
            />
          </div> -->
        </div>
        <q-input
          v-if="actioned"
          class="q-mt-sm"
          filled
          autogrow
          v-model="actionTaken"
          label="Action Taken *"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Enter a contact name',
          ]"
        />
      </q-card-section>
    </q-card>
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
import { ref, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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
    const typeOfContact = ref("call");
    const showInteraction = ref(true);
    const message = ref("");
    const actioned = ref(false);
    const actionTaken = ref("");
    const reachOut = ref(false);
    const urgent = ref(false);
    const updateError = (type) => {
      if (type == "error") {
        errorLoading.value = true;
      } else {
        return (errorLoading.value = false);
      }
    };
    watchEffect(() => {
      if (actioned.value) {
        urgent.value = false;
      }
    });
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
    const getStatus = () => {
      if (reachOut.value) {
        return "Reach Out";
      } else {
        if (actioned.value) {
          return "Actioned";
        } else {
          return urgent.value ? "Urgent" : "Pending";
        }
      }
    };

    const onSubmit = async () => {
      const payload = {
        contact: {
          contactName: contactName.value,
          phone: phone.value,
          email: email.value,
          fax: fax.value,
          lastUpdate: Date.now(),
          imageUrl: imageUrl.value,
        },
        interaction: null,
        id: id.value,
      };
      if (showInteraction.value) {
        payload.interaction = {
          typeOfContact: typeOfContact.value,
          message: message.value,
          actionTaken: actionTaken.value,
          actioned: actioned.value,
          reachOut: reachOut.value,
          status: getStatus(),
        };
      }
      context.emit("onSubmit", payload);
    };

    const options = ref([
      { value: "call", slot: "call" },
      { value: "sms", slot: "sms" },
      { value: "email", slot: "mail" },
      { value: "fax", slot: "fax" },
    ]);

    return {
      email,
      contactName,
      options,
      imageUrl,
      fax,
      isAdmin,
      phoneExists,
      validPhone,
      actioned,
      actionTaken,
      urgent,
      updateError,
      message,
      errorLoading,
      typeOfContact,
      phone,
      showInteraction,
      onSubmit,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
