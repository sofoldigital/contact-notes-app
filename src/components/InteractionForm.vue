<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="row items-center">
      <div class="col col-12 col-md-8 q-mt-md">
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
    </div>
    <q-input
      filled
      autogrow
      v-model="message"
      label="Contact Message *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Enter a contact message']"
    />
    <div class="row">
      <div class="col col-12 col-sm-4" v-if="!reachOut">
        <q-checkbox v-model="actioned" label="Actioned" />
      </div>
      <div class="col col-12 col-sm-4" v-if="!reachOut">
        <q-checkbox
          v-model="urgent"
          :disable="actioned"
          color="red"
          label="Urgent"
        />
      </div>
      <div class="col col-12 col-sm-4">
        <q-checkbox v-model="reachOut" color="purple" label="Reach out" />
      </div>
    </div>
    <q-input
      v-if="actioned && !reachOut"
      filled
      autogrow
      v-model="actionTaken"
      label="Action Taken *"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Summarise Action Taken',
      ]"
    />

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

    originalType: {
      type: String,
      default: "call",
    },

    originalMessage: {
      type: String,
      default: "",
    },

    originalActioned: {
      type: Boolean,
      default: false,
    },

    originalActionTaken: {
      type: String,
      default: "",
    },

    originalReachOut: {
      type: Boolean,
      default: false,
    },

    originalStatus: {
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

    const typeOfContact = ref(props.originalType);

    const message = ref(props.originalMessage);

    const actionTaken = ref(props.originalActionTaken);

    const reachOut = ref(props.originalReachOut);

    const urgent = ref(props.originalStatus == "Urgent" ? true : false);

    const actioned = ref(props.originalActioned ? true : false);

    const id = ref(props.id ? true : false);
    const uid = computed(() => $store.state.users.user.uid);

    watchEffect(() => {
      if (actioned.value) {
        urgent.value = false;
      }
    });
    watchEffect(() => {
      if (reachOut.value) {
        urgent.value = false;
        actionTaken.value = "";
        actioned.value = false;
      }
    });
    const onSubmit = async () => {
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
      context.emit("onSubmit", {
        interaction: {
          typeOfContact: typeOfContact.value,
          message: message.value,
          actionTaken: actionTaken.value,
          urgent: urgent.value,
          actioned: actioned.value,
          reachOut: reachOut.value,
          status: getStatus(),
        },
        contact: id,
      });
    };

    const options = ref([
      { value: "call", slot: "call" },
      { value: "mobile", slot: "mobile" },
      { value: "sms", slot: "sms" },
      { value: "email", slot: "mail" },
      { value: "fax", slot: "fax" },
    ]);

    return {
      typeOfContact,
      actioned,
      message,
      options,
      urgent,
      actionTaken,
      reachOut,
      onSubmit,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
