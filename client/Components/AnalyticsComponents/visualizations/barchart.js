import d3 from 'd3';
import _ from 'lodash';

const barChart = {};
const margin = 15;
// data looks like this
// { emotion: emotion, data: object[emotion], index: i }
barChart.create = (el, props, data) => {
  // functions to grab specific parts of the data
  // const emotion = (d) => d.emotion;
  // const data = (d) => d.data;
  // const index = (d) => d.index;
  let svg = d3.select(el)
    .append('svg')
      .attr('ref', 'barChart')
      .attr('width', props.width)
      .attr('height', props.height);
  // both x and y axes don't currently render
  let xScale = d3.scale.ordinal()
    .domain(d3.range(data.length + 1))
    .rangeRoundBands([40, 350], 0.05); // magic #40, width is a %
  let yScale = d3.scale.linear()
    .domain([0, 1])
    .range([400 - margin, 0]); // height - margin, 300
  let xAxis = d3.svg.axis().scale(xScale);
  let yAxis = d3.svg.axis().scale(yScale).orient('left');

  d3.select('svg')
    .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${400 - margin}, 0)`)
    .call(xAxis);
  d3.select('svg')
    .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin}, 0)`)
    .call(yAxis);
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i))
    .attr('y', (d) => yScale(d.data))
    .attr('width', xScale.rangeBand())
    .attr('height', (d) => (yScale(0) - yScale(d.data)))
    .attr('fill', 'green');

  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text((d) => d.emotion)
    .attr('text-anchor', 'middle')
    .attr('x', (d, i) => (xScale(i) + xScale.rangeBand() / 2))
    .attr('y', (d) => yScale(d.data))
    .attr('font-family', 'sans-serif')
    .attr('font-size', '11px')
    .attr('fill', 'black');
};

barChart.update = (el, props, data) => {
  let xScale = d3.scale.ordinal()
    .domain(d3.range(data.length + 1))
    .rangeRoundBands([40, 350], 0.05); // magic #40, width is a %
  let yScale = d3.scale.linear()
    .domain([0, 1])
    .range([400 - margin, 0]); // height - margin, 300
  let svg = d3.select(el);
  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i))
    .attr('y', (d) => yScale(d.data))
    .attr('width', xScale.rangeBand())
    .attr('height', (d) => (yScale(0) - yScale(d.data)))
    .attr('fill', 'green');
    // updating not yet working
    // .exit();
};

export default barChart;