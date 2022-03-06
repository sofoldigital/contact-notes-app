<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AuthLayout",
});
</script>
