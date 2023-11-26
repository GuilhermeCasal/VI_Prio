const width = 900;
const height = 500;
const marginTop = 20;
const marginRight = 250;
const marginBottom = 30;
const marginLeft = 0;

let year1 = 2012
let year2 = 2022

const main = document.getElementById('Main');
    main.addEventListener('click', function() {
        window.location.href = 'intro.html';
    });

const box = document.getElementById('Box');
box.addEventListener('click', function() {
    window.location.href = 'box.html';
});

const river = document.getElementById('Kaub');
    river.addEventListener('click', function() {
        window.location.href = 'gui_page.html';
    });

const line = document.getElementById('Difference');
    line.addEventListener('click', function() {
        window.location.href = 'page.html';
    });

d3.csv("finalData.csv").then(function(data) {
    const filteredData = data.filter(d => {
        const timestamp = d3.timeParse("%d-%m-%Y")(d.Timestamp);
        return timestamp.getFullYear() >= year1 && timestamp.getFullYear() <= year2;
    });

    const columns = Object.keys(data[0]).filter(column => column !== 'Timestamp' && column.includes("(EUR/TON)"));
    const totalSum = d3.sum(filteredData, d => d3.sum(columns, c => +d[c]));
    const columnData = columns.map(column => ({
        name: column,
        value: d3.sum(filteredData, d => +d[column]) / totalSum * 100
    }));

    const svg = d3.select("#chartContainer")
    .append("svg")
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom)
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 10);

    const arcs = svg.selectAll("arc")
        .data(pie(columnData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

    const legend = svg.selectAll(".legend")
        .data(columnData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${width - 150},${i * 20 + 20})`);

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => `${d.name}`);

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .text(d => `${d.data.value.toFixed(2)}%`)
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .filter(d => d.data.value < 5)
        .remove();
});    


function populate_dropdown(){
    const dropdown = document.getElementById("yearDropdown1")
    if(dropdown.innerHTML != ''){
        return null
    }
    d3.csv("finalData.csv").then(function(data) {
        const parseDate = d3.timeParse("%d-%m-%Y");
        years = new Set()
        data.forEach(function(d) {
            const timestamp = parseDate(d.Timestamp);
            const year = timestamp.getFullYear();
            years.add(year); 
            });
        years.forEach(year => {
            if(year != 2023 && year != 2011){
            const opt = document.createElement("option")
            opt.value = year
            opt.textContent = year
            dropdown.appendChild(opt)
            }
        })
})}
document.getElementById("yearDropdown1").addEventListener("click", function() {
populate_dropdown()
})

function populate_dropdown2(){
    const dropdown = document.getElementById("yearDropdown2")
    if(dropdown.innerHTML != ''){
        return null
    }
    d3.csv("finalData.csv").then(function(data) {
        const parseDate = d3.timeParse("%d-%m-%Y");
        years = new Set()
        data.forEach(function(d) {
            const timestamp = parseDate(d.Timestamp); 
            const year = timestamp.getFullYear();
            years.add(year); 
        });
        years.forEach(year => {
            if(year != 2023 && year != 2011){
            const opt = document.createElement("option")
            opt.value = year
            opt.textContent = year
            dropdown.appendChild(opt)
            }
        })
})}
document.getElementById("yearDropdown2").addEventListener("click", function() {
populate_dropdown2()
})


function updateChart(){
    year1 = document.getElementById("yearDropdown1").value
    year2 = document.getElementById("yearDropdown2").value
    let a = 0
    let b = 0
    if (year1 > 2023 || year1 <2012 || year2 > 2023 || year2 <2012 || year1 == year2){
        a = 2012
        b = 2022
        d3.select("#chartContainer").select("svg").remove();
    }
    if(year1 < year2){
        a = year1
        b = year2
        d3.select("#chartContainer").select("svg").remove();
    }else if(year1 > year2){
        a = year2
        b = year1
        d3.select("#chartContainer").select("svg").remove();
    }
    d3.csv("finalData.csv").then(function(data) {
        const filteredData = data.filter(d => {
            const timestamp = d3.timeParse("%d-%m-%Y")(d.Timestamp);
            return timestamp.getFullYear() >= year1 && timestamp.getFullYear() <= year2;
        });

        const columns = Object.keys(data[0]).filter(column => column !== 'Timestamp' && column.includes("(EUR/TON)"));
        const totalSum = d3.sum(filteredData, d => d3.sum(columns, c => +d[c]));
        const columnData = columns.map(column => ({
            name: column,
            value: d3.sum(filteredData, d => +d[column]) / totalSum * 100
        }));

        const svg = d3.select("#chartContainer")
        .append("svg")
        .attr("width", width + marginLeft + marginRight)
        .attr("height", height + marginTop + marginBottom)
        .append("g")
        .attr("transform", `translate(${marginLeft},${marginTop})`);

        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 10);

        const arcs = svg.selectAll("arc")
            .data(pie(columnData))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

        const legend = svg.selectAll(".legend")
            .data(columnData)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width - 150},${i * 20 + 20})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(d => `${d.name}`);

        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", ".35em")
            .text(d => `${d.data.value.toFixed(2)}%`)
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .filter(d => d.data.value < 5)
            .remove();
    });
}