<template>
  <q-expansion-item
    header-class="bg-white font-weight-bold"
    class="shadow-1 overflow-hidden q-mb-md q-mx-auto"
    style="border-radius: 30px"
    expand-icon-class="text-primary"
    v-model="expanded"
  >
    <template v-slot:header>
      <q-item dense class="full-width q-pl-none">
        <q-item-section avatar>
          <q-btn
            icon="edit"
            color="primary"
            round
            dense
            @click="
              $router.push({
                name: 'Edit Contact',
                params: {
                  id,
                },
              })
            "
          ></q-btn>
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
          <q-item-label caption>
            <span></span>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="text-right text-caption">
          <q-chip color="warning" v-if="numberOfPending > 0">
            {{ numberOfPending
            }}<span v-if="!$q.screen.lt.sm" class="q-ml-sm">Pending</span>
          </q-chip>
        </q-item-section>
        <q-item-section v-if="!$q.screen.lt.sm" class="text-right">
          {{ contactHistory.length }} interactions
        </q-item-section>
      </q-item>
      <q-space></q-space>
    </template>
    <q-card>
      <q-card-section class="q-pa-lg">
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
  },
  setup(props, context) {
    const numberOfPending = computed(() => {
      const pendingActions = props.contactHistory.filter((x) => !x.actioned);
      return pendingActions.length;
    });
    const expanded = ref(false);
    const formattedString = (val) => {
      const timestamp = new Date(val);
      return date.formatDate(timestamp, "DD-MMM-YY");
    };

    watchEffect(() => {
      if (props.phone === props.phoneSearch) {
        expanded.value = true;
      }
    });
    return {
      formattedString,
      numberOfPending,
      expanded,
    };
  },
};
</script>
