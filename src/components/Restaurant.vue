<template>
  <div class="restaurant">
    <div class="table">
      <div class="container">
        <div class="row">
          <div :key="table.id" v-for="table in tables">
            <Table :key="table.id" :table="table" ref="table" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from './restaurant/Table.vue'
import { wait } from  '../assets/js/utils'

export default {
  name: 'x-restaurant',
  props: {
    tables: Array,
  },
  components: {
    Table
  },
  methods: {
    async awaitTable(capacity){
   // find table with the provided capacity
    let table = this.findTable(capacity);
    while(!table){
      let shortestTableWaitTime = this.findTable(capacity,false);
      let tableIndex = this.tables.findIndex(table => table.id === shortestTableWaitTime.id);
     await this.$refs.table[tableIndex].untilAvailable();
     await wait(500) //to be on the safe side in case of performance issues and delays
      table = this.findTable(capacity);
    }
     return table;
    },
    findTable(capacity, checkIfAvailable = true){
      // return the available table with given capacity.
      let tables = [...this.tables];
      let table = null;
      if(checkIfAvailable){
        // return the available table with given capacity if available.
        //sort array to find minimum capacity in which minCapacity >= capacity
        table = tables.sort((a,b) => a.capacity - b.capacity).find(table => table.capacity >= capacity &&  table.available)
      }
      else {
        // return the available table with given capacity doest not mater if available or not.
        // sort the array based on shortest amount of time remaning to be available.
        table = tables.sort((a,b) => a.durationTime - b.durationTime).find(table => table.capacity >= capacity)
      }
    return table;
    },
    bookTable(tableId, formParty, callback){
      //book a table and send call back to the table component to sync the data with main app data
    let tableIndex = this.tables.findIndex(table => table.id === tableId);
    this.$refs.table[tableIndex].bookTable(formParty, callback);
    }
  }
}
</script>
<style scoped></style>
