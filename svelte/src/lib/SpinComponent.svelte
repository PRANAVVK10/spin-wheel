<script>
  import { afterUpdate, onMount } from "svelte";
  import { chatName, chats, getChats, viewersArray, viewers } from "$lib/store";

  $: data = $chats;
  let newChart;
  let toReplaceElement;

  afterUpdate(() => {
    var padding = { top: 20, right: 40, bottom: 0, left: 0 },
      w = 500 - padding.left - padding.right,
      h = 500 - padding.top - padding.bottom,
      r = Math.min(w, h) / 2,
      rotation = 0,
      oldrotation = 0,
      picked = 100000,
      oldpick = [],
      color = d3.scale.category20();
    //category20c()

    const newNode = document.createElement("div");

    var svg = d3
      .select(newNode)
      .append("svg")
      .data([data])
      .attr("width", w + padding.left + padding.right)
      .attr("height", h + padding.top + padding.bottom);

    var container = svg
      .append("g")
      .attr("class", "chartholder")
      .attr(
        "transform",
        "translate(" +
          (w / 2 + padding.left) +
          "," +
          (h / 2 + padding.top) +
          ")"
      );
    var vis = container.append("g");

    var pie = d3.layout
      .pie()
      .sort(null)
      .value(function (d) {
        return 1;
      });
    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    var arcs = vis
      .selectAll("g.slice")
      .data(pie)
      .enter()
      .append("g")
      .attr("class", "slice");

    arcs
      .append("path")
      .attr("fill", function (d, i) {
        console.log("color");
        console.log({ d, i });
        return d.data.color;
      })
      .attr("d", function (d) {
        return arc(d);
      });
    // add the text

    arcs
      .append("text")
      .attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return (
          "rotate(" +
          ((d.angle * 180) / Math.PI - 90) +
          ")translate(" +
          (d.outerRadius - 10) +
          ")"
        );
      })
      .attr("text-anchor", "end")
      .style({ fill: "" })
      .text(function (d, i) {
        return data[i].label;
      });

    // container.on("click", spin);

    container.on("click", null);

    if (data.length == 2) {
      spin();
    }

    function spin(d) {
      container.on("click", null);
      //all slices have been seen, all done
      console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
      if (oldpick.length == data.length) {
        console.log("done");
        container.on("click", null);
        return;
      }
      var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor(Math.random() * 1440 + 360);

      rotation = Math.round(rng / ps) * ps;

      picked = Math.round(data.length - (rotation % 360) / ps);
      picked = picked >= data.length ? picked % data.length : picked;
      if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
      } else {
        oldpick.push(picked);
      }
      rotation += 90 - Math.round(ps / 2);
      vis
        .transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function () {
          // mark question as seen
          // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
          //     .attr("fill", "#111");
          // populate question

          d3.select("#question h1").text(data[picked].question);
          oldrotation = rotation;

          /* Get the result value from object "data" */
          console.log(data[picked].value);

          //clear all data inside the wheel

          $chats = [];
          $viewersArray = [];
          $getChats = [];
          for (const key in $viewers) {
            delete $viewers[key];
          }

          /* Comment the below line for restrict spin to sngle time */
          // container.on("click", spin);
        });
    }
    //make arrow
    svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          (w + padding.left + padding.right) +
          "," +
          (h / 2 + padding.top) +
          ")"
      )
      .append("path")
      .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
      .style({ fill: "black" });
    //draw spin circle
    container
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 60)
      .style({ fill: "white", cursor: "pointer" });
    //spin text
    container
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("")
      .style({ "font-weight": "bold", "font-size": "40px" });

    function rotTween(to) {
      var i = d3.interpolate(oldrotation % 360, rotation);
      return function (t) {
        return "rotate(" + i(t) + ")";
      };
    }

    newChart.innerHTML = "";
    newChart.appendChild(newNode);
    console.log({ newNode });
  });
</script>

<div bind:this={newChart} id="chart">
  <!-- <div bind:this={toReplaceElement}>

    </div> -->
</div>
<div id="question"><h1 /></div>

<style>
  #chart {
    position: absolute;
    width: 500px;
    height: 500px;
    top: 0;
    left: 0;
  }
  #question {
    position: absolute;
    width: 400px;
    height: 500px;
    top: 0;
    left: 520px;
  }
  #question h1 {
    font-size: 50px;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    padding: 0;
    margin: 0;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
  }
</style>
