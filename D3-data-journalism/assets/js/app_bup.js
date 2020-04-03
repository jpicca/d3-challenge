// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "income";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    var labelDict = {
        "income": "Income",
        "obesity": "% Obese"
    };
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      //.offset([80, -60])
      .html(function(d) {
        return (`${labelDict[chosenXAxis]}: ${d[chosenXAxis]}<br>${labelDict[chosenYAxis]}: ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);

    textGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
    // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    textGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
    // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });
  
    return [circlesGroup,textGroup];
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

d3.csv('./assets/data/data.csv').then(function(data,err){

    if (err) throw err;

    //console.log(data)

    // parse data
    data.forEach(function(row) {
        row.income = +row.income;
        row.obesity = +row.obesity;
        row.healthcare = +row.healthcare;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(data, chosenYAxis);
        /*d3.scaleLinear()
        .domain([0, d3.max(data, d => d.obesity)])
        .range([height, 0]);*/

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(data)
        .enter()
        .append("circle")
        .classed("stateCircle",true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("opacity", ".8");

    var textGroup = chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .classed("stateText",true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(d => d.abbr)
        .attr('alignment-baseline','middle')
        .attr("font-size","10")
        .attr("fill", "black");

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(-60, ${height / 2})`);

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Median Income");

    // append y axis
    var obesityLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("value", "obesity")
        .attr("dy", "1em")
        .classed("active", true)
        .text("% Obese");

    // updateToolTip function above csv import
    var groupArr = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
    circlesGroup = groupArr[0];
    textGroup = groupArr[1];

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

            // changes classes to change bold text
            if (chosenXAxis === "obesity") {
                obesityLabel
                .classed("active", true)
                .classed("inactive", false);
                //hairLengthLabel
                //.classed("active", false)
                //.classed("inactive", true);
            }
            else {
                albumsLabel
                .classed("active", false)
                .classed("inactive", true);
                hairLengthLabel
                .classed("active", true)
                .classed("inactive", false);
            }
            }
        });

}).catch(function(error) {
    console.log(error);
});