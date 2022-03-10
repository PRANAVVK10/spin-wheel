<script>
  const loginWithGoogle = () => {
    // window.location.href = import.meta.env.VITE_SERVER_URL+'/v1/auth/google';
    window.location.href = import.meta.env.VITE_SERVER_URL + "/v1/auth/google";
  };

  const signInHandler = () => {
    window.location.href = import.meta.env.VITE_SERVER_URL + "/v1/auth/twitch";
  };
</script>

<div class="h-screen flex justify-around">
  <!-- <input
    class="mb-10 h-10 rounded-md pl-2 shadow-md outline-none"
    type="text"
    placeholder="UserName"
  />
  <input
    class="mb-10 h-10 rounded-md pl-2 shadow-md outline-none"
    type="text"
    placeholder="Password"
  /> -->
  <button
    class=" rounded bg-blue-500 text-white p-3 shadow-lg w-60 h-20 mt-40 ml-44"
    on:click={signInHandler}>sign in with twitch</button
  >
  <button
    class=" rounded bg-blue-500 text-white p-3 shadow-lg w-60 h-20 mt-40 mr-44"
    on:click={loginWithGoogle}>sign in with google</button
  >
</div>
