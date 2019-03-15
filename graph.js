function initAddress() {
  $("ul li#d1").addClass("active");
  displayProg('d1')
}
window.onload = initAddress;

function displayProg(prog){

  var domainY;

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
  console.log(domainY)
  console.log(prog)
  
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


  var xscale = d3.scale.ordinal()
      .domain(data.slice(0,numBars).map(function (d) { return d.scene; }))
      .rangeBands([0, width]);

  var yscale = d3.time.scale()
      //.domain([new Date('2019-05-01T09:00:00'), new Date('2019-05-01T20:00:00')])
      .domain(domainY)
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

    var yOverview = d3.time.scale()
      .domain(domainY)
      //.domain([new Date('2019-05-01T09:00:00'), new Date('2019-05-01T20:00:00')])
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

    var displayed = d3.scale.quantize()
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
  
      animation = animations.selectAll("animations")
        .data(new_data[i].dataScene)
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

};


$('#myModal').on('show.bs.modal', function(d) {
  var animationSelected = ".info"+d.relatedTarget.id 

  var d = d3.select(animationSelected).data().pop();
  let modalTitle = d3.selectAll("h4.modal-title");
  modalTitle.text(d.title);
  let modalBody = d3.selectAll(".modal-body");
  modalBody.html("Category: " + d.category + "<br>" + "Scene: " + d.scene + "<br>" + "Start Date: " + d.date_start + "<br>" + "End Date: " + d.date_end);
})

