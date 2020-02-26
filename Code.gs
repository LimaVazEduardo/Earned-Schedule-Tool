function doGet() {
  return HtmlService.createTemplateFromFile('index.html').evaluate().setTitle("Earned Schedule Tool");
}

function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}

function calcEarnedSchedule(data){
  Logger.log(data);
  var m1 = data.m1*1;
  var m2 = data.m2*1;
  var m3 = data.m3*1;
  var m4 = data.m4*1;
  var m5 = data.m5*1;
  var m6 = data.m6*1;
  
  var m1_acc = m1;
  var m2_acc = m1 + m2;
  var m3_acc = m1 + m2 + m3;
  var m4_acc = m1 + m2 + m3 + m4;
  var m5_acc = m1 + m2 + m3 + m4 + m5;
  var m6_acc = m1 + m2 + m3 + m4 + m5 + m6;
  
  var acc = [m1_acc, m2_acc, m3_acc, m4_acc, m5_acc, m6_acc];  //Planned Values accumulated
  Logger.log(["acc: ",acc]);
  
  var work = data.work*1;
  Logger.log(["work: ",work]);
  
  var ev = (work/100) * m6_acc;
  Logger.log(["ev: ",ev]);
  
  var month = data.month*1;
  Logger.log(["month: ",ev]);
  
  var pv_acc;
  if(month == 1){
    pv_acc = acc[0];
  }else if(month == 2){
    pv_acc = acc[1];
  }else if(month == 3){
    pv_acc = acc[2];
  } else if(month == 4){
    pv_acc = acc[3];
  }else if(month == 5){
    pv_acc = acc[4];
  }else if(month >= 6){
    pv_acc = acc[5];
  }
  
  var spi = ev / pv_acc;
  var spi_perc = spi * 100;
  var sv1 = ev - pv_acc;
    
  
  for(var i = 0; i <= acc.length; i++){
    if(ev < acc[i]){
      if(i == 0){        // Exception Periodo = 0 **** Earned Value is smaller than the first Planned Value
        var acc_1   = 0;  // Período 0 = tem PV igual a 0 
        var acc     = acc[i];
        var es_int  = 0;                                 //Earned Schedule Interger Part
        var es_frac = (ev - acc_1) / (acc - acc_1);  //Earned Schedule Decimal Part
        Logger.log(["Aqui => acc_1: ",acc_1, "acc = acc[i]: ", acc, "es_int: ", es_int, "es_frac: ", es_frac]);
        break
      }
      var acc_1   = acc[i-1];
      var es_int  = i;
      var es_frac = (ev - acc[i-1]) / (acc[i] - acc[i-1]);
      var acc     = acc[i];
      break;
    }
    else if(ev == m6_acc){  // ****** Earned Value = 100%
      Logger.log(["Ev == acc[i]: ", acc[i]]);
      var acc_1   = '';
      var es_int  = '';
      var es_frac = '';
      var acc     = '';
      break;
    }
  }
  Logger.log(["Aqui depois => acc_1: ",acc_1, "acc = acc[i]: ", acc, "es_int: ", es_int, "es_frac: ", es_frac]);
  
  if(ev != m6_acc){
    var e_schedule   = es_int + es_frac;
    var sch_variance = e_schedule - month;
  }else{ // Earned Value = 100%
    var e_schedule   = month;
    var sch_variance = e_schedule - month;
  }

  
  if(sch_variance >= 0){
    if(sch_variance == 0){ 
      var status = " On schedule";
    }else{
      var status = " Ahead of schedule";
    }
  }else{
    var status = " Behind schedule";
  }
  
  Logger.log([m1_acc,
          m2_acc,
          m3_acc,
          m4_acc,
          m5_acc,
          m6_acc,
          ev,
          es_int,
          es_frac,
          e_schedule,
          month,
          sch_variance,
          status,
          work,
          acc_1, 
          acc,
          spi,
          sv1,
          pv_acc,
          spi_perc
          ]);
  
  return [m1_acc,
          m2_acc,
          m3_acc,
          m4_acc,
          m5_acc,
          m6_acc,
          ev,
          es_int,
          es_frac,
          e_schedule,
          month,
          sch_variance,
          status,
          work,
          acc_1, 
          acc,
          spi,
          sv1,
          pv_acc,
          spi_perc
          ];
  
}// close calcEarnedSchedule
