<script context="module">
  export async function load({ params }) {
    const { id } = params;
    return {
      props: { id },
    };
  }
</script>

<script>
  import SpinComponent from "$lib/SpinComponent.svelte";

  import { slices, currentIndex, flag } from "$lib/store";

  import { onMount } from "svelte";

  import { get } from "$lib/api";

  //global variables
  const numberOfSlices = 1;

  const colors = ["red", "blue", "pink", "green", "purple"];

  $currentIndex = -1;

  let d4;

  export let id;

  let streamerId;

  let currentId;
  let currentName;

  onMount(async () => {
    for (let i = 0; i <= numberOfSlices; i++) {
      $slices[i] = { key: i, label: "", id: "", color: colors[i] };
    }

    // get spin
    const spin = await get(`spin/get/${id}`);

    streamerId = spin.user;

    console.log({ streamerId });

    d4 = d3; //d3

    const client = new tmi.Client({
      channels: [spin.username], //streamerName
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      currentId = tags["user-id"];
      currentName = tags["display-name"];

      if ($flag == true) {
        if ($currentIndex < numberOfSlices) {
          console.log("currentIndex < numberOfSlices");
          if (Object.values($slices).some(exists)) {
            console.log("Duplicate Found");
          } else {
            $currentIndex++;
            $slices[$currentIndex] = {
              key: 0,
              label: currentName,
              id: currentId,
              color: colors[$currentIndex],
            };
          }
        } else {
          $currentIndex = -1;
          // Object.values($slices).forEach((item, i) => {
          //   $slices[i] = { key: i, label: "", id: "", color: colors[i] };
          // });
        }
      }
    });

    const exists = (element) => {
      return element.id == currentId;
    };
  });
</script>

{#await $currentIndex then _}
  {#await streamerId then _}
    <SpinComponent {streamerId} />
  {/await}
{/await}
