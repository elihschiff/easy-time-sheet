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
    },
    removeTime: function(times, time_slot, day_of_week){
      times[time_slot].hour = null;
      times[time_slot].min = null;
    }
  },
  template:`
    <td v-if="times[time_slot].hour != null" style="width: 20%">
      <div class="input-group">
        <input class="form-control form-control-sm" type="text" v-model="times[time_slot].hour">
        <input class="form-control form-control-sm" type="text" v-model="times[time_slot].min">
        <div class="input-group-append">
          <button class="btn btn-sm btn-outline-secondary" type="button" v-on:click="removeTime(times,time_slot,day_of_week)">X</button>
        </div>
      </div>
    </td>
    <td v-else :id="day_of_week + '-' + time_slot" style="width: 20%">
      <button type="button" class="btn btn-primary btn-sm" v-on:click="fillAsNow(times,time_slot,day_of_week)">Set Now</button>
    </td>
  `
})

var app = new Vue({
  el: '#app',
  data: {
    workDayLength:8,
    times:  {
      "Monday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null},
        "total":{hour:null,min:null}
      },
      "Tuesday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null},
        "total":{hour:null,min:null}
      },
      "Wednesday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null},
        "total":{hour:null,min:null}
      },
      "Thursday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null},
        "total":{hour:null,min:null}
      },
      "Friday":{
        "time_in": {hour:null,min:null},
        "lunch_start": {hour:null,min:null},
        "lunch_end": {hour:null,min:null},
        "time_out": {hour:null,min:null},
        "total":{hour:null,min:null}
      },
    }
  },
  methods: {
    fillAsNow: function(day, timeSlot){
      var d = new Date();
      app.times[day][timeSlot] = d.getHours()+":"+d.getMinutes();
    },
    totalTime: function(times){
      var totalh = 0;
      var totalm = 0;
      for(day in times){
        console.log(day)
        totalh += times[day].total.hour;
        totalm += times[day].total.min;
      }
      return totalh+":"+totalm;
    },
    totalTimeDay: function(day){
      if(day.time_in.hour == null || day.lunch_start.hour == null || day.lunch_end.hour == null || day.time_out.hour == null){
        return null;
      }
      var hoursWorked = (day.lunch_start.hour - day.time_in.hour) + (day.time_out.hour - day.lunch_end.hour);
      var minWorked = (day.lunch_start.min - day.time_in.min) + (day.time_out.min - day.lunch_end.min);
      hoursWorked += Math.floor(minWorked/60)
      minWorked %= 60;
      day.total.hour = hoursWorked;
      day.total.min = minWorked;
      return hoursWorked+":"+minWorked;
    }
  }
})
