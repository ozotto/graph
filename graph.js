/*var data=[{"date":new Date(2012,0,1), "value": 3, "titre" : "scene1" },
            {"date":new Date(2012,0,3), "value": 2, "titre" : "scene2"},
            {"date":new Date(2012,0,12), "value": 33, "titre" : "scene3"},   
            {"date":new Date(2012,0,21), "value": 13, "titre" : "scene4"},
            {"date":new Date(2012,0,30), "value": 23, "titre" : "scene5"}];*/


var margin = {top: 50, right: 20, bottom: 20, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
var selectorHeight = 40;
var heightOverview = 80 - marginOverview.top - marginOverview.bottom;

var maxLength = d3.max(data.map(function(d){ return d.scene.length}))
var barWidth = maxLength * 7;
var numBars = Math.round(width/barWidth);
var isScrollDisplayed = barWidth * data.length > width;

var colors = d3.scale.category20();


// Parse the date / time
//var	parseDate = d3.time.format("%Y-%m").parse;

var xscale = d3.scale.ordinal()
    //.domain(data.map(function(d) { return d.titre; }))
    //.domain(scenes.map(function(d) { return d; }))
    .domain(data.slice(0,numBars).map(function (d) { return d.scene; }))
    .rangeBands([0, width]);

var yscale = d3.time.scale()
    .domain([new Date('2019-05-01T09:00:00'), new Date('2019-05-01T20:00:00')])
    .range([0, height]);

var xAxis = d3.svg.axis()
    .scale(xscale)
    .orient("top")
    .outerTickSize(0)
    .tickPadding(16);

var yAxis = d3.svg.axis()
    .scale(yscale)
    .orient("left")
    .tickFormat(d3.time.format("%H %M"))
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var graph = d3.select("#animationsGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + selectorHeight)
  
var diagram = graph.append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")")
  
    diagram.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,0)")
      .call(xAxis);
   
    diagram.append("g")
      .attr("class", "y axis")
      .call(yAxis)

var animations = diagram.append("g")
    .attr("class", "animations");

var dataSplice = data.slice(0, numBars);

var animation;

for(var i = 0; i< dataSplice.length; i++){
  
  animation = animations.selectAll("animations")
    .data(dataSplice[i].dataScene)
    .enter()
      .append("g")
      .attr("id", function(d){return d.id_seance})
      .attr("class", function(d){return "animation info"+d.id_seance })
      .attr("data-toggle", "modal")
      .attr("data-target", "#myModal")
      .attr("transform", function (d) { return "translate("+xscale(d.scene)+","+yscale(new Date(d.date_start))+")"; } )  
      .datum(function (d){ return d })
  animation.append("rect")
        .attr("fill", function (d) { return colors(Math.floor((Math.random() * 20) + 1)) })
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xscale.rangeBand())
        .attr("height", function (d) { return yscale( new Date(d.date_end) ) - yscale( new Date(d.date_start) ) })
  animation.append("text")
          .style("fill", "#fff")
          .attr("y", 16 )
          .attr("x", 5 )
          .text(function (d) {return d.title; });
}

