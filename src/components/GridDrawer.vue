<template>
  <div class="grid__container" style="height: 100%">
    <b-container fluid="false" style="height: 100%">
      <b-row style="height: 20px" align-v="stretch" :cols="cols" class="grid__row" v-for="row in rows" :key="row.id" no-gutters>
        <b-col style="background: black" class="grid__cell" v-for="col in cols" :key="col.id">
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'GridDrawer',
  props: {
    rows: {
      type: Number,
      required: true,
      validator: (val) => Number.isInteger(val) && val > 0
    },
    cols: {
      type: Number,
      required: true,
      validator: (val) => Number.isInteger(val) && val > 0
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>

</style>
