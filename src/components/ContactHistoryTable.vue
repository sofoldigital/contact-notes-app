<template>
  <q-table
    :rows="formattedHistory"
    :columns="columns"
    dense
    :grid="$q.screen.lt.md"
    :card-style="$q.screen.lt.md ? '' : 'box-shadow: none;'"
    color="primary"
    row-key="name"
    :loading="loading"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="edit" :props="props">
          <q-btn round size="sm" color="primary" icon="edit"></q-btn>
        </q-td>
        <q-td key="status" :props="props">
          <q-chip
            :color="props.row.status == 'Actioned' ? 'positive' : 'warning'"
            :class="
              props.row.status == 'Actioned' ? 'text-white' : 'text-black'
            "
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
        <q-td key="formattedDateOfContact" :props="props">
          <q-icon
            class="q-mr-sm"
            :name="props.row.typeOfContact === 'call' ? 'phone' : 'email'"
          ></q-icon>
          {{ props.row.formattedDateOfContact }}
        </q-td>
        <q-td key="message" :props="props">
          <div
            style="
              width: 300px;
              overflow-wrap: break-word;
              white-space: initial;
            "
          >
            {{ props.row.message }}
          </div>
        </q-td>
        <q-td key="actionTaken" :props="props">
          <div
            style="
              width: 300px;
              overflow-wrap: break-word;
              white-space: initial;
            "
          >
            {{ props.row.actionTaken }}
          </div>
        </q-td>
        <q-td key="formattedDateActioned" :props="props">
          <q-badge color="positive" v-if="props.row.formattedDateActioned">
            {{ props.row.formattedDateActioned }}
          </q-badge>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:bottom-row>
      <q-tr>
        <q-td colspan="100%">
          <q-btn class="q-px-sm q-my-sm" icon="add" color="primary" dense
            >Add interaction</q-btn
          >
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { ref, computed } from "vue";
import { date, useQuasar } from "quasar";

export default {
  props: {
    contactHistory: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const $q = useQuasar;
    const formattedString = (val) => {
      const timestamp = new Date(val);
      return date.formatDate(timestamp, "DD-MMM-YY");
    };
    const formattedHistory = computed(() => {
      return props.contactHistory.map((h) => {
        const contactDate = new Date(h.dateOfContact);
        const dateActioned = new Date(h.dateActioned);
        const newHistory = {
          ...h,
          formattedDateOfContact: date.formatDate(contactDate, "DD-MMM-YY"),
          formattedDateActioned: date.formatDate(dateActioned, "DD-MMM-YY"),
        };
        return newHistory;
      });
    });
    const columns = [
      { name: "edit", label: "Edit", align: "center" },
      {
        name: "status",
        label: "Status",
        align: "center",
        field: "status",
        sortable: true,
        sort: (a, b) => a.localeCompare(b, "en", { sensitivity: "base" }),
      },
      {
        name: "formattedDateOfContact",
        required: true,
        label: "Date",
        field: "formattedDateOfContact",
        align: "left",
        format: (val) => `${val}`,
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: "message",
        label: "Message",
        field: "message",
        align: "left",
        sortable: true,
      },
      {
        name: "actionTaken",
        label: "Action Taken",
        field: "actionTaken",
        align: "left",
      },
      {
        name: "formattedDateActioned",
        label: "Date Actioned",
        field: `formattedDateActioned`,
        align: "left",
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
    ];

    return {
      loading: ref(false),
      columns,
      formattedHistory,
      formattedString,
    };
  },
};
</script>
