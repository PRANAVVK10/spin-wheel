<script>
  const loginWithGoogle = () => {
    // window.location.href = import.meta.env.VITE_SERVER_URL+'/v1/auth/google';
    window.location.href = import.meta.env.VITE_SERVER_URL + "/v1/auth/google";
  };

  const signInHandler = () => {
    window.location.href = import.meta.env.VITE_SERVER_URL + "/v1/auth/twitch";
  };
</script>

<div
  class="h-screen lg:mr-96 lg:ml-96 mr-40 ml-40 flex flex-col justify-center"
>
  <input
    class="mb-10 h-10 rounded-md pl-2 shadow-md outline-none"
    type="text"
    placeholder="UserName"
  />
  <input
    class="mb-10 h-10 rounded-md pl-2 shadow-md outline-none"
    type="text"
    placeholder="Password"
  />
  <button
    class="mb-10 rounded bg-blue-500 text-white p-3 shadow-lg"
    on:click={signInHandler}>sign in with twitch</button
  >
  <button
    class=" rounded bg-blue-500 text-white p-3 shadow-lg"
    on:click={loginWithGoogle}>sign in with google</button
  >
</div>
