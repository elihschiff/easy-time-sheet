var app = new Vue({
  el: '#app',
  data: {
    daysOfTheWeek:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    workDayLength:8,

    data:  {
      "Monday":{
        "time_in": "",
        "lunch_start": "",
        "lunch_end": "",
        "time_out": ""
      }
    }
  },
  methods: {
    fillAsNow: function(day, timeSlot){
      var d = new Date();
      app.data[day][timeSlot] = d.getHours()+":"+d.getMinutes();
    }
  }
})
