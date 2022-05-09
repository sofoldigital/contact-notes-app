<template>
  <q-form @submit="onSubmit">
    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <q-item>
          <q-item-section>
            <span class="text-grey">System Access</span>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Admin Priviledges</q-item-label>
            <q-item-label caption
              >Allows the user to perform all functions within the application
              including editing user access levels.</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox :disable="!isAdmin" v-model="admin"></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>View Specific Contact</q-item-label>
            <q-item-label caption
              >Allows the user to view a contact and all their interactions if
              they enter their phone number specifically</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="viewSpecific"
            ></q-checkbox
            ><q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>View Assigned Contacts</q-item-label>
            <q-item-label caption
              >Allows the user to view contacts that are assigned to
              them.</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="viewAssigned"
            ></q-checkbox>
            <q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>View Recent Contacts</q-item-label>
            <q-item-label caption
              >Allows the user to view contacts with recent
              interactions.</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="viewRecent"
            ></q-checkbox
            ><q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>View Pending Action</q-item-label>
            <q-item-label caption
              >Allows the user to view contacts interactions that are not yet
              actioned.</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="viewPending"
            ></q-checkbox
            ><q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>Contact Images</q-item-label>
            <q-item-label caption
              >Allows the user to view and update contact images</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="contactImages"
            ></q-checkbox>
            <q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>Edit All Assignees</q-item-label>
            <q-item-label caption
              >Allows the user to edit the "Assignee" for all contacts, not just
              those unassigned or assigned to the user.</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="editAssignee"
            ></q-checkbox
            ><q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>Edit All Messages</q-item-label>
            <q-item-label caption
              >Allows the user to edit the "Message" for all interactions, not
              just those entered by the user.</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="editMessages"
            ></q-checkbox
            ><q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item>
          <q-item-section
            ><q-item-label>Delete Functionality</q-item-label>
            <q-item-label caption
              >Allows the user to delete contacts and interactions</q-item-label
            >
          </q-item-section>
          <q-item-section side
            ><q-checkbox
              v-if="!admin"
              :disable="!isAdmin"
              v-model="deleteAccess"
            ></q-checkbox
            ><q-checkbox v-else :model-value="true" disabled></q-checkbox
          ></q-item-section>
        </q-item>
        <q-separator spaced />
      </q-card-section>
      <q-card-actions align="around" class="q-pb-lg" v-if="showSubmit"
        ><q-btn flat color="negative" type="reset" @click="reset">Cancel</q-btn>
        <q-btn color="primary" type="submit"
          >Update Permissions</q-btn
        ></q-card-actions
      >
    </q-card>
  </q-form>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section>
        <q-item class="row items-center">
          <q-item-section avatar>
            <q-avatar icon="warning" color="negative" text-color="white" />
          </q-item-section>
          <q-item-section>
            <span class="q-ml-sm"
              >Are you sure? You have removed your own admin priviledges. You
              will no longer be able to modify user access if you proceed.</span
            >
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          class="q-mr-md"
          color="primary"
          v-close-popup
        />
        <q-btn
          label="Remove my Access"
          color="primary"
          @click="confirmSubmit"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
export default {
  emits: ["onSubmit"],
  props: {
    originalAdmin: {
      type: Boolean,
      default: false,
    },

    originalViewSpecific: {
      type: Boolean,
      default: false,
    },

    originalViewAssigned: {
      type: Boolean,
      default: false,
    },

    originalEditMessages: {
      type: Boolean,
      default: false,
    },

    originalEditAssignee: {
      type: Boolean,
      default: false,
    },

    originalViewRecent: {
      type: Boolean,
      default: false,
    },

    originalViewPending: {
      type: Boolean,
      default: false,
    },

    originalContactImages: {
      type: Boolean,
      default: false,
    },

    originalDeleteAccess: {
      type: Boolean,
      default: false,
    },

    id: {
      type: String,
      default: null,
    },
  },
  setup(props, context) {
    const $q = useQuasar();
    const $store = useStore();
    const isAdmin = computed(() => {
      const uid = $store.state.users.user.uid;
      const profile = $store.state.users.profiles.find((p) => p.id === uid);
      return profile.admin;
    });

    const admin = ref(props.originalAdmin);
    const viewSpecific = ref(props.originalViewSpecific);
    const viewAssigned = ref(props.originalViewAssigned);
    const viewRecent = ref(props.originalViewRecent);
    const viewPending = ref(props.originalViewPending);
    const editMessages = ref(props.originalEditMessages);
    const editAssignee = ref(props.originalEditAssignee);
    const contactImages = ref(props.originalContactImages);
    const deleteAccess = ref(props.originalDeleteAccess);
    const confirm = ref(false);
    const id = ref(props.id);

    watchEffect(() => {
      if (admin.value) {
        viewSpecific.value = true;
        viewAssigned.value = true;
        viewRecent.value = true;
        viewPending.value = true;
        contactImages.value = true;
        deleteAccess.value = true;
      }
    });
    const showSubmit = computed(() => {
      if (isAdmin.value) {
        return (
          viewSpecific.value != props.originalViewSpecific ||
          admin.value != props.originalAdmin ||
          viewAssigned.value != props.originalViewAssigned ||
          viewRecent.value != props.originalViewRecent ||
          viewPending.value != props.originalViewPending ||
          contactImages.value != props.originalContactImages ||
          deleteAccess.value != props.originalDeleteAccess ||
          editAssignee.value != props.originalEditAssignee ||
          editMessages.value != props.originalEditMessages
        );
      } else {
        return false;
      }
    });

    const confirmSubmit = async () => {
      const payload = {
        profile: {
          contactImages: contactImages.value,
          deleteAccess: deleteAccess.value,
          viewPending: viewPending.value,
          viewRecent: viewRecent.value,
          editMessages: editMessages.value,
          viewAssigned: viewAssigned.value,
          editAssignee: editAssignee.value,
          admin: admin.value,
          viewSpecific: viewSpecific.value,
        },
        id: id.value,
      };
      context.emit("onSubmit", payload);
    };

    const onSubmit = async () => {
      if (props.originalAdmin && id.value === $store.state.users.user.uid) {
        if (!admin.value) {
          if ($store.state.users.profiles.filter((p) => p.admin).length === 1) {
            $q.notify({
              color: "negative",
              textColor: "white",
              icon: "error",
              message:
                "Unable to remove your admin access. You are the last remaining admin",
            });
          } else {
            confirm.value = true;
          }
        } else {
          confirmSubmit();
        }
      } else {
        confirmSubmit();
      }
    };

    const reset = () => {
      admin.value = props.originalAdmin;
      viewSpecific.value = props.originalViewSpecific;
      viewAssigned.value = props.originalViewAssigned;
      viewPending.value = props.originalViewPending;
      viewRecent.value = props.originalViewRecent;
      contactImages.value = props.originalContactImages;
      deleteAccess.value = props.originalDeleteAccess;
      editMessages.value = props.originalEditMessages;
      editAssignee.value = props.originalEditAssignee;
    };

    return {
      onSubmit,
      isAdmin,
      showSubmit,
      admin,
      viewSpecific,
      editMessages,
      editAssignee,
      viewAssigned,
      confirmSubmit,
      viewRecent,
      viewPending,
      reset,
      contactImages,
      confirm,
      deleteAccess,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
