// @TODO: YOUR CODE HERE!

var data;

var labelsGroupY;
var chosenXAxis = "income";
var chosenYAxis = "obesity";
var init = true;

function makeResponsive() {

    var svgWidth = window.innerWidth*0.8;
    var svgHeight = svgWidth*0.5;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.

    var svgArea = d3.select("#scatter").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var margin = {
        top: 20,
        right: 40,
        bottom: 100,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // function used for updating x-scale var upon click on axis label
    function xScale(data, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    
        return xLinearScale;

    };

    // function used for updating y-scale var upon click on axis label
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
            "income": "Income ($)",
            "obesity": "% Obese",
            "healthcare": "% Lacks Healthcare",
            "poverty": "% in Poverty",
            "smokes": "% who Smoke",
            "age": "Median Age"
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

    // function used for updating xAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
    
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    }

    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));

        textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]));
    
        return [circlesGroup,textGroup];
    }

    function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newYScale(d[chosenYAxis]));

        textGroup.transition()
            .duration(1000)
            .attr("y", d => newYScale(d[chosenYAxis]));
    
        return [circlesGroup,textGroup];
    }

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

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

    labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(-60, ${height / 2})`);

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        //.classed('inactive',true)
        .attr("value", "income") // value to grab for event listener
        .text("Median Income");

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        //.classed('inactive',true)
        .attr("value", "poverty") // value to grab for event listener
        .text("% in Poverty");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        //.classed('inactive',true)
        .attr("value", "age") // value to grab for event listener
        .text("Median Age");

    var smokeLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        //.classed('active',true)
        .attr("value", "smokes")
        .attr("dy", "1em")
        .text("% who Smoke");

    var obesityLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        //.classed('active',true)
        .attr("value", "obesity")
        .attr("dy", "1em")
        .text("% Obese");

    var healthcareLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        //.classed('inactive',true)
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .text("% Lacks Healthcare");

    /*if (init) {
        incomeLabel.classed('active',true);
        obesityLabel.classed('active',true);
        healthcareLabel.classed('inactive',true);

        init = false;
    } else {*/
        //labelsGroupY.selectAll('text')

        // On re-size, we need to correctly maintain our active/inactive classes
        // Use the global chosen_Axis vars to filter our label groups and properly
        // set our classes

    labelsGroupY.selectAll('text').filter(function() {
        return d3.select(this).attr('value') != chosenYAxis;
    }).classed('inactive',true);

    labelsGroup.selectAll('text').filter(function() {
        return d3.select(this).attr('value') != chosenXAxis;
    }).classed('inactive',true);

    let yActive = d3.select(`[value=${chosenYAxis}]`);
    yActive.classed('active',true);

    let xActive = d3.select(`[value=${chosenXAxis}]`);
    xActive.classed('active',true);

    //}

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
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis)[0];
                textGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis)[1];

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup)[0];
                textGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup)[1];

                // changes classes to change bold text
                /*if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }*/
            
                labelsGroup.selectAll('text').filter(function() {
                    return d3.select(this).attr('value') != chosenXAxis;
                }).classed('inactive',true).classed('active',false);
            
                let xActive = d3.select(`[value=${chosenXAxis}]`);
                xActive.classed('active',true).classed('inactive',false);
            }
        });

    labelsGroupY.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(data, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis)[0];
                textGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis)[1];

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup)[0];
                textGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup)[1];

                // changes classes to change bold text
                // if (chosenYAxis === "obesity") {
                //     obesityLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                //     healthcareLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                // }
                // else {
                //     obesityLabel
                //         .classed("active", false)
                //         .classed("inactive", true);
                //     healthcareLabel
                //         .classed("active", true)
                //         .classed("inactive", false);
                // }

                labelsGroupY.selectAll('text').filter(function() {
                    return d3.select(this).attr('value') != chosenYAxis;
                }).classed('inactive',true).classed('active',false);
            
                let yActive = d3.select(`[value=${chosenYAxis}]`);
                yActive.classed('active',true).classed('inactive',false);
            
            }
        });

};

d3.csv('./assets/data/data.csv').then(function(readData,err){

    if (err) throw err;

    data = readData;

    data.forEach(function(row) {
        row.income = +row.income;
        row.obesity = +row.obesity;
        row.healthcare = +row.healthcare;
        row.poverty = +row.poverty;
        row.smokes = +row.smokes;
    });

    makeResponsive();

}).catch(function(error) {
    console.log(error);
});

d3.select(window).on("resize", makeResponsive);