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
    <q-toggle v-model="showInteraction" label="Add Interaction" />
    <q-card bordered flat v-if="showInteraction">
      <q-card-section>
        <q-item-label caption>Interaction Details</q-item-label>
      </q-card-section>
      <q-card-section>
        <div class="row items-center justify-center q-mb-md">
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
                <q-icon class="q-mr-xs" name="call" />
                <div class="text-center" v-if="!$q.screen.lt.md">Phone</div>
              </div>
            </template>
            <template v-slot:mobile>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="phone_android" />
                <div class="text-center" v-if="!$q.screen.lt.md">Mobile</div>
              </div>
            </template>
            <template v-slot:sms>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="sms" />
                <div class="text-center" v-if="!$q.screen.lt.md">SMS</div>
              </div>
            </template>
            <template v-slot:mail>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="mail" />
                <div class="text-center" v-if="!$q.screen.lt.md">Email</div>
              </div>
            </template>
            <template v-slot:fax>
              <div class="row items-center no-wrap">
                <q-icon class="q-mr-xs" name="fax" />
                <div class="text-center" v-if="!$q.screen.lt.md">Fax</div>
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
          <div class="col col-12 col-sm-4" v-if="!reachOut">
            <q-checkbox v-model="actioned" label="Actioned" />
          </div>
          <div class="col col-12 col-sm-4" v-if="!reachOut">
            <q-checkbox
              :disable="actioned"
              v-model="urgent"
              color="red"
              label="Urgent"
            />
          </div>
          <div class="col col-12 col-sm-4">
            <q-checkbox
              :disable="actioned"
              v-model="reachOut"
              color="purple"
              label="Reach Out"
            />
          </div>
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
            (val) => (val !== null && val !== '') || 'Summarise Action Taken',
          ]"
        />
      </q-card-section>
    </q-card>
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
    const notes = ref("");
    const redFlag = ref(false);
    const showInteraction = ref(true);
    const message = ref("");
    const actioned = ref(false);
    const actionTaken = ref("");
    const reachOut = ref(false);
    const urgent = ref(false);
    const assignee = ref({ label: "Unassigned", value: "" });

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
    watchEffect(() => {
      if (reachOut.value) {
        urgent.value = false;
        actioned.value = false;
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

    const onSubmit = async () => {
      const payload = {
        contact: {
          contactName: contactName.value,
          phone: phone.value,
          email: email.value,
          assignee: assignee.value.value,
          notes: notes.value,
          redFlag: redFlag.value,
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
      { value: "mobile", slot: "mobile" },
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
      userOptions,
      assignee,
      actioned,
      actionTaken,
      urgent,
      updateError,
      message,
      errorLoading,
      redFlag,
      notes,
      typeOfContact,
      reachOut,
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
