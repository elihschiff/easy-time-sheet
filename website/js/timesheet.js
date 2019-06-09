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
      // app.save()
    },
    removeTime: function(times, time_slot, day_of_week){
      console.log("Removed time: " + times[time_slot].hour + ":" + times[time_slot].min + " from " + time_slot + " on " + day_of_week)
      times[time_slot].hour = null;
      times[time_slot].min = null;
      times.total.hour = null;
      // app.save()
    }
  },
  template:`
    <td v-if="times[time_slot].hour != null" style="width: 18%">
      <div class="input-group">
        <input class="form-control form-control-sm" type="text" v-model.number="times[time_slot].hour">
        <input class="form-control form-control-sm" type="text" v-model.number="times[time_slot].min">
        <div class="input-group-append">
          <button class="btn btn-sm btn-outline-secondary" type="button" v-on:click="removeTime(times,time_slot,day_of_week)">X</button>
        </div>
      </div>
    </td>
    <td v-else :id="day_of_week + '-' + time_slot" style="width: 18%">
      <button type="button" class="btn btn-primary btn-sm" v-on:click="fillAsNow(times,time_slot,day_of_week)">Set Now</button>
    </td>
  `
})

var app = new Vue({
  el: '#app',
  data: {
    daysOfTheWeek:["Monday","Tuesday","Wednesday","Thursday","Friday"],
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
    },
    username:"",
    loggedIn:false,
    saving:false
  },
  methods: {
    fillAsNow: function(day, timeSlot){
      var d = new Date();
      app.times[day][timeSlot] = zeroPad(d.getHours())+":"+zeroPad(d.getMinutes());
    },
    totalTime: function(currentDay){
      if(currentDay == null){
        currentDay = 99;
      }
      var totalh = 0;
      var totalm = 0;
      for(day in this.times){
        if(currentDay < 0){
          break;
        }
        if(this.times[day].total.hour == "Error"){
          return "Error";
        }
        totalh += this.times[day].total.hour;
        totalm += this.times[day].total.min;
        currentDay--;
      }
      return zeroPad(totalh)+":"+zeroPad(totalm);
    },
    totalTimeDay: function(day){
      if(day.time_in.hour == null || day.lunch_start.hour == null || day.lunch_end.hour == null || day.time_out.hour == null){
        return null;
      }
      if(day.time_in.hour > day.lunch_start.hour || day.lunch_start.hour > day.lunch_end.hour || day.lunch_end.hour > day.time_out.hour){
        day.total.hour = "Error";
        return "Error";
      }
      if((day.time_in.min > day.lunch_start.min && day.time_in.hour == day.lunch_start.hour)
        || (day.lunch_start.min > day.lunch_end.min && day.lunch_start.hour == day.lunch_end.hour)
        || (day.lunch_end.min > day.time_out.min && day.lunch_end.hour == day.time_out.hour)){
        day.total.hour = "Error";
        return "Error";
      }
      var morningTime = subtractTimes([day.lunch_start.hour,day.lunch_start.min],[day.time_in.hour,day.time_in.min])
      var nightTime = subtractTimes([day.time_out.hour,day.time_out.min],[day.lunch_end.hour,day.lunch_end.min])

      var totalTime = addTimes(morningTime,nightTime);
      day.total.hour = totalTime[0];
      day.total.min = totalTime[1];
      if(totalTime[0] == NaN || totalTime[1] == NaN){
        day.total.hour = "Error";
        return "Error";
      }
      return zeroPad(totalTime[0])+":"+zeroPad(totalTime[1]);
    },
    currentDOWNum: function(){
      var d = new Date();
      // return 3;
      return d.getDay();
    },
    currentDOW: function(){
      var d = new Date();
      var dayAsNum = d.getDay();

      if(this.currentDOWNum() >= this.daysOfTheWeek.length){
        return null;
      }
      return this.daysOfTheWeek[this.currentDOWNum()];
    },
    whenToLeaveToday: function(totalTimeWanted){
      if(totalTimeWanted == null){
        totalTimeWanted = [this.workDayLength,0];
      }
      if(this.currentDOWNum() >= this.daysOfTheWeek.length){
        return null;
      }
      var day = this.times[this.currentDOW()];
      if(day.time_in.hour == null || day.lunch_start.hour == null || day.lunch_end.hour == null || day.time_out.hour != null){
        return null;
      }

      var morningTime = subtractTimes([day.lunch_start.hour,day.lunch_start.min],[day.time_in.hour,day.time_in.min])
      var timeNeedToWork = subtractTimes(totalTimeWanted,morningTime);
      var endtime = addTimes(timeNeedToWork,[day.lunch_end.hour,day.lunch_end.min]);
      return zeroPad(endtime[0])+":"+zeroPad(endtime[1]);
    },
    whenToLeaveWeekTotal: function(){
      if(this.currentDOWNum() >= this.daysOfTheWeek.length){
        return null;
      }
      var totalTimeThisWeek = this.totalTime(this.currentDOW())
      if(totalTimeThisWeek == "Error"){
        return;
      }
      totalTimeThisWeek = totalTimeThisWeek.split(":");
      return this.whenToLeaveToday(subtractTimes([this.workDayLength*(this.currentDOWNum()+1),0],totalTimeThisWeek));
    },
    newLeaveTime: function(newTime){
      var day = this.times[this.currentDOW()];
      newTime = newTime.split(":");
      day.time_out.hour = newTime[0];
      day.time_out.min = newTime[1];
    },
    login: function(){
      if(!this.username){return;}
      $.post( "login?username="+this.username, function( data ) {
        console.log(data)
        if(data != "Not Found"){
          app.times = JSON.parse(data);
        }
        app.loggedIn = true;
      });
      localStorage.setItem("username",this.username);
    },
    save:function(force){
      if(app.saving && force!=true){
        return;
      }
      if(!app.username){return;}
      app.saving = true;
      setTimeout(function() {
        console.log("saving")
        $.post( "save?username="+app.username, {data:JSON.stringify(app.times)}, function(){
          app.saving = false;
          console.log("res")
        });
      }, 3000);
    }
  },
  mounted() {

  },
  mounted: function () {
    if (localStorage.username) {
      this.username = localStorage.username;
    }
    this.$watch('times', function () {
      app.save()
    }, {deep:true})
  }
})

function subtractTimes(t1,t2){
  var newtime = [0,0];
  newtime[0] = t1[0];

  newtime[1]=t1[1]-t2[1];
  if(newtime[1] < 0){
    newtime[0]--;
    newtime[1]=60+newtime[1];
  }
  newtime[0] -=t2[0];
  return newtime;
}

function addTimes(t1,t2){
  var newtime = [0,0];
  newtime[0] = t1[0];

  newtime[1] = t1[1]+ +t2[1];
  if(newtime[1] > 60){
    newtime[0]++;
    newtime[1]=newtime[1]-60;
  }
  newtime[0]+= +t2[0];
  return newtime;
}

function zeroPad(num) {
  return num.toString().padStart(2, "0");
}

window.onbeforeunload = function (e) {
  if(app.saving){
    var message = "Your confirmation message goes here.",
    e = e || window.event;
    // For IE and Firefox
    if (e) {
      e.returnValue = message;
    }

    // For Safari
    return message;
  }
};
