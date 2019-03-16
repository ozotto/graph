var domainY;
var margin;
var marginOverview, selectorHeight, heightOverview;
var maxLength, barWidth
var displayed, isScrollDisplayed;
var numBars;
var colors = [];
var xscale, yscale, xAxis, yAxis, lineX;
var xOverview, yOverview;
var graph, diagram;
var animations, animation;
var data = [];

function loadGraph() {
  $("ul li#d1").addClass("active");
  initData('d1')
  initColors()
  displayProg('d1')
}
window.onload = loadGraph;

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

function initColors(){
  var colorScale = d3.scale.category20();
  for(var x = 0; x<data.length; x++){
    var colorData;
    colorData = { scene:data[x].scene, color: colorScale(Math.floor((Math.random() * 20) + 1)) };
    colors.push(colorData)
  }  
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
  if (isScrollDisplayed)
  {
    createOverview()
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
      .attr("data-target", "#animationModal")
      .attr("transform", function (d) { return "translate("+xscale(d.scene)+","+yscale(new Date(d.date_start))+")"; } )
      .datum(function (d){ return d })
  animation.append("rect")
    .attr("fill", function (d) { 
      var id = colors.map(function(e) { return e.scene; }).indexOf(d.scene);
      return colors[id].color
      
    })
    .attr("stroke", '#000')
    .attr("shape-rendering", 'crispEdges')
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

function createLinesHor(data, option){
  
  var x, top, h, css;
  if(option == 'graph'){
    x = xscale;
    top = -margin.top;
    h = height;
    css = 'linex';
  }
  if(option == 'overview'){
    x = xOverview;
    top = height + margin.bottom;
    h = top + selectorHeight;
    css = 'linex-sub';
  }

  for(var i = 0; i< data.length ; i++){
    lineX = diagram.append("line")
      .attr("class", css)
      .attr("x1", x(data[i].scene))
      .attr("y1", top)
      .attr("x2", x(data[i].scene))
      .attr("y2", h)
  }
  lineX = diagram.append("line")
      .attr("class", css)
      .attr("x1", width)
      .attr("y1", top)
      .attr("x2", width)
      .attr("y2", h)
}

function createOverview(){
  xOverview = d3.scale.ordinal()
                .domain(data.map(function (d) { return d.scene; }))
                .rangeBands([0, width]);

  yOverview = d3.time.scale()
    .domain(domainY)
    .range([0, heightOverview]);

  var overview = diagram.append("g")
    .attr("class", "overview")
    .attr("transform", "translate(0, "+(height + heightOverview)+")");
  
  d3.selectAll(".mover").remove()
  d3.selectAll(".animation-sub").remove()
  d3.selectAll(".linex-sub").remove()

  var subAnimation;
  for(var i = 0; i< data.length; i++){
    subAnimation = overview.selectAll("overview")
      .data(data[i].dataScene)
      .enter()
        .append("g")
        .attr("class", function(d){return "animation-sub sub"+d.id_seance })        
    subAnimation.append("rect")
        .attr("fill", function (d) { 
          var id = colors.map(function(e) { return e.scene; }).indexOf(d.scene);
          return colors[id].color
        })
        .attr("x", function (d) { return xOverview(d.scene) })
        .attr("y", function (d) { return yOverview(new Date(d.date_start)) })
        .attr("width", xOverview.rangeBand())
        .attr("height", function (d) { return yOverview( new Date(d.date_end) ) - yOverview( new Date(d.date_start) ) })

  }

  createLinesHor(data, 'overview')

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
  //width = 800 - margin.left - margin.right,
  width = ( parseInt(d3.select('#animationsGraph').style('width'), 10) ) - margin.left - margin.right
  height = 500 - margin.top - margin.bottom;

  marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
  selectorHeight = 40;
  heightOverview = 80 - marginOverview.top - marginOverview.bottom;

  maxLength = d3.max(data.map(function(d){ return d.scene.length}))
  barWidth = maxLength * 7;
  numBars = Math.round(width/barWidth);
  isScrollDisplayed = barWidth * data.length > width;

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
      .attr("class", "programmation")
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

  createLinesHor(dataSplice, 'graph')
  
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


$('#animationModal').on('show.bs.modal', function(d) {
  var animationSelected = ".info"+d.relatedTarget.id 

  var d = d3.select(animationSelected).data().pop();
  let modalTitle = d3.selectAll("h4.modal-title");
  modalTitle.text(d.title);
  let modalBody = d3.selectAll(".modal-body");
  modalBody.html("Category: " + d.category + "<br>" + "Scene: " + d.scene + "<br>" + "Start Date: " + d.date_start + "<br>" + "End Date: " + d.date_end);
})

d3.select(window).on('resize', resize); 

function resize() {
    
  width = ( parseInt(d3.select('#animationsGraph').style('width'), 10) ) - margin.left - margin.right
  
  maxLength = d3.max(data.map(function(d){ return d.scene.length}))
  barWidth = maxLength * 7;
  numBars = Math.round(width/barWidth);
  isScrollDisplayed = barWidth * data.length > width;

  var dataSplice = data.slice(0, numBars);

  d3.select(".programmation").attr("width", width + margin.left + margin.right)  

  xscale.rangeBands([0, width])
    .domain(dataSplice.map(function (d) { return d.scene; }))

  diagram.select(".x.axis").call(xAxis);  

  d3.selectAll(".animation").remove();
  d3.selectAll(".linex").remove();
  
  for(var i = 0; i< dataSplice.length; i++){
    createAnimation(dataSplice[i].dataScene)
  }
  if (isScrollDisplayed)
  {
    createOverview()
  }
  createLinesHor(dataSplice, 'graph')
}



