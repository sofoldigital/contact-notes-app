<template>
  <q-table
    :rows="formattedHistory"
    :columns="columns"
    dense
    :grid="$q.screen.lt.md"
    :card-style="$q.screen.lt.md ? '' : 'box-shadow: none;'"
    color="primary"
    row-key="name"
    :hide-bottom="$q.screen.lt.md"
    :loading="loading"
  >
    <!-- TABLE STYLE SLOT -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="edit" :props="props">
          <q-btn
            round
            size="sm"
            color="primary"
            icon="edit"
            @click="
              $router.push({
                name: 'Edit Interaction',
                params: {
                  id: props.row.id,
                },
              })
            "
          ></q-btn>
        </q-td>
        <q-td key="status" :props="props">
          <q-chip
            :color="getColor(props.row.status)"
            :class="
              props.row.status === 'Pending' ? 'text-black' : 'text-white'
            "
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
        <q-td key="contactDate" :props="props">
          <q-icon
            class="q-mr-sm"
            size="20px"
            :name="props.row.typeOfContact"
          ></q-icon>
          {{ props.row.formattedDateOfContact }}
        </q-td>
        <q-td key="createdByName" :props="props">
          <div>
            {{ props.row.createdByName }}
          </div>
        </q-td>
        <q-td key="message" :props="props">
          <div
            style="
              min-width: 200px;
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
              min-width: 150px;
              overflow-wrap: break-word;
              white-space: initial;
            "
          >
            {{ props.row.actionTaken }}
          </div>
        </q-td>
        <q-td key="actionedBy" :props="props">
          <div v-if="props.row.actionedBy">
            {{ getProfileName(props.row.actionedBy) }}
          </div>
        </q-td>
        <q-td key="formattedDateActioned" :props="props">
          <div color="grey" dense v-if="props.row.formattedDateActioned">
            {{ props.row.formattedDateActioned }}
          </div>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:bottom-row>
      <q-tr>
        <q-td colspan="100%">
          <q-btn
            class="q-px-sm q-my-sm"
            icon="add"
            color="primary"
            dense
            @click="
              $router.push({
                name: 'Add Interaction',
                params: { id: contactId },
              })
            "
            >Add interaction</q-btn
          >
        </q-td>
      </q-tr>
    </template>

    <!-- GRID STYLE SLOT -->
    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card>
          <q-card-section
            :class="`bg-${getColor(props.row.status)} ${
              props.row.status == 'Pending' ? 'text-black' : 'text-white'
            }`"
          >
            <q-item>
              <q-item-section avatar>
                <q-icon
                  class="q-mr-sm"
                  :name="props.row.typeOfContact"
                ></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ props.row.formattedDateOfContact }}
                </q-item-label>
                <q-item-label
                  caption
                  :class="props.row.status == 'Pending' ? '' : 'text-white'"
                >
                  {{ props.row.status }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  color="white"
                  dense
                  class="text-black"
                  round
                  icon="edit"
                  @click="
                    $router.push({
                      name: 'Edit Interaction',
                      params: {
                        id: props.row.id,
                      },
                    })
                  "
                ></q-btn>
              </q-item-section>
            </q-item>
            <q-space></q-space>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="q-mb-sm">
              <q-item-label caption>Entered by</q-item-label>
              {{ props.row.createdByName }}
            </div>
            <div class="q-mb-sm">
              <q-item-label caption>Message</q-item-label>
              {{ props.row.message }}
            </div>
            <div class="q-mb-sm" v-if="props.row.actionTaken">
              <q-item-label caption>Action Taken</q-item-label>
              {{ props.row.actionTaken }}
            </div>
            <div class="q-mb-sm" v-if="props.row.actioned">
              <q-item-label caption>Actioned by</q-item-label>
              <span class="q-mr-sm text-weight-bold">{{
                getProfileName(props.row.actionedBy)
              }}</span
              >({{ props.row.formattedDateActioned }})
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>
  </q-table>
  <q-btn
    class="q-px-sm q-mx-xs q-my-md"
    v-if="$q.screen.lt.md"
    icon="add"
    color="primary"
    dense
    @click="
      $router.push({
        name: 'Add Interaction',
        params: { id: contactId },
      })
    "
    >Add interaction</q-btn
  >
</template>

<script>
import { ref, computed } from "vue";
import { date } from "quasar";
import { useStore } from "vuex";

export default {
  props: {
    contactHistory: {
      type: Array,
      required: true,
    },
    contactId: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const $store = useStore();
    const profiles = computed(() => $store.state.users.profiles);
    const getProfileName = (id) => {
      const profile = profiles.value.find((profile) => profile.id === id);
      return profile.displayName;
    };
    const formattedHistory = computed(() => {
      return props.contactHistory.map((h) => {
        const contactDate = new Date(h.contactDate);
        const dateActioned = new Date(h.dateActioned);
        const newHistory = {
          ...h,
          formattedDateOfContact: date.formatDate(
            contactDate,
            "DD-MMM-YY h:mm a"
          ),
          formattedDateActioned: date.formatDate(
            dateActioned,
            "DD-MMM-YY  h:mm a"
          ),
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
      },
      {
        name: "contactDate",
        required: true,
        label: "Type / Date",
        field: "contactDate",
        align: "left",
        sortable: true,
      },
      {
        name: "createdByName",
        required: true,
        label: "Entered By",
        field: "createdByName",
        align: "left",
        sortable: true,
        sort: (a, b) => {
          return a < b ? -1 : a > b ? 1 : 0;
        },
      },
      {
        name: "message",
        label: "Contact Message",
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
        name: "actionedBy",
        label: "Actioned By",
        field: "actionedBy",
        align: "left",
        sortable: true,
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

    const getColor = (val) => {
      if (val == "Reach Out") {
        return "purple";
      } else {
        return val == "Actioned" ? "positive" : "warning";
      }
    };
    return {
      loading: ref(false),
      columns,
      getColor,
      formattedHistory,
      getProfileName,
    };
  },
};
</script>
