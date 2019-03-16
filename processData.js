//console.log(animations)

function getData(prog){

	var date, data = [], dataScene = [], date_tmp;

	if(prog == 'd1'){
    date = new Date('2019-05-01T08:00:00')
		date.setHours(0,0,0,0);
  }
  if(prog == 'd2'){
    date = new Date('2019-05-02T08:00:00')
		date.setHours(0,0,0,0);
  }
  if(prog == 'd3'){
    date = new Date('2019-05-03T08:00:00')
		date.setHours(0,0,0,0);
  }
  if(prog == 'd4'){
    date = new Date('2019-05-04T08:00:00')
		date.setHours(0,0,0,0);
  }
  if(prog == 'd5'){
    date = new Date('2019-05-05T08:00:00')
		date.setHours(0,0,0,0);
  }	
  for (var n in festi.scene) {
		dataScene = []
	  for( var x in festi.scene[n] ){
	    date_tmp = new Date(festi.scene[n][x].date_start);
			date_tmp.setHours(0,0,0,0);

			if(date_tmp.getTime() == date.getTime()){
				dataScene.push(festi.scene[n][x])
			}
	    	
	  }
	  data.push({scene:n, dataScene: dataScene })
	}
	
	return data;

}

/*var scenes = []
for (var n in animations) {
    scenes.push(n)
}

var allData1 = []
var allData2 = []
var allData3 = []
var allData4 = []
var allData5 = []

var data = []

var date1 = new Date('2019-05-01T08:00:00')
date1.setHours(0,0,0,0);

var date2 = new Date('2019-05-02T08:00:00')
date2.setHours(0,0,0,0);

var date3 = new Date('2019-05-03T08:00:00')
date3.setHours(0,0,0,0);

var date4 = new Date('2019-05-04T08:00:00')
date4.setHours(0,0,0,0);

var date5 = new Date('2019-05-05T08:00:00')
date5.setHours(0,0,0,0);

for (var n in festi.scene) {
	var dataScene = [];
	
    for( var x in festi.scene[n] ){
    	var date_tmp = new Date(festi.scene[n][x].date_start);
		date_tmp.setHours(0,0,0,0);
		if(date_tmp.getTime() == date1.getTime()){
    		allData1.push(festi.scene[n][x])
    		dataScene.push(festi.scene[n][x])
		}
    	if(date_tmp.getTime() == date2.getTime())
    		allData2.push(festi.scene[n][x])
    	if(date_tmp.getTime() == date3.getTime())
    		allData3.push(festi.scene[n][x])
    	if(date_tmp.getTime() == date4.getTime())
    		allData4.push(festi.scene[n][x])
    	if(date_tmp.getTime() == date5.getTime())
    		allData5.push(festi.scene[n][x])
    }
    data.push({scene:n, dataScene: dataScene })
}
console.log(data)*/
/*console.log(festi)
console.log(scenes)
console.log(allData1)*/






