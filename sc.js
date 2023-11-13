// Load data from CSV file
d3.csv('finalData.csv').then(function(dataFull) {
    const parseDate = d3.timeParse("%d-%m-%Y");
    dataFull.forEach(function(d) {
        d.Timestamp = parseDate(d.Timestamp);
        d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)'] = +d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)'];
    });

    // Set the initial selected option
    let selectedOption = "Seasonal";

    // Declare the chart dimensions and margins.
    const width = 928;
    const height = 600;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc().range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear().range([height - marginBottom, marginTop]);

    // Declare the line generator.
    const line = d3.line()
        .x(d => x(d.Timestamp))
        .y(d => y(d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)']));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - marginBottom})`);

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft},0)`);

    // Append a path for the line.
    svg.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

    // Append horizontal line at y = 40 cm (red)
    svg.append("line")
        .attr("x1", marginLeft)
        .attr("y1", y(40))
        .attr("x2", width - marginRight)
        .attr("y2", y(40))
        .attr("stroke", "red");

    // Append a horizontal line at y = 140 (yellow)
    svg.append("line")
        .attr("x1", marginLeft)
        .attr("y1", y(140))
        .attr("x2", width - marginRight)
        .attr("y2", y(140))
        .attr("stroke", "yellow");

    // Append the SVG to the DOM
    document.getElementById('chartContainer').appendChild(svg.node());

    // Add an event listener for the dropdown change event
    d3.select("#yearDropdown").on("change", function() {
        selectedOption = this.value; // Update the selected option
        updateChart(); // Update the chart based on the selected option
    });

    // Function to update the chart based on the selected option
    function updateChart() {
        let updatedData;

        if (selectedOption === "Seasonal") {
            // Filter data for the years 2019 to 2023
            updatedData = dataFull.filter(d => d.Timestamp.getFullYear() >= 2019 && d.Timestamp.getFullYear() <= 2023);
        } else {
            // Filter data for the selected year
            updatedData = dataFull.filter(d => d.Timestamp.getFullYear() === +selectedOption);
        }

        // Update the x-axis domain
        x.domain(d3.extent(updatedData, d => d.Timestamp));

        // Update the y-axis domain
        y.domain([0, d3.max(updatedData, d => d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)'])]);

        // Update the x-axis
        svg.select(".x-axis").call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Update the y-axis
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(height / 40));

        // Update the line
        svg.select(".line").attr("d", line(updatedData));
    }

    // Initial chart setup
    updateChart();
});

function showChart(chartType) {
    const chartContainer = document.getElementById('chartContainer');

    // Check the selected chart type
    if (chartType === 'line') {
        // If Line Chart is selected, make the chartContainer visible
        chartContainer.style.display = 'block';
        // You can add your logic to render the line chart here if needed
    } else {
        // If other chart types are selected, hide the chartContainer
        chartContainer.style.display = 'none';
    }
}

// Assume you have a function to render the line chart
function renderLineChart() {
    // Your line chart rendering logic here
    // For example, you can use d3.js to render the line chart
    const chartContainer = document.getElementById('chartContainer');
    // Add your d3.js or other charting library logic to render the line chart within chartContainer
}

// Function to handle the line chart click
function lineChartClick() {
    // Call the showChart function with 'line' as the chart type
    showChart('line');
    // Optionally, call the renderLineChart function to render the line chart
    renderLineChart();
} 