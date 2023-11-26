var svgWidth = 1200;
var svgHeight = 400;
var margin = { top: 20, right: 20, bottom: 50, left: 400 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



var svg = d3.select("#chart-container").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top + ")"); 

    d3.csv("finalData.csv").then(function(data) {
    const parseDate = d3.timeParse("%d-%m-%Y");

    data.forEach(function (d) {
        d.Timestamp = parseDate(d.Timestamp);
        d["STOCKS GASOLINA(TON)"] = +d["STOCKS GASOLINA(TON)"];
    });

    data = data.filter(function(d) {
        return !isNaN(d["STOCKS GASOLINA(TON)"]);
    });
    var years = Array.from(new Set(data.map(d => new Date(d.Timestamp).getFullYear())));

    var yearSelect = d3.select("#yearSelect")
        .on("change", updateChart);

    yearSelect.selectAll("option")
        .data(years)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    updateChart();

    function updateChart() {
        var selectedYear = +yearSelect.property("value");

        var filteredData = data.filter(d => new Date(d.Timestamp).getFullYear() === selectedYear);

        var xScale = d3.scaleTime().range([0, width]);
        var yScale = d3.scaleLinear().range([height, 0]);

        xScale.domain(d3.extent(filteredData, d => new Date(d.Timestamp))); 
        yScale.domain([0, 3500]); 

        svg.selectAll("*").remove();

        svg.selectAll("bar")
            .data(filteredData)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", d => xScale(new Date(d.Timestamp)))
            .attr("width", width / filteredData.length)
            .attr("y", d => yScale(d["STOCKS GASOLINA(TON)"]))
            .attr("height", d => height - yScale(d["STOCKS GASOLINA(TON)"]));

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Time");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("STOCKS GASOLINA(TON)");
    }
});

const box = document.getElementById('Box');
box.addEventListener('click', function() {
    window.location.href = 'box.html';
});

const main = document.getElementById('Main');
    main.addEventListener('click', function() {
        window.location.href = 'intro.html';
    });

const line = document.getElementById('Difference');
    line.addEventListener('click', function() {
        window.location.href = 'page.html';
});

const barChart = document.getElementById('Kaub');
barChart.addEventListener('click', function() {
    window.location.href = 'gui_page.html';
});

const pie = document.getElementById('Pie');
pie.addEventListener('click', function() {
    window.location.href = 'pie.html';
});

const tank = document.getElementById('Tank');
tank.addEventListener('click', function() {
    window.location.href = 'bar.html';
});