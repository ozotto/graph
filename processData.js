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

//Source
/*
	SPECTRUM ASSIGNMENTS (Bon exemple)
		http://plnkr.co/edit/iHVbGY8fkNRWeUvs7Z8c?p=preview
	D3.js chart with panning and paging
		http://bl.ocks.org/nicolashery/9627333
	Scrollable bar charts 
		http://bl.ocks.org/lmatteis/895a134f490626b0e62796e92a06b9c1
	Scrollable Bar Graph
		https://bl.ocks.org/johnnygizmo/3b16c4aa235ea9c0588d1bb26afad79a
	Scroll Bar Chart		
		http://bl.ocks.org/cse4qf/95c335c73af588ce48646ac5125416c6
	Brushable Horizontal Bar Chart
		http://bl.ocks.org/nbremer/4c015860931fb6a13afc7bac51f40b43	
	Responsive
		http://eyeseast.github.io/visible-data/2013/08/28/responsive-charts-with-d3/	
*/





