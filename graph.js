var domainY;
var margin;
var marginOverview, selectorHeight, heightOverview;
var maxLength, barWidth
var displayed, isScrollDisplayed;
var numBars;
var colors;
var xscale, yscale, xAxis, yAxis;
var graph, diagram;
var animations, animation;
var data = [];

function initAddress() {
  $("ul li#d1").addClass("active");
  initData('d1')
  displayProg('d1')
}
window.onload = initAddress;

function initData(prog){
  if(prog == 'd1'){
    domainY = [new Date('2019-05-01T09:00:00'), new Date('2019-05-01T20:00:00')]
  }
  if(prog == 'd2'){
    domainY = [new Date('2019-05-02T09:00:00'), new Date('2019-05-02T20:00:00')]
  }
  if(prog == 'd3'){
    domainY = [new Date('2019-05-03T09:00:00'), new Date('2019-05-03T20:00:00')]
  }
  if(prog == 'd4'){
    domainY = [new Date('2019-05-04T09:00:00'), new Date('2019-05-04T20:00:00')]
  }
  if(prog == 'd5'){
    domainY = [new Date('2019-05-05T09:00:00'), new Date('2019-05-05T20:00:00')]
  }
  data = getData(prog) 
}

function updateData(prog){
  initData(prog)

  numBars = Math.round(width/barWidth);
  isScrollDisplayed = barWidth * data.length > width;

  var dataSplice = data.slice(0, numBars);

  xscale.domain(dataSplice.map(function (d) { return d.scene; }))
  yscale.domain(domainY);

  diagram.select(".x.axis").call(xAxis);
  diagram.select(".y.axis").call(yAxis);

  d3.selectAll(".animation").remove();
  
  for(var i = 0; i< dataSplice.length; i++){
    createAnimation(dataSplice[i].dataScene)
  }

}

function createAnimation(data) {
  animation = animations.selectAll("animations")
    .data(data)
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

function createOverview(){
 var xOverview = d3.scale.ordinal()
                .domain(data.map(function (d) { return d.scene; }))
                .rangeBands([0, width]);

  var yOverview = d3.time.scale()
    .domain(domainY)
    .range([0, heightOverview]);

  var overview = diagram.append("g")
    .attr("class", "overview")
    .attr("transform", "translate(0, "+(height + heightOverview)+")");
  
  var subAnimation;
  for(var i = 0; i< data.length; i++){
    subAnimation = overview.selectAll("overview")
      .data(data[i].dataScene)
      .enter()
        .append("g")
        .attr("class", function(d){return "animation-sub"+d.id_seance })        
    subAnimation.append("rect")
        .attr("fill", function (d) { return colors(Math.floor((Math.random() * 20) + 1)) })
        .attr("x", function (d) { return xOverview(d.scene) })
        .attr("y", function (d) { return yOverview(new Date(d.date_start)) })
        .attr("width", xOverview.rangeBand())
        .attr("height", function (d) { return yOverview( new Date(d.date_end) ) - yOverview( new Date(d.date_start) ) })
  }

  displayed = d3.scale.quantize()
              .domain([0, width])
              .range(d3.range(data.length));

  diagram.append("rect")
    .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
    .attr("class", "mover")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", selectorHeight)
    .attr("width", Math.round(parseFloat(numBars * width)/data.length))
    .attr("pointer-events", "all")
    .attr("cursor", "ew-resize")
    .call(d3.behavior.drag().on("drag", display));

}

function displayProg(prog){

  margin = {top: 50, right: 20, bottom: 20, left: 40},
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
  selectorHeight = 40;
  heightOverview = 80 - marginOverview.top - marginOverview.bottom;

  maxLength = d3.max(data.map(function(d){ return d.scene.length}))
  barWidth = maxLength * 7;
  numBars = Math.round(width/barWidth);
  isScrollDisplayed = barWidth * data.length > width;

  colors = d3.scale.category20();

  var dataSplice = data.slice(0, numBars);

  xscale = d3.scale.ordinal()
      .domain(dataSplice.map(function (d) { return d.scene; }))
      .rangeBands([0, width]);

  yscale = d3.time.scale()
      .domain(domainY)
      .range([0, height]);

  xAxis = d3.svg.axis()
      .scale(xscale)
      .orient("top")
      .outerTickSize(0)
      .tickPadding(16);

  yAxis = d3.svg.axis()
      .scale(yscale)
      .orient("left")
      .tickFormat(d3.time.format("%H %M"))
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(10);

  graph = d3.select("#animationsGraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + selectorHeight)
    
  diagram = graph.append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")")
    
      diagram.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,0)")
        .call(xAxis);
     
      diagram.append("g")
        .attr("class", "y axis")
        .call(yAxis)

  animations = diagram.append("g")
      .attr("class", "animations");

  for(var i = 0; i< dataSplice.length; i++){
    createAnimation(dataSplice[i].dataScene)
  }

  if (isScrollDisplayed)
  {
    createOverview()
  }
}

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

  new_data = data.slice(nf, nf + numBars);

  xscale.domain(new_data.map(function (d) { return d.scene; }));

  diagram.select(".x.axis")
    .call(xAxis);

  d3.selectAll(".animation").remove();
  for(var i = 0; i< new_data.length; i++){
    createAnimation(new_data[i].dataScene)
  }

};


$('#myModal').on('show.bs.modal', function(d) {
  var animationSelected = ".info"+d.relatedTarget.id 

  var d = d3.select(animationSelected).data().pop();
  let modalTitle = d3.selectAll("h4.modal-title");
  modalTitle.text(d.title);
  let modalBody = d3.selectAll(".modal-body");
  modalBody.html("Category: " + d.category + "<br>" + "Scene: " + d.scene + "<br>" + "Start Date: " + d.date_start + "<br>" + "End Date: " + d.date_end);
})

