let year1 = 2021;
let year2 = 2022

const pie = document.getElementById('Pie');

pie.addEventListener('click', function() {
    window.location.href = 'pie.html';
});

const gasolina = document.getElementById('Gasolina');
    gasolina.addEventListener('click', function() {
        window.location.href = 'bar2.html';
});

const main = document.getElementById('Main');
    main.addEventListener('click', function() {
        window.location.href = 'intro.html';
    });

const river = document.getElementById('Kaub');
river.addEventListener('click', function() {
    window.location.href = 'gui_page.html';
});

const line = document.getElementById('Difference');
  line.addEventListener('click', function() {
      window.location.href = 'page.html';
});
const tank = document.getElementById('Tank');
  tank.addEventListener('click', function(){
    window.location.href = 'bar.html';
});


d3.csv("finalData.csv").then(function(data) {

  const yearData = data.filter(d => {
      const timestamp = d3.timeParse("%d-%m-%Y")(d.Timestamp);
      return timestamp.getFullYear() >= year1 && timestamp.getFullYear() <= year2;
  });
  const productColumns = Object.keys(data[0]).filter(column => column !== 'Timestamp' && column.includes("(EUR/TON)"));

    const pivotedData = productColumns.map(product => {
      const prices = yearData.map(d => +d[product]);
      return {
        productName: product,
        prices: prices
      };
    });

  const boxPlotData = pivotedData.map(product => {
    const productPrices = product.prices.filter(price => !isNaN(price) && price != 0);

    const min = d3.min(productPrices);
    const q1 = d3.quantile(productPrices, 0.25);
    const median = d3.median(productPrices);
    const q3 = d3.quantile(productPrices, 0.75);
    const max = d3.max(productPrices);

    return {
      productName: product.productName,
      stats: {
        min,
        q1,
        median,
        q3,
        max,
        outliers: []
      }
    };
});

  const svgWidth = 800;
  const svgHeight = 600;
  const margin = { top: 20, right: 30, bottom: 300, left: 50 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const svg = d3.select("#chartContainer")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const xScale = d3.scaleBand()
    .domain(boxPlotData.map(d => d.productName))
    .range([margin.left, chartWidth])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  const xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
    .attr("y", 10)
    .attr("x", -9) 
    .attr("dy", ".35em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end");

    const allPrices = boxPlotData.flatMap(d => [d.stats.min, d.stats.q1, d.stats.median, d.stats.q3, d.stats.max]);
    const overallMin = d3.min(allPrices);
    const overallMax = d3.max(allPrices);

    const yScale = d3.scaleLinear()
      .domain([overallMin, overallMax])
      .range([chartHeight, margin.top]);

const yAxis = d3.axisLeft(yScale);

svg.append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(yAxis);

  svg.selectAll(".box-plot")
  .data(boxPlotData)
  .enter()
  .append("g")
  .attr("class", "box-plot")
  .attr("transform", d => `translate(${xScale(d.productName) + xScale.bandwidth() / 2}, 0)`)
  .each(function(d) {
    const boxGroup = d3.select(this);

    boxGroup.append("rect")
      .attr("class", "box")
      .attr("x", -xScale.bandwidth() / 2)
      .attr("y", yScale(d.stats.q3))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale(d.stats.q1) - yScale(d.stats.q3))
      .attr("fill", "lightblue")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    boxGroup.append("line")
      .attr("class", "vertical-line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", yScale(d.stats.min))
      .attr("y2", yScale(d.stats.max))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    boxGroup.append("line")
      .attr("class", "median-line")
      .attr("x1", -xScale.bandwidth() / 2)
      .attr("x2", xScale.bandwidth() / 2)
      .attr("y1", yScale(d.stats.median))
      .attr("y2", yScale(d.stats.median))
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  })})

  
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
    const yearData = data.filter(d => {
        const timestamp = d3.timeParse("%d-%m-%Y")(d.Timestamp);
        return timestamp.getFullYear() >= year1 && timestamp.getFullYear() <= year2;
    });
    
    const productColumns = Object.keys(data[0]).filter(column => column !== 'Timestamp' && column.includes("(EUR/TON)"));

      const pivotedData = productColumns.map(product => {
        const prices = yearData.map(d => +d[product]);
        return {
          productName: product,
          prices: prices
        };
      });
    
      const boxPlotData = pivotedData.map(product => {
        const productPrices = product.prices.filter(price => !isNaN(price) && price != 0);
    
        const min = d3.min(productPrices);
        const q1 = d3.quantile(productPrices, 0.25);
        const median = d3.median(productPrices);
        const q3 = d3.quantile(productPrices, 0.75);
        const max = d3.max(productPrices);
    
        return {
          productName: product.productName,
          stats: {
            min,
            q1,
            median,
            q3,
            max,
            outliers: [] 
          }
        };
      });
    
      const svgWidth = 800;
      const svgHeight = 600;
      const margin = { top: 20, right: 30, bottom: 300, left: 50 };
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight - margin.top - margin.bottom;
    
      const svg = d3.select("#chartContainer")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
      const xScale = d3.scaleBand()
        .domain(boxPlotData.map(d => d.productName))
        .range([margin.left, chartWidth])
        .paddingInner(0.1)
        .paddingOuter(0.2);
    
      const xAxis = d3.axisBottom(xScale);
  
      svg.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("y", 10) 
        .attr("x", -9) 
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");
  
        const allPrices = boxPlotData.flatMap(d => [d.stats.min, d.stats.q1, d.stats.median, d.stats.q3, d.stats.max]);
        const overallMin = d3.min(allPrices);
        const overallMax = d3.max(allPrices);
  
        const yScale = d3.scaleLinear()
          .domain([overallMin, overallMax])
          .range([chartHeight, margin.top]);
        
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);
    
      svg.selectAll(".box-plot")
      .data(boxPlotData)
      .enter()
      .append("g")
      .attr("class", "box-plot")
      .attr("transform", d => `translate(${xScale(d.productName) + xScale.bandwidth() / 2}, 0)`)
      .each(function(d) {
      const boxGroup = d3.select(this);
  
      boxGroup.append("rect")
        .attr("class", "box")
        .attr("x", -xScale.bandwidth() / 2)
        .attr("y", yScale(d.stats.q3))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale(d.stats.q1) - yScale(d.stats.q3))
        .attr("fill", "lightblue")
        .attr("stroke", "black")
        .attr("stroke-width", 1);
  
      boxGroup.append("line")
        .attr("class", "vertical-line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", yScale(d.stats.min))
        .attr("y2", yScale(d.stats.max))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
  
      boxGroup.append("line")
        .attr("class", "median-line")
        .attr("x1", -xScale.bandwidth() / 2)
        .attr("x2", xScale.bandwidth() / 2)
        .attr("y1", yScale(d.stats.median))
        .attr("y2", yScale(d.stats.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    })
  })
}      