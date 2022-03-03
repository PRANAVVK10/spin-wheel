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
  import { chatName, chats, getChats, viewersArray, viewers } from "$lib/store";
  import { onMount } from "svelte";
  import Cookie from "cookie-universal";
  import { get } from "$lib/api";
  const cookies = Cookie();

  //global variables

  let d4;

  export let id;
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onMount(async () => {
    // let streamer = cookies.get("UserName");
    const spin = await get(`spin/get/${id}`);
    console.log({ spin });
    d4 = d3;
    const client = new tmi.Client({
      channels: [spin.username], //pranavvk10
    });

    client.connect();

    client.on("message", (channel, tags, message, self) => {
      let id = tags["user-id"];
      let name = tags["display-name"];

      $getChats.push({ id, name });

      $getChats.map((item) => {
        const { id, name } = item;

        if ($viewers[id]) {
          $viewers[id].times = $viewers[id].times + 1;
        } else {
          $viewers[id] = { name: name, times: 1, color: getRandomColor() };
        }
      });

      $viewersArray = Object.values($viewers);
      console.log({ $viewersArray });
    });
  });

  $: if ($viewersArray.length < 3) {
    $chats = [];
    $viewersArray.map((v, i) => {
      $chats = [
        ...$chats,
        {
          label: v.name,
          value: i + 1,
          question: `${v.name} wins the game`,
          color: v.color,
        },
      ];
    });
  }

  $: if ($viewersArray.length == 0) {
    $chats = [
      { label: "", color: getRandomColor() },
      { label: "", color: getRandomColor() },
      { label: "", color: getRandomColor() },
      { label: "", color: getRandomColor() },
      { label: "", color: getRandomColor() },
    ];
  }
</script>

<SpinComponent />
