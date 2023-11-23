const barChart = document.getElementById('Difference');

    // Add event listener for click on the bar chart
    barChart.addEventListener('click', function() {
        // Redirect to page.html
        window.location.href = 'page.html';
    });
const pie = document.getElementById('Pie');

// Add event listener for click on the bar chart
pie.addEventListener('click', function() {
    // Redirect to page.html
    window.location.href = 'pie.html';
});

d3.csv('finalData.csv').then(function (dataFull) {
    const parseDate = d3.timeParse("%d-%m-%Y");
    dataFull.forEach(function (d) {
        d.Timestamp = parseDate(d.Timestamp);
        d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)'] = +d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)'];
    });

    let selectedOption = "Seasonal";

    const width = 928;
    const height = 600;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const x = d3.scaleUtc().range([marginLeft, width - marginRight]);
    const y = d3.scaleLinear().range([height - marginBottom, marginTop]);

    const line = d3.line()
        .x(d => x(d.Timestamp))
        .y(d => y(d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)']));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - marginBottom})`);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft},0)`);

    document.getElementById('chartContainer').appendChild(svg.node());

    // Define static colors for each year
    const yearColors = {
        2013: "magenta",
        2014: "pink",
        2015: "brown",
        2016: "teal",
        2017: "orange",
        2018: "cyan",
        2019: "lime",
        2020: "purple",
        2021: "green",
        2022: "blue",
        2023: "cyan"
    };



    d3.select("#yearDropdown").on("change", function () {
        selectedOption = this.value;
        updateChart();
    });

    function updateChart() {
        svg.selectAll(".line").remove();
        svg.selectAll(".legend").remove(); 
        svg.selectAll(".horizontal-line").remove(); // Remove existing horizontal lines
        const years = selectedOption === "Seasonal" ? [2019, 2020, 2021, 2022] : [+selectedOption];

        years.forEach(year => {
            const updatedData = dataFull.filter(d => d.Timestamp.getFullYear() === year);

            x.domain(d3.extent(updatedData, d => d.Timestamp));
            y.domain([0, d3.max(updatedData, d => d['NIVEIS AGUA DO RIO RENO EM KAUB(CENT)'])]);

            svg.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", yearColors[year]) // Use static color for each year
                .attr("stroke-width", 1.5)
                .attr("d", line(updatedData));
        });

        svg.append("line")
            .attr("class", "horizontal-line")
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .attr("y1", y(140))
            .attr("y2", y(140))
            .attr("stroke", "yellow")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4"); // Optional: dashed line

        svg.append("line")
            .attr("class", "horizontal-line")
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .attr("y1", y(40))
            .attr("y2", y(40))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4"); // Optional: dashed line



        svg.select(".x-axis").call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b")).tickSizeOuter(0));
        svg.select(".y-axis").call(d3.axisLeft(y).ticks(height / 40));
    
        if (selectedOption === "Seasonal") {
            const legendContainer = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - marginRight - 200}, ${marginTop})`);  
            // Create legend items

            const legendItems = Object.entries(yearColors)
                    .filter(([year]) => years.includes(+year));

            legendContainer.selectAll("rect")
                .data(legendItems)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 20)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", d => d[1]);
    
            legendContainer.selectAll("text")
                .data(legendItems)
                .enter()
                .append("text")
                .attr("x", 20)
                .attr("y", (d, i) => i * 20 + 9)
                .text(d => d[0])
                .attr("fill", "black");
        }
    
    }

    updateChart();
});