if (isScrollDisplayed)
{
  var xOverview = d3.scale.ordinal()
                  .domain(data.map(function (d) { return d.scene; }))
                  .rangeBands([0, width]);
  /*yOverview = d3.scale.linear().range([heightOverview, 0]);
  yOverview.domain(yscale.domain());*/

  var yOverview = d3.time.scale()
    .domain([new Date('2019-05-01T09:00:00'), new Date('2019-05-01T20:00:00')])
    .range([0, heightOverview]);


  var overview = diagram.append("g")
    .attr("class", "overview")
    .attr("transform", "translate(0, "+heightOverview+")");
  
  var subAnimation;
  for(var i = 0; i< data.length; i++){
    subAnimation = diagram.selectAll("overview")
      .data(data[i].dataScene)
      .enter()
        .append("g")
        .attr("id", function(d){return d.id_seance})
        .attr("class", function(d){return "animation-sub info"+d.id_seance })
        //.append("g")
    subAnimation.append("rect")
        //.classed('subBar', true)
        .attr("fill", function (d) { return colors(Math.floor((Math.random() * 20) + 1)) })
        .attr("x", function (d) { return xOverview(d.scene) })
        .attr("y", function (d) { return yOverview(new Date(d.date_start)) })
        .attr("width", xOverview.rangeBand())
        .attr("height", function (d) { return yOverview( new Date(d.date_end) ) - yOverview( new Date(d.date_start) ) })
  }

/*  var subBars = diagram.selectAll('.subBar')
      .data(data)

  subBars.enter().append("rect")
      .classed('subBar', true)
      .attr({
          height: function (d) { 
            return heightOverview - yOverview(new Date(d.date_start));
            
          },
          width: function(d) {
            return xOverview.rangeBand()
          },
          x: function(d) {
            return xOverview(d.scene);
          },
          y: function(d) {
              return height + heightOverview + yOverview(new Date(d.date_start))
          }
      })*/

/*  var displayed = d3.scale.quantize()
              .domain([0, width])
              .range(d3.range(scenes.length));

  diagram.append("rect")
    .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
    .attr("class", "mover")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", selectorHeight)
    .attr("width", Math.round(parseFloat(numBars * width)/allData1.length))
    .attr("pointer-events", "all")
    .attr("cursor", "ew-resize")
    .call(d3.behavior.drag().on("drag", display));*/

}
/*
function display () {
    var x = parseInt(d3.select(this).attr("x")),
        nx = x + d3.event.dx,
        w = parseInt(d3.select(this).attr("width")),
        f, nf, new_data, rects;

    if ( nx < 0 || nx + w > width ) return;

    d3.select(this).attr("x", nx);

    f = displayed(x);
    nf = displayed(nx);

    if ( f === nf ) return;

    new_data = allData1.slice(nf, nf + numBars);

    xscale.domain(new_data.map(function (d) { return d.scence; }));
    diagram.select(".x.axis").call(xAxis);

    rects = animations.selectAll("g")
      .data(new_data, function (d) {return d.scene; });

     rects.attr("x", function (d) { return xscale(d.scene); });

     rects.enter().append("g")
      .attr("class", "animation")
      .attr("data-toggle", "modal")
      .attr("data-target", "#myModal")
      .attr("transform", function (d) { return "translate("+xscale(d.scene)+","+yscale(new Date(d.date_start))+")"; } )  
      .append("rect")
        .attr("class", "info")
        .style("fill", "steelblue")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xscale.rangeBand())
        .attr("height", function (d) { return yscale( new Date(d.date_end) ) - yscale( new Date(d.date_start) ) })
        .datum(function (d){ return d })
          .append("text")
          .style("fill", "#fff")
          .attr("y", 16 )
          .attr("x", 5 )
          .text(function (d) {return d.title; });

    rects.exit().remove();
};*/

/*animations.selectAll("g")
    .data(data.slice(0, numBars), function (d) {return d.scene; })
    .enter()
      .append("g")
      .attr("class", "animation")
      .attr("data-toggle", "modal")
      .attr("data-target", "#myModal")
      .attr("transform", function (d) { return "translate("+xscale(d.scene)+","+yscale(new Date(d.date_start))+")"; } )  
      .append("rect")
        .attr("class", "info")
        .style("fill", "steelblue")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xscale.rangeBand())
        .attr("height", function (d) { return yscale( new Date(d.date_end) ) - yscale( new Date(d.date_start) ) })
        .datum(function (d){ return d })
          .append("text")
          .style("fill", "#fff")
          .attr("y", 16 )
          .attr("x", 5 )
          .text(function (d) {return d.title; });*/

/*animations.selectAll("g")
    .data(allData1.slice(0, numBars), function (d) {return d.title; })
    .enter()
      .append("g")
      .attr("class", "animation")
      .attr("data-toggle", "modal")
      .attr("data-target", "#myModal")
      .attr("transform", function (d) { return "translate("+xscale(d.scene)+","+yscale(new Date(d.date_start))+")"; } )  
      .append("rect")
        .attr("class", "info")
        .style("fill", "steelblue")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", xscale.rangeBand())
        .attr("height", function (d) { return yscale( new Date(d.date_end) ) - yscale( new Date(d.date_start) ) })
        .datum(function (d){ return d })
          .append("text")
          .style("fill", "#fff")
          .attr("y", 16 )
          .attr("x", 5 )
          .text(function (d) {return d.title; });*/

/*bars.selectAll("rect")
    .data(allData1.slice(0, numBars), function (d) {return d.title; })
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.scene); })
    .attr("y", function (d) { return y( new Date(d.date_start) ); })
    .attr("width", x.rangeBand())
    .attr("height", function (d) { return y( new Date(d.date_end) ) - y( new Date(d.date_start) ) });*/    

