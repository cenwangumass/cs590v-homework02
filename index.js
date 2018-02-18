/**
 * Compute the range of data with padding
 * @param data
 * @param variable
 * @param percentage
 * @returns {*[]}
 */
function extentWithPadding(data, variable, percentage) {
  let [min, max] = d3.extent(data, d => d[variable]);
  let diff = max - min;
  return [min - diff * percentage, max + diff * percentage];
}


// SVG width and height
let svgWidth = 960;
let svgHeight = 600;

// D3 margin convention
let margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 100
};

// Inner width and height
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// D3 tooltip
let tip = d3.tip().attr('class', 'd3-tip').html(d => {
  return (`
    <div>
      <div>${d.Name}</div>
      <div>Year: ${d.Year}</div>
      <div>Frequency: ${d.Frequency}</div>
      <div>Lithography: ${d.Lithography} nm</div>
      <div>Price: $${d.Price}</div>
    </div>
  `);
});

// Variables in data
let variables = {
  x: 'Year',
  y: 'Price',
  size: 'Frequency',
  opacity: 'Lithography'
};

let units = {
  'Year': '',
  'Price': ' ($)',
  'Frequency': ' (GHz)',
  'Lithography': ' (nm)'
};

// Add 'option' elements for all the 'select' elements
d3.selectAll('.select-variable')
  .selectAll('option')
  .data(Object.values(variables))
  .enter()
  .append('option')
  .text(d => d);

// Set default variables for x, y, size and opacity
d3.select('#select-x')
  .property('value', variables.x);

d3.select('#select-y')
  .property('value', variables.y);

d3.select('#select-size')
  .property('value', variables.size);

d3.select('#select-opacity')
  .property('value', variables.opacity);

// Load data and plot
d3.csv('data.csv', d => {
  // Parse CSV records
  return {
    Name: d['Name'],
    Frequency: +d['Frequency'],
    Lithography: +d['Lithography'],
    Platform: d['Platform'],
    Price: +d['Price'],
    Year: +d['Year'] + (Math.random() * 2 - 1) * 0.2
  };
}, data => {
  // For every unique platform, give it an integer
  // This is used later to plot CPUs for different platforms in different colors
  let platforms = {};
  let i = 0;
  for (let d of data) {
    if (!(d.Platform in platforms)) {
      platforms[d.Platform] = i;
      i++;
    }
  }
  let nPlatforms = i;

  // x, y, size, opacity and color scale
  let xScale = d3.scaleLinear()
    .domain(extentWithPadding(data, variables.x, 0.05))
    .range([0, width]);

  let yScale = d3.scaleLinear()
    .domain(extentWithPadding(data, variables.y, 0.05))
    .range([height, 0]);

  let sizeScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[variables.size]))
    .range([4, 16]);

  let opacityScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[variables.opacity]))
    .range([0.4, 1]);

  let colorScale = d3.scaleOrdinal()
    .domain(Object.keys(platforms))
    .range(d3.schemeCategory10.slice(0, nPlatforms));

  // x and y axis
  let xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format('d'));

  let yAxis = d3.axisLeft()
    .scale(yScale)
    .tickFormat(d3.format('d'));

  /**
   * Change x variable
   */
  function changeXVariable() {
    // Update the new variable
    variables.x = this.value;

    // Update data domain
    xScale.domain(extentWithPadding(data, variables.x, 0.05));
    xAxis.scale(xScale);

    // Re-draw the axis
    d3.select('#x-axis')
      .call(xAxis);

    // Update axis label
    d3.select('#x-label')
      .text(variables.x + units[variables.x]);

    // Re-compute data coordinate
    d3.selectAll('.data-point')
      .attr('cx', d => xScale(d[variables.x]));
  }

  /**
   * Change y variable
   */
  function changeYVariable() {
    variables.y = this.value;
    yScale.domain(extentWithPadding(data, variables.y, 0.05));
    yAxis.scale(yScale);
    d3.select('#y-axis')
      .call(yAxis);
    d3.select('#y-label')
      .text(variables.y + units[variables.y]);
    d3.selectAll('.data-point')
      .attr('cy', d => yScale(d[variables.y]));
  }

  /**
   * Change size variable
   */
  function changeSize() {
    variables.size = this.value;
    sizeScale.domain(d3.extent(data, d => d[variables.size]));
    d3.selectAll('.data-point')
      .attr('r', d => sizeScale(d[variables.size]));
  }

  /**
   * Change opacity variable
   */
  function changeOpacity() {
    variables.opacity = this.value;
    opacityScale.domain(d3.extent(data, d => d[variables.opacity]));
    d3.selectAll('.data-point')
      .attr('fill-opacity', d => opacityScale(d[variables.opacity]));
  }

  // Install event listeners
  d3.select('#select-x')
    .on('change', changeXVariable);

  d3.select('#select-y')
    .on('change', changeYVariable);

  d3.select('#select-size')
    .on('change', changeSize);

  d3.select('#select-opacity')
    .on('change', changeOpacity);

  // Create SVG element
  let svg = d3.select('body')
    .select('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  // Create the tooltip
  svg.call(tip);

  // Add legend
  svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(25, 20)');

  let legend = d3.legendColor()
    .scale(colorScale)
    .shape('circle')
    .shapeRadius(8)
    .shapePadding(10)
    .on('cellclick', function (platform) {
      // Dim other cells
      d3.selectAll('.cell')
        .style('opacity', 0.1);
      d3.select(this)
        .style('opacity', 1);

      // Hide data points that have a different platform
      d3.selectAll('.data-point')
        .style('opacity', 0)
        .filter(d => d.Platform == platform)
        .style('opacity', 1);
    });

  // When resetting the platform, set normal opacity for cells and data points
  d3.select('#reset-platform')
    .on('click', () => {
      d3.selectAll('.cell')
        .style('opacity', 1);

      d3.selectAll('.data-point')
        .style('opacity', d => opacityScale(d[variables.opacity]));
    });

  // Draw the legend
  svg.select('.legend')
    .call(legend);

  // Plot x and y axes
  svg.append('g')
    .attr('class', 'axis')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'axis')
    .attr('id', 'y-axis')
    .call(yAxis);

  // Plot x and y labels
  svg.append('text')
    .attr('id', 'x-label')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 10)
    .style('text-anchor', 'middle')
    .text(variables.x + units[variables.x])
    .attr('font-family', 'sans-serif')
    .attr('font-size', '16px');

  svg.append('text')
    .attr('id', 'y-label')
    .attr('y', -margin.left + 10)
    .attr('x', -height / 2)
    .attr('transform', 'rotate(-90)')
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(variables.y + units[variables.y])
    .attr('font-family', 'sans-serif')
    .attr('font-size', '16px');

  // Plot data points
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'data-point')
    .attr('cx', d => xScale(d[variables.x]))
    .attr('cy', d => yScale(d[variables.y]))
    .attr('r', d => sizeScale(d[variables.size]))
    .attr('fill', d => colorScale(platforms[d.Platform]))
    .attr('fill-opacity', d => opacityScale(d[variables.opacity]))
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
});