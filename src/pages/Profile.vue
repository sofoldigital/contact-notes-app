<template>
  <q-page padding>
    <q-card
      class="q-mx-auto"
      style="max-width: 800px; width: 90%"
      v-if="profile"
    >
      <q-card-section class="text-center">
        <q-avatar size="200px" v-if="profile.imageUrl">
          <img :src="profile.imageUrl" />
        </q-avatar>
        <q-avatar
          v-else
          round="round"
          color="primary"
          size="200px"
          text-color="white"
          >{{ avatarInitials }}</q-avatar
        >
      </q-card-section>
      <q-card-section>
        <q-item>
          <q-item-section>
            <span class="text-grey">Email: </span>{{ user.email }}
          </q-item-section>
        </q-item>
        <q-separator spaced></q-separator>
        <q-item>
          <q-item-section>
            <span class="text-grey">Display Name: </span
            >{{ profile.displayName }}
          </q-item-section>
          <q-item-section side> </q-item-section>
          <q-item-section side>
            <ChangeNameDialog :name="profile.displayName" />
          </q-item-section>
        </q-item>
        <q-separator spaced></q-separator>
        <q-item>
          <q-item-section>
            <span class="text-grey">Profile Image </span
            >{{ profile.imageUrl ? profile.imageUrl : "No Url Specified" }}
          </q-item-section>
          <q-item-section side> </q-item-section>
          <q-item-section side>
            <ChangeProfileImageDialog
              :id="profile.id"
              :url="profile.imageUrl"
              :initials="avatarInitials"
              :adminPage="false"
            />
          </q-item-section>
        </q-item>
        <ProfileAccessCard
          @onSubmit="onSubmit"
          :originalAdmin="profile.admin"
          :originalViewSpecific="
            profile.viewSpecific ? profile.viewSpecific : false
          "
          :originalViewAssigned="
            profile.viewAssigned ? profile.viewAssigned : false
          "
          :originalViewRecent="profile.viewRecent ? profile.viewRecent : false"
          :originalViewPending="
            profile.viewPending ? profile.viewPending : false
          "
          :originalContactImages="
            profile.contactImages ? profile.contactImages : false
          "
          :originalDeleteAccess="
            profile.deleteAccess ? profile.deleteAccess : false
          "
          :originalEditMessages="
            profile.editMessages ? profile.editMessages : false
          "
          :originalEditAssignee="
            profile.editAssignee ? profile.editAssignee : false
          "
          :id="profile.id"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, computed } from "vue";
import ChangeNameDialog from "../components/ChangeNameDialog.vue";
import ChangeProfileImageDialog from "../components/ChangeProfileImageDialog.vue";
import ProfileAccessCard from "../components/ProfileAccessCard.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "ProfilePage",
  components: {
    ChangeNameDialog,
    ChangeProfileImageDialog,
    ProfileAccessCard,
  },
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const user = computed(() => $store.state.users.user);
    const profile = computed(() => {
      return $store.state.users.profiles.find((p) => p.id === user.value.uid);
    });

    const avatarInitials = computed(() => {
      const str = profile.value.displayName;
      const matches = str.match(/\b(\w)/g); // ['J','S','O','N']
      const acronym = matches.join(""); // JSON
      return acronym.substring(0, 2).toUpperCase();
    });

    const $router = useRouter();

    const onSubmit = async (ev) => {
      const { id, profile } = ev;
      const response = await $store.dispatch("users/updatePermissions", {
        id,
        profile,
      });
      if (!response.error) {
        $q.notify({
          color: "positive",
          textColor: "white",
          icon: "check",
          message: `Successfully updated user permissions for ${profile.displayName}`,
        });
      }
    };

    return {
      profile,
      avatarInitials,
      onSubmit,
      user,
    };
  },
});
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
