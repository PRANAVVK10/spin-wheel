<script>
  import { post } from "$lib/api";

  import { onMount } from "svelte";

  let res = {};

  let viewUrl = "";
  //   let streamerUrl = "";

  onMount(async () => {
    res = await post(`spin/create/`);
    console.log(res);
    viewUrl = `http://localhost:3310/spin/${res.spin.id}`;
    //    streamerUrl = `http://localhost:3310/spin/control/${res.spin.id}`
  });
</script>

{#if res.spin}
  <section
    class="h-screen lg:mr-96 lg:ml-96 mr-40 ml-40 flex flex-col justify-center"
  >
    <div class="w-full">
      <label for="" class="text-blue-600">obs link:</label>
      <input
        type="text"
        bind:value={viewUrl}
        class="w-full h-10 pl-5 rounded"
      />
    </div>
    <!-- <div class="w-full mt-10">
    <label for="">streamer link:</label>
    <input type="text" bind:value={streamerUrl} class="w-full h-10 pl-5 rounded"/>
    </div> -->
  </section>
{/if}
