<template>
  <q-expansion-item
    header-class="bg-white font-weight-bold"
    class="shadow-1 overflow-hidden q-mb-md"
    style="border-radius: 30px"
    expand-icon-class="text-primary"
  >
    <template v-slot:header>
      <q-item dense class="full-width">
        <q-item-section avatar>
          <q-icon name="person"></q-icon>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1" class="text-weight-bold"
            >{{ contactName
            }}<span class="text-grey q-ml-sm">({{ id }})</span></q-item-label
          >
          <q-item-label caption>
            <span>{{ contactHistory.length }} interactions</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side class="text-right text-caption"
          >Last update:<br />
          {{ formattedString(lastUpdate) }}
        </q-item-section>
      </q-item>
      <q-space></q-space>
    </template>
    <q-card>
      <q-card-section class="q-pa-lg">
        <ContactHistoryTable
          :contactHistory="contactHistory"
        ></ContactHistoryTable>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import ContactHistoryTable from "./ContactHistoryTable.vue";
import { date } from "quasar";
export default {
  components: {
    ContactHistoryTable,
  },
  props: {
    id: {
      type: String,
      required: true,
    },

    contactHistory: {
      type: Array,
      required: true,
    },

    createdAt: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
    },

    lastUpdate: {
      type: Number,
      required: true,
    },

    contactName: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const formattedString = (val) => {
      const timestamp = new Date(val);
      return date.formatDate(timestamp, "DD-MMM-YY");
    };
    return {
      formattedString,
    };
  },
};
</script>
