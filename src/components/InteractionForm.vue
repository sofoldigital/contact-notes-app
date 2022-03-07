<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="text-center">
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
      type="textarea"
      v-model="message"
      label="Contact Message *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Enter a contact message']"
    />
    <q-checkbox left-label v-model="actioned" label="Has this been Actioned?" />
    <q-input
      v-if="actioned"
      filled
      autogrow
      v-model="actionTaken"
      label="Action Taken *"
      lazy-rules
      :rules="[(val) => (val !== null && val !== '') || 'Enter a contact name']"
    />

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

    originalStatus: {
      type: String,
      default: "",
    },

    originalAction: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const $router = useRouter();

    const $store = useStore();

    const typeOfContact = ref(props.originalType);

    const message = ref(props.originalMessage);

    const actionTaken = ref(props.originalAction);

    const actioned = ref(props.originalAction ? true : false);

    const id = ref(null);

    const onSubmit = async () => {
      context.emit("onSubmit", {
        interaction: {
          typeOfContact: typeOfContact.value,
          message: message.value,
          actionTaken: actionTaken.value,
          actioned: actioned.value,
        },
        id: id.value,
      });
    };

    const options = ref([
      { value: "call", slot: "call" },
      { value: "sms", slot: "sms" },
      { value: "email", slot: "mail" },
      { value: "fax", slot: "fax" },
    ]);

    return {
      typeOfContact,
      actioned,
      message,
      options,
      actionTaken,
      onSubmit,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
