<script>
  import { afterUpdate, onMount } from "svelte";

  import {
    slices,
    currentIndex,
    flag,
    colors,
    numberOfSlices,
  } from "$lib/store";

  import { get } from "$lib/api";
  import { attr } from "svelte/internal";
  $: data = Object.values($slices);

  //global variables
  let newChart;
  let toReplaceElement;
  export let streamerId;
  let winnerWindow;
  let winnerWindowLabel;
  let winnerContainer;
  let profile;

  let height;
  let width;

  afterUpdate(() => {
    var padding = { top: 0, right: 0, bottom: 0, left: 0 },
      w = width - padding.left - padding.right,
      h = height - padding.top - padding.bottom,
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

    var newSVG = svg
      .append("defs")
      .append("filter")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "1")
      .attr("height", "1")
      .attr("id", "solid");

    newSVG
      .append("feFlood")
      .attr("flood-color", "rgba(255,255,255,0.2)")
      .attr("result", "bg");

    var feMerge = newSVG.append("feMerge");

    feMerge.append("feMergeNode").attr("in", "bg");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

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

    var arcElement = arcs
      .append("text")
      .attr("filter", "url(#solid)")

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
      .attr("x", "-10")
      .attr("y", "6")
      .style({
        fill: "white",
        "font-weight": "bold",

        "font-size": "1.3rem",
        // stroke: "white",
      });

    arcElement.append("tspan").text(function (d, i) {
      return data[i].label ? `⠀${data[i].label.substring(0, 13)}` + "...⠀" : "";
    });

    // container.on("click", spin);

    // container.on("click", null);

    if (data.length == 10 && $slices[9].key == 0) {
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
            profile = await get(
              `users/getimage/${data[picked].id || undefined}/${
                data[picked].label || undefined
              }/${streamerId || undefined}`
            );

            console.log({ profile });
            winnerContainer.style.backgroundColor = "#f0f4ff";
            winnerContainer.style.opacity = ".9";
            winnerContainer.style.boxShadow = "10px 20px 100px rgba(0,0,0,1)";

            winnerWindow.innerHTML = `<img src="${profile.profile_image_url}" width=${width} height=${height}/>`;
            winnerWindowLabel.innerHTML = `<h1>${data[picked].label} wins the game</h1>`;
            winnerContainer.style.fontFamily = "Bebas Neue";
            // winnerContainer.style.fontSize = "small";

            oldrotation = rotation;
            /* Get the result value from object "data" */
            // console.log(data[picked].value);

            for (let i = 0; i <= $numberOfSlices; i++) {
              $slices[i] = { key: i, label: "", id: "", color: $colors[i] };
            }
            $currentIndex = -1;
            setTimeout(() => {
              winnerWindow.innerHTML = "";
              winnerWindowLabel.innerHTML = "";
              winnerContainer.style.backgroundColor = "transparent";
              winnerContainer.style.boxShadow = "10px 20px 100px rgba(0,0,0,0)";
              $flag = true;
            }, 3000);
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

    //volcano logo
    // container
    //   .append("svg:image")
    //   .attr("xlink:href", "https://volcano.live/Assets/volcano%20_logo.png")
    //   .attr("x", "-28")
    //   .attr("y", "-30");

    //spin text

    container
      .append("text")
      .attr("x", 0)
      .attr("y", 13)
      .attr("text-anchor", "middle")
      .text("volcano")
      .style({
        "font-weight": "bold",
        "font-size": "30px",
        "font-family": "Bebas Neue",
      });

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

<!-- height and width -->

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div bind:this={newChart} id="chart" class="absolute w-screen h-screen">
  <!-- <div bind:this={toReplaceElement}>

    </div> -->
</div>

<div
  bind:this={winnerContainer}
  class="absolute w-screen h-screen rounded-xl overflow-hidden"
  id="winnerContainer"
>
  <div bind:this={winnerWindowLabel} id="question" class="" />
  <div
    bind:this={winnerWindow}
    id="winnerImage"
    class="flex justify-center items-center w-screen h-screen"
  />
</div>

<style>
  /* #chart {
    position: absolute;
    width: 100%;
    height: 100%;

  } */

  /* #winnerContainer {
    position: absolute;
    width: 460px;
    height: 300px;
    top: 130px;
    left: 20px;
    border-radius: 20px;
  } */

  /* #question h1 {
    font-size: 20px;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: 0;
    margin: 0;
    top: 40%;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
  } */
  /* #winnerImage {
    margin-left: 150px;
    margin-top: 20px;
    
  } */
</style>
