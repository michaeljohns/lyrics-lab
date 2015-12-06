// Based on example code at https://github.com/square/crossfilter/blob/gh-pages/index.html
d3.csv("data/year_artist_song_count.csv", function(error, data) {
  // Various formatters.
  var formatNumber = d3.format(",d");
  //     formatChange = d3.format("+,d"),
  //     formatDate = d3.time.format("%B %d, %Y"),
  //     formatTime = d3.time.format("%I:%M %p");
  // A nest operator, for grouping the flight list.
  // var nestByDate = d3.nest()
  //     .key(function(d) { return d3.time.day(d.date); });
  // // A little coercion, since the CSV is untyped.
  // flights.forEach(function(d, i) {
  //   d.index = i;
  //   d.date = parseDate(d.date);
  //   d.delay = +d.delay;
  //   d.distance = +d.distance;
  // });
  // Create the crossfilter for the relevant dimensions and groups.
  // var flight = crossfilter(flights),
  //     all = flight.groupAll(),
  //     date = flight.dimension(function(d) { return d.date; }),
  //     dates = date.group(d3.time.day),
  //     hour = flight.dimension(function(d) { return d.date.getHours() + d.date.getMinutes() / 60; }),
  //     hours = hour.group(Math.floor),
  //     delay = flight.dimension(function(d) { return Math.max(-60, Math.min(149, d.delay)); }),
  //     delays = delay.group(function(d) { return Math.floor(d / 10) * 10; }),
  //     distance = flight.dimension(function(d) { return Math.min(1999, d.distance); }),
  //     distances = distance.group(function(d) { return Math.floor(d / 50) * 50; });
  //

  function formatYear(fourDigitYear) {
    return "'" + fourDigitYear.toString().substring(2);
  }

  data.forEach(function(d, i) {
    d.index = i;
    d.count = +d.count; // Ensure number
    d.year = +d.year;
  });

  var $startYear = $('#start-year'),
    $endYear = $('#end-year');

  // YASC: YearArtistSongCount
  var yasc = crossfilter(data),
      all = yasc.groupAll(),
      year = yasc.dimension(function(d) { return d.year; }),
      years = year.group(),
      artist = yasc.dimension(function(d) { return d.artist; }),
      artists = artist.group(),
      yearsAll = years.all(),
      nestByYear = d3.nest()
           .key(function(d) { return d.year; });

  var charts = [
    barChart()
        .dimension(year)
        .group(years)
      .x(d3.scale.linear()
        .domain([1970, 2015])
        .range([0, 900]))
      .y(d3.scale.linear()
        .domain([0, 100])
        .range([200, 0])),
  ];

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  var chart = d3.selectAll(".chart")
      .data(charts)
      .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

  // Render the initial lists.
  var list = d3.selectAll(".list")
      .data([generateListing]);

  // Render the total.
  d3.selectAll("#total")
      .text(formatNumber(yasc.size()));
  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
    list.each(render);
    d3.select("#active").text(formatNumber(all.value()));
  }

  // Like d3.time.format, but faster.
  function parseDate(d) {
    return new Date(2001,
        d.substring(0, 2) - 1,
        d.substring(2, 4),
        d.substring(4, 6),
        d.substring(6, 8));
  }

  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };

  function reduceAdd(p, v) {
    ++p.count;
    p.total += v.count;
    p.artist = v.artist;
    return p;
  }

  function reduceRemove(p, v) {
    --p.count;
    p.total -= v.count;
    p.artist = v.artist;
    return p;
  }

  function reduceInitial() {
    return {count: 0, total: 0, artist: ''};
  }

  function orderValue(p) {
    return p.total;
  }

  function generateListing(div) {
    div.each(function() {
      var results = artists.reduce(reduceAdd, reduceRemove, reduceInitial).order(function(p) {
          return (1000 + p.total) + p.artist; // First use totals and then use alphabetical to break ties.
        }).top(10);

      var artistResultsEl = d3.select(this);
      artistResultsEl.selectAll(".artist").remove(); // Clean up old

      var artist = artistResultsEl.selectAll(".artist").data(results);

      var artistEnter = artist.enter().append("tr")
          .attr("class", "artist");

      artistEnter.append("td")
          .attr("class", "ranking-position")
          .text(function(d, i) {
            return i + 1; // Convert from zero-based indexing
          });

      artistEnter.append("td")
          .attr("class", "artist-name")
          .text(function(d) {
            return d.key;
          });

      artistEnter.append("td")
          .attr("class", "song-count")
          .text(function(d) {
            return d.value.total;
          });

      artistEnter.append("td")
          .attr("class", "song-years")
          .text(function(d) {
            return d.value.count;
          });

      artist.exit(); //.remove();

      //artist.order();
    });
  }

  function barChart() {
    if (!barChart.id) barChart.id = 0;
    var margin = {top: 10, right: 10, bottom: 40, left: 40},
        x,
        y, // = d3.scale.linear().range([110, 0]),
        id = barChart.id++,
        axisX = d3.svg.axis().orient("bottom").tickFormat(formatYear),
        axisY = d3.svg.axis().orient("left"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];
      //y.domain([0, group.top(1)[0].value]);

      //y.domain([0, 100]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          // Set X Axis
          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axisX);

          g.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 30)
            .text("Year");

          // Set Y Axis
          g.append("g")
              .attr("class", "axis")
              .call(axisY);

          g.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .attr("y", -40)
              .attr("dy", ".75em")
              .attr("x", -50)
              .attr("transform", "rotate(-90)")
              .text("Unique Artists");

          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }
        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }
        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();

      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);

      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));

      var filter = [Math.floor(extent[0]), Math.ceil(extent[1])]

      //console.log('Filter ' + filter[0] + ' -- ' + filter[1]);
      $startYear.text(filter[0]);
      $endYear.text(filter[1] - 1);
      dimension.filterRange(filter);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
        $startYear.text(1970);
        $endYear.text(2015 - 1);
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axisX.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      axisY.scale(y);
      //brush.y(y);
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }
});

