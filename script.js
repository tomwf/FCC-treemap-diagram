function showTooltip(event) {

  try {
    const x = event.layerX
    const y = event.layerY
    const name = event.target.attributes['data-name'].value
    const category = event.target.attributes['data-category'].value
    const value = event.target.attributes['data-value'].value

    //Add tooltip
    const tooltip = chart.append('div')
      .attr('id', 'tooltip')
      .attr('data-value', value)
      .style('left', `${x}px`)
      .style('top', `${y}px`)
    tooltip.append('p')
      .text(`Name: ${name}`)
    tooltip.append('p')
      .text(`Category: ${category}`)
    tooltip.append('p')
      .text(`Value: ${value}`)
  } catch(e) {
    // This error occurs when the mouse
    // is hovering over the text element
    hideTooltip()
    return
  }
}

function moveTooltip(event) {
  const x = event.layerX
  const y = event.layerY

  d3.select('#tooltip')
    .style('left', `${x}px`)
    .style('top', `${y}px`)
}

function hideTooltip() {
  d3.select('#tooltip').remove()
}

// Constants
const COLORS = {
  'Wii': 'rgb(76, 146, 195)',    // blue
  'X360': 'rgb(255, 153, 62)',    // orange
  'NES': 'rgb(173, 229, 161)',   // light green
  'PS2': 'rgb(222, 82, 83)',     // red
  'DS': 'rgb(190, 210, 237)',   // grayish blue
  'GB': 'rgb(255, 201, 147)',   // light orange
  '3DS': 'rgb(255, 173, 171)',   // light red
  'PS4': 'rgb(169, 133, 202)',   // purple
  'SNES': 'rgb(209, 192, 221)',   // grayish purple
  'PS3': 'rgb(86, 179, 86)',     // green
  'PS': 'rgb(163, 120, 111)',   // brown
  'GBA': 'rgb(233, 146, 206)',   // pink
  'XB': 'rgb(249, 197, 219)',   // light pink
  'N64': 'rgb(208, 176, 169)',   // light brown
  'PC': 'rgb(153, 153, 153)',   // gray
  '2600': 'rgb(210, 210, 210)',   // light gray
  'PSP': 'rgb(201, 202, 78)',    // olive
  'XOne': 'rgb(226, 226, 164)'   // light olive
}

// Initialization
const width = 960
const height = 570
const chart = d3.select('#chart')
const svg = chart.append('svg')
  .attr('width', width)
  .attr('height', height)

// Prepare data
const gameUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
const gameJson = d3.json(gameUrl)

// Fetch data
gameJson.then(gameData => {

  // Prepare treemap data
  const hierarchy = d3.hierarchy(gameData, data => data.children)
    .sum(data => data.value)
    .sort((a, b) => b.value - a.value)

  // Initialize treemap
  d3.treemap()
    .size([width, height])
    .padding(4)
  (hierarchy)

  // Draw rect
  const tile = svg.selectAll('g')
    .data(hierarchy.leaves())
    .enter()
    .append('g')
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseleave', hideTooltip)

  // Add rect
  tile
    .append('rect')
    .attr('class', 'tile')
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => COLORS[d.data.category])

  // Add text
  tile
    .append('text')
    .text(d => d.data.name)
    .attr('x', d => d.x0 + 8)
    .attr('y', d => d.y0 + 17)
    .attr('width', d => d.x1 - d.x0)
    .style('font-size', '.75rem')

  // Legend settings
  const itemSize = 20
  const paddingLeft = 200
  const gap = 180
  let row = 0

  // Add legend
  const legend = chart.append('svg')
    .attr('viewBox', `0 0 ${width} 300`)
    .attr('id', 'legend')
    .append('g')

  // Draw square
  legend.selectAll('rect')
    .data(Object.entries(COLORS))
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', (_, i) => i % 3 * gap + paddingLeft)
    .attr('y', (_, i) => {
      if (i % 3 === 0) row++
      return row * 30
    })
    .attr('width', itemSize)
    .attr('height', itemSize)
    .attr('fill', d => d[1])

  // Reset row value for text element
  row = 0

  // Add text
  legend.selectAll('text')
    .data(Object.entries(COLORS))
    .enter()
    .append('text')
    .text(d => d[0])
    .attr('x', (_, i) => i % 3 * gap + paddingLeft + 30)
    .attr('y', (_, i) => {
      if (i % 3 === 0) row++
      return row * 30 + 16
    })
})
