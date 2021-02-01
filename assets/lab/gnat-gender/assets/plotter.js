// Abbreviation dictionary
const transformDict = {
  'Adalet Partisi' : 'ap',
  'Adalet ve Kalkinma Partisi' : 'akp',
  'Anavatan Partisi' : 'anap',
  'Bagimsiz' : 'bagimsiz',
  'Birlik Partisi' : 'bp',
  'Cumhuriyet Halk Partisi' : 'chp',
  'Cumhuriyetçi Güven Partisi' : 'cgp',
  'Cumhuriyetçi Köylü Millet Partisi' : 'ckmp',
  'Cumhuriyetçi Millet Partisi' : 'cmp',
  'Demokrat Parti' : 'dp',
  'Demokratik Parti' : 'dep',
  'Demokratik Sol Parti' : 'dsp',
  'Dogru Yol Partisi' : 'dyp',
  'Fazilet Partisi' : 'fp',
  'Güven Partisi' : 'gp',
  'Halkçi Parti' : 'hap',
  'Halklarin Demokratik Partisi' : 'hdp',
  'Hürriyet Partisi' : 'hp',
  'Iyi Parti' : 'iyi',
  'Millet Partisi' : 'mp',
  'Millî Selamet Partisi' : 'msp',
  'Milliyetçi Demokrasi Partisi' : 'mdp',
  'Milliyetçi Hareket Partisi' : 'mhp',
  'Refah Partisi' : 'rp',
  'Saadet Partisi' : 'sp',
  'Sosyaldemokrat Halkçi Parti' : 'shp',
  'TBMM' : 'TBMM',
  'Türkiye Birlik Partisi' : 'tbb',
  'Türkiye Isçi Partisi' : 'tip',
  'undefined' : 'nan',
  'Yeni Türkiye Partisi' : 'ytp',
  'Tek Parti': 'tbmm'
}

const colorBrewer = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"];

const colorDict = {
  'akp' : colorBrewer[4],
  'ap' : colorBrewer[1],
  'anap' : colorBrewer[1],
  'mdp' : d3.schemeCategory10[8],
  'hap' : d3.schemeCategory10[9],
  'shp' : colorBrewer[0],
  'rp' : d3.schemeCategory10[1],
  'dsp' : d3.schemeCategory10[2],
  'dyp' : 'purple',
  'fp' : d3.schemeCategory10[4],
  'iyi' : colorBrewer[1],
  'mhp' : d3.schemeCategory10[5],
  'bagimsiz' : colorBrewer[8],
  'hdp' : 'purple',
  'chp' : colorBrewer[0],
  'dp' : d3.schemeCategory10[1],
  'dep' : d3.schemeCategory10[6],
  'tip' : colorBrewer[4],
  'ytp' : d3.schemeCategory10[4],
  'mp' : d3.schemeCategory10[5],
  'sp' : d3.schemeCategory10[4],
  'tbmm' : 'black'
};

// const colorDict = {
//   'akp female' : d3.schemeCategory10[1],
//   'ap female' : d3.schemeCategory10[2],
//   'anap female' : d3.schemeCategory10[7],
//   'mdp female' : d3.schemeCategory10[8],
//   'hap female' : d3.schemeCategory10[9],
//   'shp female' : d3.schemeCategory10[0],
//   'rp female' : d3.schemeCategory10[1],
//   'dsp female' : d3.schemeCategory10[2],
//   'dyp female' : d3.schemeCategory10[3],
//   'fp female' : d3.schemeCategory10[4],
//   'mhp female' : d3.schemeCategory10[5],
//   'bagimsiz female' : d3.schemeCategory10[6],
//   'hdp female' : d3.schemeCategory10[7],
//   'chp female' : d3.schemeCategory10[3],
//   'dp female' : d3.schemeCategory10[1],
//   'dep female' : d3.schemeCategory10[6],
//   'tip female' : d3.schemeCategory10[3],
//   'ytp female' : d3.schemeCategory10[4],
//   'mp female' : d3.schemeCategory10[5]
// };

const elecYears = [1935, 1939, 1943, 1946, 1950, 1954, 1957, 1961, 1965, 1969, 1973, 1977, 1983, 1987, 1991, 1995, 1999, 2002, 2007, 2011, 2015];

var schemePairsReversed = [];

for (let index = 0; index < d3.schemePaired.length; index = index+2) {
  schemePairsReversed.push(d3.schemePaired[index+1], d3.schemePaired[index]);
}

