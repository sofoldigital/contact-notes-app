<template>
  <q-expansion-item
    header-class="bg-white font-weight-bold"
    expand-icon-class="text-primary"
    bordered
    v-model="expanded"
  >
    <template v-slot:header>
      <q-item dense class="full-width q-pl-none">
        <q-item-section avatar>
          <q-avatar
            v-if="imageUrl"
            class="bg-grey"
            :size="!$q.screen.lt.sm ? '80px' : '50px'"
          >
            <img :src="imageUrl" />
          </q-avatar>
          <q-avatar
            v-else
            round="round"
            color="primary"
            :size="!$q.screen.lt.sm ? '80px' : '50px'"
            text-color="white"
            >{{ avatarInitials }}</q-avatar
          >
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1" class="text-weight-bold">{{
            displayName
          }}</q-item-label>
          <q-item-label class="text-grey-7" v-if="email">
            <q-icon name="email" class="q-mr-sm"></q-icon
            ><span>{{ email }}</span>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-chip color="primary" class="text-white" v-if="admin">
            Admin
          </q-chip>
        </q-item-section>
      </q-item>
      <q-space></q-space>
    </template>
    <q-card>
      <q-card-section class="q-pa-lg">
        <ChangeProfileImageDialog
          :url="imageUrl"
          :id="id"
          :initials="avatarInitials"
          :adminPage="true"
        />
        <q-btn
          v-if="!isCurrentUser"
          color="grey"
          class="align-right"
          @click="deleteConfirm = true"
          >Delete User</q-btn
        >
        <q-dialog v-model="deleteConfirm" persistent>
          <q-card>
            <q-card-section>
              <q-item>
                <q-item-section avatar
                  ><q-avatar
                    icon="warning"
                    color="negative"
                    text-color="white"
                    class="q-mr-sm"
                /></q-item-section>
                <q-item-section
                  >Are you sure? Deleting this user will remove their ability to
                  log into the system.</q-item-section
                >
              </q-item>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                label="Delete User"
                color="negative"
                @click="removeUser"
                :loading="loadingDelete"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <ProfileAccessCard
          @onSubmit="onSubmit"
          :originalAdmin="admin"
          :originalViewSpecific="viewSpecific"
          :originalViewAssigned="viewAssigned"
          :originalEditMessages="editMessages"
          :originalEditAssignee="editAssignee"
          :originalViewRecent="viewRecent"
          :originalViewPending="viewPending"
          :originalContactImages="contactImages"
          :originalDeleteAccess="deleteAccess"
          :id="id"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>
  <q-separator />
</template>

<script>
import ProfileAccessCard from "./ProfileAccessCard.vue";
import ChangeProfileImageDialog from "./ChangeProfileImageDialog.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
export default {
  components: {
    ProfileAccessCard,
    ChangeProfileImageDialog,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    displayName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    viewSpecific: {
      type: Boolean,
      default: false,
    },

    editMessages: {
      type: Boolean,
      default: false,
    },

    editAssignee: {
      type: Boolean,
      default: false,
    },

    viewAssigned: {
      type: Boolean,
      default: false,
    },

    viewRecent: {
      type: Boolean,
      default: false,
    },

    viewPending: {
      type: Boolean,
      default: false,
    },

    contactImages: {
      type: Boolean,
      default: false,
    },

    deleteAccess: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const $store = useStore();
    const $q = useQuasar();
    const $router = useRouter();
    const expanded = ref(false);
    const updatedImageUrl = ref(props.imageUrl);
    const deleteConfirm = ref(false);
    const loadingDelete = ref(false);

    const resetImage = () => {
      updatedImageUrl.value = "";
    };

    const avatarInitials = computed(() => {
      const str = props.displayName;
      const matches = str.match(/\b(\w)/g); // ['J','S','O','N']
      const acronym = matches.join(""); // JSON
      return acronym.substring(0, 2).toUpperCase();
    });

    const onSubmit = async (ev) => {
      let redirect = false;
      const { id, profile } = ev;
      if (id == $store.state.users.user.uid) {
        if (props.admin && !profile.admin) {
          redirect = true;
        }
      }
      const response = await $store.dispatch("users/updatePermissions", {
        id,
        profile,
      });
      if (!response.error) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: `Successfully updated user permissions for ${props.displayName}`,
        });
      }
      if (redirect) {
        $router.push("/profile");
      }
    };

    const isCurrentUser = computed(
      () => $store.state.users.user.uid === props.id
    );

    const removeUser = async () => {
      loadingDelete.value = true;
      const response = await $store.dispatch("users/removeUser", {
        uid: props.id,
        profile: { disabled: true },
      });
      loadingDelete.value = false;
      deleteConfirm.value = false;
    };

    return {
      expanded,
      avatarInitials,
      removeUser,
      isCurrentUser,
      resetImage,
      loadingDelete,
      updatedImageUrl,
      deleteConfirm,
      onSubmit,
    };
  },
};
</script>
