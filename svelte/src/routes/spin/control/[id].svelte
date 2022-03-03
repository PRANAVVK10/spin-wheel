<script context="module">

    export async function load ({params}) {
      const { id } = params;
      return {
         props : {id}
        }
    }
  </script>

<script>
    export let id;

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"


import { collection, getDocs } from "firebase/firestore"; 
import { onMount } from "svelte";


import { doc, updateDoc } from "firebase/firestore";
import { get } from "svelte/store";
import { post } from "$lib/api";



const firebaseConfig = {
  apiKey: "AIzaSyAyIhShe4s96hb_50pnETVJp2xDTAuh-60",
  authDomain: "chat-52712.firebaseapp.com",
  projectId: "chat-52712",
  storageBucket: "chat-52712.appspot.com",
  messagingSenderId: "895696103728",
  appId: "1:895696103728:web:5e372394b2a0613d0140f5",
  measurementId: "G-EY7EDB9TNM"
};

const app = initializeApp(firebaseConfig);
 
const db = getFirestore();



onMount(async ()=>{

        // Initialize Firebase
    
    const analytics = getAnalytics(app);
  

})

const spin = async () =>{
  //   const washingtonRef = doc(db, "bridge", id);

  //   // Set the "capital" field of the city 'DC'
  //   await updateDoc(washingtonRef, {
  //   spin: true
   
  //   });
  console.log("spin clicked");

    const response = await post('spin/start',{
      id
    })
    }


</script>

<section class="w-screen flex justify-center mt-14">
    <button class="border-2 border-green-500 bg-green-500 p-2 rounded text-white" on:click={spin} >spin</button>
</section>