<template>
  <div id="app">
    <div class="container">
      <h1>New Party</h1>
      <p>
        Fill the following form to allocate a table to party that is waiting to
        be seated
      </p>
      <form @submit="handleFindTable">
        <input
          type="number"
          ref="occupants"
          name="occupants"
          placeholder="Number of people (non-zero positive integer)"
          required
        />
        <input
          type="number"
          ref="durationTime"
          name="durationTime"
          placeholder="Duration of stay in seconds (positive number)"
          required
        />
        <input
          type="text"
          ref="fussMsg"
          name="fussMsg"
          placeholder="Fuss message if evicted (text)"
          required
        />
        <button type="submit" class="btn">Add</button>
      </form>
    </div>
    <Restaurant
      :tables="tables"
      v-on:force-evict="handleEvict"
      ref="restaurant"
    />
  </div>
</template>

<script>
import Restaurant from './components/Restaurant.vue'

export default {
  name: 'App',
  components: {
    Restaurant
  },
  data() {
    return {
      tables: [
        {id: 1,capacity: 10, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 2,capacity: 8, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 3,capacity: 10, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 4,capacity: 6, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 5,capacity: 2, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 6,capacity: 6, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 7,capacity: 4, available: true, occupants: 0, durationTime: null, fussMsg: ""},
        {id: 8,capacity: 12, available: true, occupants: 0, durationTime: null, fussMsg: ""}
      ],
    }
  },
  methods: {

    // Form submitting function
   async handleFindTable(e) {
      e.preventDefault();

      // Store form results in a new Object
      let formParty = {
        occupants: this.$refs.occupants.value,
        durationTime: this.$refs.durationTime.value,
        fussMsg: this.$refs.fussMsg.value
      }
    let restaurant =  this.$refs.restaurant;
      // Input validation
      if(formParty.occupants <= 0 || formParty.durationTime <= 0 ){
        alert("valid input please try again");
      }
      else {
        let table = restaurant.findTable(formParty.occupants);
        if(!table){
          //show waiting timer
          alert('please wait');
          table = await restaurant.awaitTable(formParty.occupants);
          console.log('something')
          // hide waiting timer
        }
        this.bookTable(table.id,formParty.occupants,formParty.fussMsg,formParty.durationTime);

      // Reset the form inputs
       this.$refs.occupants.value = null;
       this.$refs.durationTime.value = null;
       this.$refs.fussMsg.value = null;
      }

    },
    bookTable(tableId, occupants, fussMsg, durationTime){
      //this function used to book a room by its id.
         let restaurant =  this.$refs.restaurant;
         restaurant.bookTable(tableId, { occupants, fussMsg, durationTime},(newTable) => this.updateTable(newTable))
    },
    // Evict table
    handleEvict(id){
       let tableIndex = this.tables.findIndex(table => table.id === id);
      if(tableIndex > -1){
         alert(this.tables[tableIndex].fussMsg);
      this.tables[tableIndex] = {
        ...this.tables[tableIndex],
        fussMsg:'',
        durationTime:null,
        occupants:0,
        available:true
      }
      }
    },
    updateTable(newTable){
      //sync the table component data and time with the parent app state
      let tableIndex = this.tables.findIndex(table => table.id === newTable.id);
      if(tableIndex > -1){
        this.tables[tableIndex] = {
          ...newTable
        }
      }
    }
  }
}
</script>

<style>
#app {
}
.container {
  width: 80%;
  max-width: 900px;
  margin: 0 auto;
}
.row {
  display: flex;
  flex-wrap: wrap;
}
.col {
  flex: 0 0 25%;
  box-sizing: border-box;
}
input {
  display: block;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
  border: solid 3px gainsboro;
  font-weight: bold;
}
input::placeholder {
  color: gainsboro;
}
.btn {
  background: gainsboro;
  border: 0;
  padding: 1rem 3rem;
  margin-bottom: 2rem;
}
</style>
