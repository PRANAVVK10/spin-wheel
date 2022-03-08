<script>
  import { afterUpdate } from "svelte";

  import {
    slices,
    currentIndex,
    flag,
    colors,
    numberOfSlices,
  } from "$lib/store";

  import { get } from "$lib/api";

  $: data = Object.values($slices);

  //global variables
  let newChart;
  let toReplaceElement;
  export let streamerId;
  let winnerWindow;
  let winnerWindowLabel;

  afterUpdate(() => {
    var padding = { top: 20, right: 40, bottom: 0, left: 0 },
      w = 500 - padding.left - padding.right,
      h = 500 - padding.top - padding.bottom,
      r = Math.min(w, h) / 2,
      rotation = 0,
      oldrotation = 0,
      picked = 100000,
      oldpick = [];
    // color = d3.scale.category20();
    //category20c()

    //spin div
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
        return d.data.color;
      })
      .attr("d", function (d) {
        return arc(d);
      });

    // add text

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
      .style({ fill: "", "font-weight": "bold", "font-size": "16px" })
      .text(function (d, i) {
        return data[i].label;
      });

    // container.on("click", spin);

    // container.on("click", null);

    if (data.length == 2 && $slices[1].key == 0) {
      $flag = false;
      spin();
    }

    function spin(d) {
      container.on("click", null);
      //all slices have been seen, all done
      console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
      if (oldpick.length == data.length) {
        console.log("done");
        // container.on("click", null);
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
        .each("end", async function () {
          // mark question as seen
          // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
          //     .attr("fill", "#111");
          // populate question

          if (data[picked].id) {
            const profile = await get(
              `users/getimage/${data[picked].id || undefined}/${
                data[picked].label || undefined
              }/${streamerId || undefined}`
            );

            console.log({ profile });
            winnerWindow.innerHTML = `<img src="${profile.profile_image_url}" width="200" height="200"/>`;
            winnerWindowLabel.innerHTML = `<h1>${data[picked].label} wins the game</h1>`;

            oldrotation = rotation;
            /* Get the result value from object "data" */
            // console.log(data[picked].value);

            for (let i = 0; i <= $numberOfSlices; i++) {
              $slices[i] = { key: i, label: "", id: "", color: $colors[i] };
            }
            $currentIndex = -1;
            $flag = true;
          }
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
  });
</script>

<div bind:this={newChart} id="chart">
  <!-- <div bind:this={toReplaceElement}>

    </div> -->
</div>
<div id="winnerContainer">
  <div bind:this={winnerWindow} id="winnerImage" />
  <div bind:this={winnerWindowLabel} id="question" />
</div>

<style>
  #chart {
    position: absolute;
    width: 500px;
    height: 500px;
    top: 0;
    left: 0;
  }
  #winnerContainer {
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
    top: 40%;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
  }
  #winnerImage {
    margin-left: 100px;
    margin-top: 20px;
  }
</style>
