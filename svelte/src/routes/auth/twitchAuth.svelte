<script>
  import { onMount } from "svelte";
  import Cookie from "cookie-universal";
  const cookies = Cookie();

  onMount(() => {
    let params = new URLSearchParams(location.search);
    let userId = params.get("user_id");
    console.log(userId);
    let userName = params.get("user_name");
    console.log(userName);
    let userEmail = params.get("user_email");
    console.log(userEmail);
    let accessToken = params.get("access");
    console.log(accessToken);

    cookies.set("twitchID", userId, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    cookies.set("UserName", userName, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    cookies.set("UserEmail", userEmail, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    cookies.set("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    // Cookies.set('expire', expires)

    console.log(document.cookie);

    setTimeout(() => {
      window.location.href = "/overview";
    }, 100);
  });
</script>

<h2>twitchauth</h2>
