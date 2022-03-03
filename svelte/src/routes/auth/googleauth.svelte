<script>
import { onMount } from 'svelte';
import Cookie from 'cookie-universal'
const cookies = Cookie()

onMount( () => {
let params = new URLSearchParams(location.search);
let user =  params.get('user');
console.log(user);
let accessToken = params.get('access');
console.log(accessToken);
let expires = params.get('expires');

console.log(expires);


cookies.set('userID', user,{
  path: '/',
  maxAge: 60*60*24
})
cookies.set('accessToken', accessToken,{
  path: '/',
  maxAge: 60*60*24
})
// Cookies.set('expire', expires)


console.log(document.cookie);

    setTimeout(() => {
        window.location.href="/overview"; 
    }, 100);
});



    
</script>

<h2>googleauth</h2>