// Plotter function
function drawParliament(csv, term, svgId, width, addLegend, addYear) {

  // Get container geometry:
  document.getElementById(svgId)

  // Set up the plot:
  var parliament = d3.parliament().width(width).innerRadiusCoef(0.25);
  parliament.enter.fromCenter(false).smallToBig(false);
  parliament.update.animate(false);
  parliament.exit.toCenter(false).bigToSmall(false);

  // Draw the plot:
  d3.csv(csv, data => {
    let termData = data.filter(d => { return(d.year == term) });
    let termDataParsed = termData.map(d => {
      return({
        id : transformDict[d.party] + ((d.gender == 'Male') ? ' male' : ' female'),
        seats : +d.count,
        legend : d.party// ((d.gender == 'Male') ? 'Male PM' : d.party + '')
      })
    })

    let manualScaleDomain = [];
    let manualScaleRange = [];

    for (let key of termDataParsed) {
      if (manualScaleDomain.indexOf(key.legend) === -1) {
        manualScaleDomain.push(key.legend);
        manualScaleRange.push(colorDict[key.id.split(' ')[0]]);
      }
    };

    var preScale = d3.scaleOrdinal()
      .domain(manualScaleDomain)
      .range(manualScaleRange);
    parliament.scale(preScale);


    var svg = d3.select(svgId);
    svg.datum(termDataParsed).call(parliament);


    let parties = [];
    termData.forEach(d => {
      if (parties.indexOf(transformDict[d.party]) === -1) { parties.push(transformDict[d.party]) }
    })

    if (addYear) {
      let yearText = svg.selectAll('g.year-text');

      if (yearText.empty()) {
        yearText = svg.append('g')
          .attr('class', 'year-text')
          .attr("transform", "translate(" + 150 + "," + 142.5 + ")");
        }


        yearText.selectAll("text")
          .data([termData[0]])
          .text(d => { return(d.date.split('-')[0]) })
          .enter()
          .append('text')
          .attr("text-anchor", "middle")
          .style("fill", "hsl(0, 0%, 48%)")
          .style("font-size", ".75rem")
          .text(d => { return(d.date.split('-')[0]) });



    }

    if (addLegend) {
      let legend = svg.selectAll('g.legend-container');

      if (legend.empty()) {
        legend = svg.append('g')
          .attr('class', 'legend-container')
          .attr("transform", "translate(350, 40)");
      }

      var legendPath = d3.legendColor()
        .scale(parliament.scale())
        .orient("vertical")
        .shape('circle')
        .shapeRadius(4)
        .cellFilter(d => { return(d.label != 'Male PM'); })
        .classPrefix('legend-')
        .on("cellover", emphasizeParliamentParty)
        .on("cellout", emphasizeParliamentParty)

      svg.select(".legend-container")
        .call(legendPath);
    }

  });
};

function emphasizeParliamentParty(longPartyName) {
  let party = transformDict[longPartyName];
  let seats = document.querySelectorAll('.seat:not(.' + party + ')');
  
  seats.forEach(seat => {
    seat.classList.toggle('deemphasize');
  })
}

function updatePage(term) {
  let title = document.getElementById('title');
  title.textContent = '. Dönem, (' + titleDict[term]['begin_year'] + '-' + titleDict[term]['end_year'] + ')';
}

function drawCircles(csv) {
  let container = document.getElementById('scatter-container').getBoundingClientRect(),
      containerWidth = +container.width,
      containerHeight = Math.min(+container.height, 300);

  let margin = {top: 40, right: 40, bottom: 20, left: 10},
      width = containerWidth - margin.left - margin.right,
      height = containerHeight - margin.top - margin.bottom,
      svg = d3.select('#line-plot-svg')
        .attr('width', containerWidth) // TODO: set maximum width...
        .attr('height', containerHeight), // TODO: set maximum height...
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let timeScale = d3.scaleTime().range([0+margin.left, width-margin.left*2]);
  let parseTime = d3.timeParse('%Y-%m-%d');

  let yScale = d3.scaleLinear().range([height, 0]);

  d3.csv(csv, data => {
    data.forEach(d => {
      d.date = parseTime(d.date);
      d.percwoman = +d.women / +d.seat;
    });

    data = data.filter(d => { return(+d.year > 1); });

    timeScale.domain(d3.extent(data, d => { return d.date; }));
    yScale.domain(d3.extent(data, d => { return d.percwoman; }));

    let xAxis = d3.axisTop(timeScale)
      .tickValues(elecYears.map((d, i) => {
        if ((containerWidth < 600) & ((i % 2) !== 0)) {
          return(null)
        } else {
          return(d3.timeParse('%Y')(d));
        }
      }).filter(d => d))
      .tickFormat(d3.timeFormat("'%y"));

    let yAxis = d3.axisRight(yScale)
      .tickFormat(d => parseInt(d*100) + '%')
      .tickSize(-width);

    g.append("g")
      .attr("transform", "translate(0," + -margin.top/2 + ")")
      .attr("class","axis")
      .call(xAxis)
      .select('.domain')
      .remove();

    g.append("g")
      .attr("transform", "translate(" + width + ", 0)")
      .classed("axis is-y", true)
      .call(yAxis) // TODO: axis ticks look like minuses; // TODO: lack of axis lines make it difficult to read...
      .select('.domain')
      .remove();

    g.selectAll('circle')
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => { return timeScale(d.date); })
      .attr("cy", d => { return yScale(d.percwoman); })
      .attr("r", "3.5px")
      .attr('fill', 'black')
      .attr('stroke', 'black')
      .on('click', d => { drawParliament('/assets/lab/gnat-gender/data/tbmm_party_gender.csv', +d.year, '#plot-svg', 300, true, true) });

    });
}