/*
var animation2 = diagram.append("g")
      .attr("class", "animation")
      .attr("data-toggle", "modal")
      .attr("data-target", "#myModal")
      .attr("transform", "translate("+x("La CICAD")+","+y( new Date('2019-05-01T11:00:00') )+")")  
        animation2.append("rect")
        .attr("class", "info")
        .style("fill", "steelblue")
        .attr("x", 0 )
        .attr("width", x.rangeBand())
        .attr("y", 0 )
        .attr("height", ( y( new Date('2019-05-01T12:00:00')) -   y( new Date('2019-05-01T11:00:00'))  ))
        .datum(data)
        animation2.append("text")
        .style("fill", "#fff")
        .attr("y", 16 )
        .attr("x", 5 )
        .text("hello hello hello hello hello hello ")
  
diagram.append("rect")
      .style("fill", "red")
      .attr("x", x("L'apostrophe") )
      .attr("width", x.rangeBand())
      .attr("y", y( new Date('2019-05-01T19:00:00') ) )
      .attr("height", ( y( new Date('2019-05-01T20:00:00')) -   y( new Date('2019-05-01T19:00:00'))  ));

diagram.append("rect")
      .style("fill", "red")
      .attr("x", x("La scène BD") )
      .attr("width", x.rangeBand())
      .attr("y", y( new Date('2019-05-01T10:00:00') ) )
      .attr("height", ( y( new Date('2019-05-01T11:00:00')) -   y( new Date('2019-05-01T10:00:00'))  ));

diagram.append("rect")
      .style("fill", "steelblue")
      .attr("x", x("La scène suisse") )
      .attr("width", x.rangeBand())
      .attr("y", y( new Date('2019-05-01T15:00:00') ) )
      .attr("height", ( y( new Date('2019-05-01T17:00:00')) -   y( new Date('2019-05-01T15:00:00'))  ));

diagram.append("rect")
      .style("fill", "red")
      .attr("x", x("La scène des imaginaires") )
      .attr("width", x.rangeBand())
      .attr("y", y( new Date('2019-05-01T08:00:00') ) )
      .attr("height", ( y( new Date('2019-05-01T09:00:00')) -   y( new Date('2019-05-01T08:00:00'))  ));

diagram.append("line")
     .attr("x1", x("scene2"))
     .attr("y1", 0)
     .attr("x2", x("scene2"))
     .attr("y2", height)
     .attr("stroke-width", 1)
     .attr("stroke", "#000")
     .style("opacity", 0.2);

diagram.append("line")
     .attr("x1", x("scene3"))
     .attr("y1", 0)
     .attr("x2", x("scene3"))
     .attr("y2", height)
     .attr("stroke-width", 1)
     .attr("stroke", "#000")
     .style("opacity", 0.2);

diagram.append("line")
     .attr("x1", x("scene4"))
     .attr("y1", 0)
     .attr("x2", x("scene4"))
     .attr("y2", height)
     .attr("stroke-width", 1)
     .attr("stroke", "#000")
     .style("opacity", 0.2);

diagram.append("line")
     .attr("x1", x("scene5"))
     .attr("y1", 0)
     .attr("x2", x("scene5"))
     .attr("y2", height)
     .attr("stroke-width", 1)
     .attr("stroke", "#000")
     .style("opacity", 0.2);

diagram.append("line")
     .attr("x1", width)
     .attr("y1", 0)
     .attr("x2", width)
     .attr("y2", height)
     .attr("stroke-width", 1)
     .attr("stroke", "#000")
     .style("opacity", 0.2);
     */          

  /*svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");*/

/*
d3.csv("bar-data.csv", function(error, data) {

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
	
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

});
*/

 $('#myModal').on('show.bs.modal', function(d) {
  var animationSelected = ".info"+d.relatedTarget.id 

  var d = d3.select(animationSelected).data().pop();
  let modalTitle = d3.selectAll("h4.modal-title");
  modalTitle.text(d.title);
  let modalBody = d3.selectAll(".modal-body");
  modalBody.html("Category: " + d.category + "<br>" + "Scene: " + d.scene + "<br>" + "Start Date: " + d.date_start + "<br>" + "End Date: " + d.date_end);
      //console.log(d, "operator: " + d.Operator + "   Country: " + d.Country);
  })

