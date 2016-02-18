function circlePack(selectionID, data) {
    var packChart, packG;

    d3.select(selectionID)
      .attr("height", 2400)
      .attr("width", 1200)
     // .style("background", "white");

    var hScale = function(d) {return Math.round(d / 15)};

    var oScale = function(d) {return Math.round(d / 10)};

    var lScale = function(d) {return Math.round(d / 20)};

    var dataHash = {};
    var newData = []

    data = data.forEach(d => {
      var datapoint = {};
      datapoint.rh = hScale(d.h)
      datapoint.rs = oScale(d.s)
      datapoint.rl = lScale(d.l)

      if (datapoint.rl === 0) {
        datapoint.rh = 0;
        datapoint.rs = 0;
        datapoint.rl = 0;
      }


      if (datapoint.rl === 5) {
        datapoint.rh = 0;
        datapoint.rs = 0;
        datapoint.rl = 5;
      }

      datapoint.group = d.group;
      datapoint.value = 1;
      var hashString = datapoint.group + "-" + datapoint.rh +"-" + datapoint.rs +"-" +datapoint.rl;
      datapoint.key = hashString;

      if (dataHash[hashString]) {
        dataHash[hashString].value = dataHash[hashString].value + 1;
      }
      else {
        dataHash[hashString] = datapoint;
        newData.push(datapoint);
      }
    });

    var nestedData = d3.nest()
      .key(d => d.group)
      .key(d => d.rl)
      .entries(newData);

      var packedData = [];


      var max = d3.max(nestedData.map(d => d3.sum(d.values.map(p => d3.sum(p.values.map(q => q.value))))))
      var colorAuthority = ["red","orange","yellow","green","cyan","blue","purple","magenta","red"]

      colorAuthority.forEach(authColor => {
        var d = nestedData.filter(p => p.key === authColor)[0];
        if (d) {
          var total = d3.sum(d.values.map(p => d3.sum(p.values.map(q => q.value))))
          var packSize = total / max * 400;
          packSize = 400

          packChart = d3.layout.pack();
          packChart.size([packSize,packSize])
            .children(function(d) {return d.values})
            .value(function(d) {return d.value});

          var thisPackedColor = packChart(d);
          packedData.push(thisPackedColor);
        }
        else {
          packedData.push([]);
        }
      })

      packedData.forEach((packedColor, packedIndex) => {

        packedColor = packedColor.filter(d => d.depth === 2)

        d3.select(selectionID)
        .selectAll("g." + colorAuthority[packedIndex])
        .data([0])
        .enter()
        .append("g")
        .attr("class", colorAuthority[packedIndex])
        .attr("transform", "translate(" + ((packedIndex%3 * 400)) + "," + ((Math.floor(packedIndex/3) * 400) + 1200) + ")")
        .append("text")
        .attr("y", 20)
        .attr("x", 200)
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .text(colorAuthority[packedIndex])

        packG = d3.select(selectionID).select("g." + colorAuthority[packedIndex]);

        packG
        .selectAll("circle")
        .data(packedColor, d => d.key)
        .enter()
        .append("circle")
        .attr("r", 1)
        .attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y})
        .style("fill", fillCircle2Level)
        .style("stroke",
          function(d){

            if (d.rl == 0){
              return "white"
            }
            return "";
          }
         )

        packG
        .selectAll("circle")
        .transition()
        .attr("r", function(d) {return d.r})
        .attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y})
        .style("fill", fillCircle2Level)

        packG
        .selectAll("circle")
          .data(packedColor, d => d.key)
          .exit()
          .transition()
          .attr("r", 0)
          .remove();

      })

  //Do it again for the regular chart

      packChart = d3.layout.pack();
      packChart.size([1200,1200])
        .children(function(d) {return d.values})
        .value(function(d) {return d.value});

      var circleData = packChart({key: "root", values: nestedData}).filter(d => d.depth === 3);

      d3.select(selectionID)
      .selectAll("g.overall")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "overall")
      .append("line")
      .style("stroke", "gray")
      .style("stroke-width", "1px")
      .attr("x1", 0)
      .attr("x2", 1200)
      .attr("y1", 1200)
      .attr("y2", 1200);

      packG = d3.select(selectionID).select("g.overall");

      packG
      .selectAll("circle")
      .data(circleData, d => d.key)
      .enter()
      .append("circle")
      .attr("r", 1)
      .attr("cx", function(d) {return d.x})
      .attr("cy", function(d) {return d.y})
      .style("fill", fillCircle2Level)
      .style("stroke",
        function(d){
          if (d.rl == 0){
            return "white"
          }
          return "";
        }
       )
      packG
      .selectAll("circle")
      .transition()
      .attr("r", function(d) {return d.r})
      .attr("cx", function(d) {return d.x})
      .attr("cy", function(d) {return d.y})
      .style("fill", fillCircle2Level)

      packG
      .selectAll("circle")
        .data(circleData, d => d.key)
        .exit()
        .transition()
        .attr("r", 0)
        .remove();


      function fillCircle(d) {

        if (d.depth === 4) {
          return d3.hsl(d.key * 15, d.parent.key / 10, d.parent.parent.key / 10).toString()
        }

        return "none"
      }

      function fillCircle2Level(d) {
          return d3.hsl(d.rh * 15, (d.rs + 1) / 10, (d.rl) / 5).toString()
      }
  }
