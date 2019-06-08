Vue.component('time-cell', {
  props: ['times', 'time_slot', 'day_of_week'],
  data: function () {
    return {
      // hour:null,
      // min:null
    }
  },
  methods: {
    fillAsNow: function(times, time_slot, day_of_week){
      var d = new Date();
      // times[time_slot] = d.getHours()+":"+d.getMinutes();
      times[time_slot].hour = d.getHours();
      times[time_slot].min = d.getMinutes();
    }
  },
  template:`
    <td v-if="times[time_slot].hour">
      <div class="input-group">
        <select class="custom-select" v-model="times[time_slot].hour">
          <option v-for="i in 24" :value="i-1">{{i-1}}</option>
        </select>
        <select class="custom-select" v-model="times[time_slot].min">
          <option v-for="i in 60" :value="i-1">{{i-1}}</option>
        </select>
      </div>
    </td>
    <td v-else :id="day_of_week + '-' + time_slot">
      <button type="button" class="btn btn-primary btn-sm" v-on:click="fillAsNow(times,time_slot,day_of_week)">Set Now</button>
    </td>
  `
})

var app = new Vue({
  el: '#app',
  data: {
    daysOfTheWeek:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workDayLength:8,

    data:  {
      "Monday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null}
      },
      "Tuesday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null}
      },
      "Wednesday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null}
      },
      "Thursday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null}
      },
      "Friday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null}
      },
    }
  },
  methods: {
    fillAsNow: function(day, timeSlot){
      var d = new Date();
      app.data[day][timeSlot] = d.getHours()+":"+d.getMinutes();
    },
    eightHourDay: function(day){

    }
  }
})
