<template>
  <q-expansion-item
    header-class="bg-white font-weight-bold"
    class="shadow-1 overflow-hidden q-mb-md q-mx-auto"
    style="border-radius: 30px"
    expand-icon-class="text-primary"
    v-model="expanded"
    v-if="profile"
  >
    <template v-slot:header>
      <q-item dense class="full-width q-pl-none">
        <q-item-section avatar>
          <q-avatar
            class="bg-grey shadow-2"
            :size="!$q.screen.lt.sm ? '80px' : '50px'"
            @click="
              $router.push({
                name: 'Edit Contact',
                params: {
                  id,
                },
              })
            "
          >
            <img
              v-if="updatedImageUrl && profile.contactImages"
              :src="updatedImageUrl"
            />
            <q-icon v-else name="person" class="text-white"></q-icon>
            <q-badge
              v-if="redFlag"
              floating
              color="negative"
              text-color="white"
            >
              <q-icon name="flag" size="20px" />
            </q-badge>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1" class="text-weight-bold"
            >{{ contactName
            }}<span class="text-grey q-ml-sm">({{ phone }})</span></q-item-label
          >
          <q-item-label caption v-if="email">
            <q-icon name="email" class="q-mr-sm"></q-icon
            ><span>{{ email }}</span>
          </q-item-label>
          <q-item-label caption v-if="fax">
            <q-icon name="fax" class="q-mr-sm"></q-icon><span>{{ fax }}</span>
          </q-item-label>
          <q-item-label class="items-center" v-if="assignee">
            <q-chip>
              <q-avatar v-if="assigneeDetails.imageUrl">
                <img :src="assigneeDetails.imageUrl" />
              </q-avatar>
              <q-avatar
                v-else
                round="round"
                color="primary"
                text-color="white"
                >{{ avatarInitials }}</q-avatar
              >
              {{ assigneeDetails.displayName }}
            </q-chip></q-item-label
          >
        </q-item-section>
        <q-item-section side class="text-right text-caption">
          <q-chip color="negative" class="text-white" v-if="numberOfUrgent > 0">
            {{ numberOfUrgent
            }}<span v-if="!$q.screen.lt.sm" class="q-ml-sm">Urgent</span>
          </q-chip>
          <q-chip color="warning" v-if="numberOfPending > 0">
            {{ numberOfPending
            }}<span v-if="!$q.screen.lt.sm" class="q-ml-sm">Pending</span>
          </q-chip>
        </q-item-section>
        <q-item-section v-if="!$q.screen.lt.sm" class="text-right">
          <span class="text-caption text-grey">{{ formattedDate }}</span>
          {{ contactHistory.length }} interactions <br />
        </q-item-section>
      </q-item>
      <q-space></q-space>
    </template>
    <q-card>
      <q-card-section class="q-pa-lg">
        <q-item-label caption> Contact Notes </q-item-label>
        <p>{{ notes }}</p>
        <ContactHistoryTable
          :contactHistory="contactHistory"
          :contactId="id"
        ></ContactHistoryTable>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import ContactHistoryTable from "./ContactHistoryTable.vue";
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { date } from "quasar";
export default {
  components: {
    ContactHistoryTable,
  },
  props: {
    phoneSearch: {
      type: String,
      default: "",
    },

    textSearch: {
      type: String,
      default: "",
    },

    id: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    assignee: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    contactHistory: {
      type: Array,
      required: true,
    },

    createdAt: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    fax: {
      type: String,
    },

    lastUpdate: {
      type: String,
      required: true,
    },

    contactName: {
      type: String,
      required: true,
    },

    redFlag: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const updatedImageUrl = ref(props.imageUrl);
    const $store = useStore();
    const numberOfPending = computed(() => {
      const pendingActions = props.contactHistory.filter((x) => {
        return x.status === "Pending";
      });
      return pendingActions.length;
    });
    const numberOfUrgent = computed(() => {
      const pendingActions = props.contactHistory.filter((x) => {
        return x.status === "Urgent";
      });
      return pendingActions.length;
    });

    const assigneeDetails = computed(() => {
      const users = $store.state.users.profiles;
      if (props.assignee != "") {
        const user = users.find((u) => u.id === props.assignee);
        if (user) {
          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

    const avatarInitials = computed(() => {
      const str = assigneeDetails.value.displayName;
      const matches = str.match(/\b(\w)/g); // ['J','S','O','N']
      const acronym = matches.join(""); // JSON
      return acronym.substring(0, 2).toUpperCase();
    });

    const profile = computed(() => $store.state.users.profile);

    const expanded = ref(false);

    const formattedDate = computed(() => {
      return date.formatDate(props.lastUpdate, "DD-MMM-YY h:mm a");
    });

    watchEffect(() => {
      if (props.phone === props.phoneSearch) {
        expanded.value = true;
      }
    });
    return {
      numberOfPending,
      formattedDate,
      updatedImageUrl,
      assigneeDetails,
      profile,
      numberOfUrgent,
      expanded,
      avatarInitials,
    };
  },
};
</script>
