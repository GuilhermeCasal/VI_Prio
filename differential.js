const width = 900;
const height = 500;
const marginTop = 20;
const marginRight = 40;
const marginBottom = 30;
const marginLeft = 40;


const box = document.getElementById('Box');
box.addEventListener('click', function() {
    window.location.href = 'box.html';
});

const gasolina = document.getElementById('Gasolina');
    gasolina.addEventListener('click', function() {
        window.location.href = 'bar2.html';
});

const main = document.getElementById('Main');
    main.addEventListener('click', function() {
        window.location.href = 'intro.html';
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
tank.addEventListener('click', function(){
    window.location.href = 'bar.html';
});

d3.csv("finalData.csv").then(function(data) {
    const parseDate = d3.timeParse("%d-%m-%Y");

    data.forEach(function(d) {
        d.Timestamp = parseDate(d.Timestamp); 
        d['USED COOKING OIL(EUR/TON)'] = +d['USED COOKING OIL(EUR/TON)'];
        d['RAPESEED(EUR/TON)'] = +d['RAPESEED(EUR/TON)'];
    });
    const newData = data.filter(d => !isNaN(d['USED COOKING OIL(EUR/TON)']) && !isNaN(d['RAPESEED(EUR/TON)']) && d['RAPESEED(EUR/TON)'] != 0 && d['USED COOKING OIL(EUR/TON)'] != 0).map(function(d) {
        return {
            Timestamp: d.Timestamp,
            Difference: d['USED COOKING OIL(EUR/TON)'] - d['RAPESEED(EUR/TON)']
        };
    });

    const svg = d3.select("#chartContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Timestamp))
        .range([marginLeft+10, width - marginRight]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(newData, d => d.Difference))
        .range([height - marginBottom, marginTop]);

    const line = d3.line()
        .x(d => xScale(d.Timestamp))
        .y(d => yScale(d.Difference));

    svg.append("path")
        .datum(newData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("g")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${marginLeft+10}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
    .attr("transform", `translate(${width / 2},${height + 0})`)
    .style("text-anchor", "middle")
    .text("YEAR");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("EUR/TON");
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

function populate_dropdown3(){
    const dropdown = document.getElementById("itemDropdown1")
    if(dropdown.innerHTML != ''){
        return null
    }
    
    d3.csv("finalData.csv").then(function(data) {    
        const columns = Object.keys(data[0])
        columns.forEach(column => {
            const cnames = column.split(",")
            cnames.forEach(name =>{
                if(name.trim() != "Timestamp" && name.includes("(EUR/TON)")){
                const opt = document.createElement("option")
                opt.value = name
                opt.textContent = name
                dropdown.appendChild(opt)
                }
            })
            
        })
})}
document.getElementById("itemDropdown1").addEventListener("click", function() {
populate_dropdown3()
})

function populate_dropdown4(){
    const dropdown = document.getElementById("itemDropdown2")
    
    if(dropdown.innerHTML != ''){
        return null
    }
    d3.csv("finalData.csv").then(function(data) {    
        const columns = Object.keys(data[0])
        columns.forEach(column => {
            const cnames = column.split(",")
            cnames.forEach(name =>{
                if(name.trim() != "Timestamp" && name.includes("(EUR/TON)")){
                const opt = document.createElement("option")
                opt.value = name
                opt.textContent = name
                dropdown.appendChild(opt)
                }
            })
            
        })
})}
document.getElementById("itemDropdown2").addEventListener("click", function() {
populate_dropdown4()
})

function updateChart(){
    year1 = document.getElementById("yearDropdown1").value
    year2 = document.getElementById("yearDropdown2").value
    item1 = document.getElementById("itemDropdown1").value
    item2 = document.getElementById("itemDropdown2").value
    if(item1 == "" || item2 == "" || (item1 == "None" && item2 == "None")){
        item1 = 'USED COOKING OIL(EUR/TON)'
        item2 = 'RAPESEED(EUR/TON)'
    }
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
        const parseDate = d3.timeParse("%d-%m-%Y");
          data.forEach(function(d) {
            d.Timestamp = parseDate(d.Timestamp); 
            d[item1] = +d[item1]; 
            d[item2] = +d[item2]; 
        });
    
        const newData = data.filter(d => !isNaN(d[item1]) && !isNaN(d[item2]) && d[item2] != 0 && d[item1] != 0 && ( d.Timestamp.getFullYear() >= a && d.Timestamp.getFullYear() <= b)).map(function(d) {
            return {
                Timestamp: d.Timestamp,
                Difference: d[item1] - d[item2]
            };
        });
    
        const svg = d3.select("#chartContainer")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    
        const xScale = d3.scaleTime()
            .domain([new Date(a, 0), new Date(b, 0)])
            .range([marginLeft+10, width - marginRight]);
    
        const yScale = d3.scaleLinear()
            .domain(d3.extent(newData, d => d.Difference))
            .range([height - marginBottom, marginTop]);
    
        const line = d3.line()
            .x(d => xScale(d.Timestamp))
            .y(d => yScale(d.Difference));
    
        svg.append("path")
            .datum(newData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
    
        svg.append("g")
            .attr("transform", `translate(0, ${height - marginBottom})`)
            .call(d3.axisBottom(xScale));
    
        svg.append("g")
            .attr("transform", `translate(${marginLeft+10}, 0)`)
            .call(d3.axisLeft(yScale));
    
        svg.append("text")
        .attr("transform", `translate(${width / 2},${height + 0})`)
        .style("text-anchor", "middle")
        .text("YEAR");
    
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 0 - height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("EUR/TON");
    });
}