function init_charts() {
  //d3.json("data/year_artist_song_count.json", function(error, data) {
  //d3.json("file:///Users/kbuhrer/Documents/Personal/School/CSCI%20E-109/project/data/year_artist_song_count.json", function(error, data) {
  // d3.csv("data/year_artist_song_count.csv", function(error, data) {
  //
  //   if (error) {
  //     alert(error);
  //     return;
  //   }
  //
  //   // YASC: YearArtistSongCount
  //   var yasc = crossfilter(data);
  //   var year = yasc.dimension(function(d) { return d.year; }),
  //     years = year.group(),
  //     years_all = years.all();
  //     // year = yasc.dimension(function(d) { return d.date.getHours() + d.date.getMinutes() / 60; }),
  //     // hour = flight.dimension(function(d) { return d.date.getHours() + d.date.getMinutes() / 60; }),
  //   //   hours = hour.group(Math.floor),
  //   //
  //   // yascData = barChart()
  //   //       .dimension(year)
  //   //       .group(years)
  //   //     .x(d3.scale.linear()
  //   //       .domain([1970, 2014])
  //   //       .rangeRound([0, 100]));
  //   //
  //   // var chart = d3.select(".chart-yasc")
  //   //     .data(yascData)
  //   //     .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });
  //
  //   // var x = d3.scale.linear()
  //   //   .domain([1970, 2014])
  //   //   .range([0, 100]);
  //   //
  //   // d3.select(".chart-yasc")
  //   //   .selectAll("div")
  //   //     .data(years)
  //   //   .enter().append("div")
  //   //     .style("width", function(d) {
  //   //       return x(d) + "px";
  //   //     })
  //   //     .text(function(d) {
  //   //       return d;
  //   //     });
  //
  //   //debugger;
  //
  //
  //   var width = 960,
  //     height = 100,
  //   barWidth = 20;
  //
  //   // var x = d3.scale.linear()
  //   //         .domain([0, 100])
  //   //         .range([1970, 2014]);
  //   // var x = d3.scale.linear()
  //   //         .range([0, 100]);
  //
  //   var chart = d3.select(".chart-yasc")
  //       .attr("width", width);
  //
  //   //x.domain([0, d3.max(data, function(d) { return d.value; })]);
  //
  //   chart.attr("height", 120); //barHeight * years.size());
  //
  //   var bar = chart.selectAll("g")
  //       .data(years_all)
  //     .enter().append("g")
  //       .attr("transform", function(d, i) {
  //         return "translate(" + i * barWidth + ", " + (100 - d.value) + ")";
  //       });
  //
  //   bar.append("rect")
  //       .attr("width", barWidth - 1)
  //       .attr("height", function(d) {
  //         //return x(d.value);
  //         return d.value;
  //       });
  //
  //   bar.append("text")
  //         .attr("x", barWidth - 4)
  //         .attr("y", function(d) {
  //           //return x(d.value) - 3;
  //           return 10;
  //         })
  //         //.attr("dy", ".35em")
  //         .text(function(d) {
  //           return d.value;
  //         })
  //
  //   bar.append("text")
  //         .attr("class", "bar-outer-label")
  //         .attr("x", barWidth - 4)
  //         .attr("y", function(d) {
  //           //return x(d.value) - 3;
  //           return d.value + 10;
  //         })
  //         //.attr("dy", ".35em")
  //         .text(function(d) {
  //           return "'" + d.key.substring(2);
  //         });
  //
  //   });
  //});
}

init_charts();
