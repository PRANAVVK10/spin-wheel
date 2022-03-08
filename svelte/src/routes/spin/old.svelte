<script context="module">
  export async function load({ params }) {
    const { id } = params;
    return {
      props: { id },
    };
  }
</script>

<script>
  import SpinComponent from "$lib/spinComponent.svelte";

  import { slices, getChats, viewers, viewersArray } from "$lib/store";

  import { onMount } from "svelte";

  import Cookie from "cookie-universal";

  import { get } from "$lib/api";

  const cookies = Cookie();

  //global variables
  const numberOfSlices = 1;

  const colors = ["red", "blue", "pink", "green", "purple"];

  let currentIndex = 0;

  let d4;

  export let id;

  let streamerId;

  onMount(async () => {
    for (let i = 0; i <= numberOfSlices; i++) {
      $slices[i] = { key: i, label: "", id: "", color: colors[i] };
    }

    // get spin
    const spin = await get(`spin/get/${id}`);

    streamerId = spin.user;

    d4 = d3; //d3

    const client = new tmi.Client({
      channels: [spin.username], //streamerName
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      let visiterId = tags["user-id"];
      let visiterName = tags["display-name"];

      //remove duplicate chats

      $getChats.push({ visiterId, visiterName });
      $getChats.map((item) => {
        const { visiterId, visiterName } = item;

        if ($viewers[visiterId]) {
          $viewers[visiterId].times = $viewers[visiterId].times + 1;
        } else {
          $viewers[visiterId] = {
            name: visiterName,
            id: visiterId,
            times: 1,
          };
        }
      });
      $viewersArray = Object.values($viewers); //[{id:"",name:"",times:""},{id:"",name:"",times:""}]

      console.log({ $viewersArray });

      //

      // $viewersArray.map((v) => {
      //   const { id, name, times } = v;
      //   if (times == 1 && currentIndex < numberOfSlices) {
      //     console.log(times);
      //     currentIndex++;
      //     $slices[currentIndex] = {
      //       key: 0,
      //       label: name,
      //       id: id,
      //       color: colors[currentIndex],
      //     };
      //   }
      //   if (currentIndex == 2) {
      //     currentIndex = 0;
      //     // Object.values($slices).forEach((item, i) => {
      //     // $slices[i] = { key: i, label: "", id: "", color: colors[i] };
      //     // });
      //   }
      // });

      //increase current position or change position to 0

      console.log({ $slices });

      if (currentIndex < numberOfSlices && $viewersArray[currentIndex]) {
        $slices[currentIndex] = {
          key: 0,
          label: $viewersArray[currentIndex].name,
          id: $viewersArray[currentIndex].id,
          color: colors[currentIndex],
        };
        currentIndex++;
      } else {
        currentIndex = 0;
        Object.values($slices).forEach((item, i) => {
          $slices[i] = { key: i, label: "", id: "", color: colors[i] };
        });
      }
    });
  });
</script>

{#await Object.values($slices).length > 0 then _}
  {#await streamerId then _}
    <SpinComponent {streamerId} />
  {/await}
{/await}
