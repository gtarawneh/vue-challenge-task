<template>
  <div class="col">
    <div class="cell" :class="{'taken':!Table.available}">
      <div v-if="Table.available">
        <p>{{ Table.id }}</p>
        <p>Table Available</p>
        <p>(Capacity = {{ Table.capacity }})</p>
      </div>
      <div v-else>
        <p>{{ Table.id }}</p>
        <p>Occupied by {{ Table.noPeople }}</p>
        <p>(free in {{ Table.durationTime }})</p>
        <button class="del" @click="evict(Table.id)">Evict</button>
      </div>
    </div>
  </div>
</template>
<script>
import { wait } from  '../../assets/js/utils';
export default {
  name: 'x-table',
  data(){
      return{
          Table: this.table
      }
  },
  props: {
    table: Object,
  },
  methods: {
      evict(id){
        this.$parent.$emit("force-evict", id);
        this.Table = {
            ...this.Table,
            fussMsg:'',
            durationTime:null,
            occupants: 0
        }
      },
      async untilAvailable(){
          await wait(this.table.durationTime);
          return true;
      },
      bookTable(formParty, callback){
          this.Table  = {
              ...this.Table,
            ...formParty
          };
          this.Table.available = false;
        this.timerInterval =  setInterval(() => {
              if(this.Table.durationTime <= 0){
                  clearInterval(this.timerInterval);
                   this.Table.available = true;
              }
              else{
              this.Table.durationTime -= 1;
              }
              if(callback){
                  callback(this.Table)
              }
          }, 1000);
      }
  },
}
</script>
<style scoped>
.table {
  color: #673ab7;
}
.cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 150px;
  border: solid 3px #d7c8eb;
  text-align: center;
  margin: 1rem;
  height: calc(100% - 1rem);
  box-sizing: border-box;
}
.cell.taken {
  background: #faf4fb;
}
.cell .del {
  background: #e2c1e8;
  color: inherit;
  border: 0;
  padding: 0.5rem 2rem;
}
</style>
