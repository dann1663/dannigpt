<script setup>
import SoMe from "@/components/SoMe.vue";
import App from "@/App.vue";
import axios from "axios";



</script>

<template>
  <div id="container">
  <main>
    <h1>DanniGPT</h1>
    <p style="color: rgb(173, 173, 173);">Har du en dårlig dag? så byder vi dig velkommen til DanniGPT!</p>

<p><b>Model: Chatgpt 4.0 Turbo.</b></p>
<div class="loader" v-show="isLoading"></div>

<div class="box" v-show="generateBox"> 
<p>{{ generatedText }}</p>
</div>


<div class="input">
<input @keyup.enter ="generateResponse()" v-model="userInput" placeholder="indtast dit prompt">
</div>
<div class="button">
  <button @click ="generateResponse()" class="pointer">Send</button>
</div>
  <div v-show="isLoading">
<p v-if="generatedText"></p>
</div>
  </main>
</div>

<SoMe/>
</template>


<script>

export default {
  data() {
    return {
      userInput: '',
      generatedText:'',
      isLoading: false,
      generateBox: false,
      apiKey: '',
    };
  }, 
  components: {
    SoMe
  },
  methods: {
    async fetchApiKey() {
      try {
        const response = await axios.get('https://us-central1-dannigbt-6f10d.cloudfunctions.net/getApiKey');
        this.apiKey = response.data;
      } catch (error) {
        console.error('Error fetching API key:', error);
   
      }
    },
  async generateResponse() {
    this.isLoading = true;

    // Fetch API key before generating response
    await this.fetchApiKey();
    try {
    // Send en anmodning til din cloud-funktion
    const response = await axios.post('https://us-central1-dannigbt-6f10d.cloudfunctions.net/generateText', {
      userInput: this.userInput
    });

    // Håndter svar
    this.generatedText = response.data.generatedText;
    this.isLoading = false;
    this.generateBox = true;
  } catch (error) {
    console.error('Fejl ved generering af svar:', error);
    // Håndter fejl
    this.isLoading = false;
  }
   
  }
  
}};


</script>
<style scoped>

#container {
  display: flex;
  justify-content: center;
  align-items: center;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #343541;
  gap: 2px;
  border-radius: 10px;
  box-shadow: -3px -3px 7px hotpink, 3px 3px 7px #bbc3cc;
  padding: 20px;
  width: 600px;
  margin-top: 10%;
  text-align: center;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
@media only screen and (max-width: 600px) {
  main {
    width: 350px;
  }
}
.input {
margin-top: 30px;
}
input {
  background: #535466;
  color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 1em;
text-align: center;
}

::placeholder {
color: rgb(141, 141, 141);
opacity: 1; 
}

::-ms-input-placeholder { /* Edge 12 -18 */
color: rgb(141, 141, 141);
}

.box {
  border: solid hotpink 2px;
  border-radius: 10px;
  padding: 10px 30px;
  margin-top: 5%;
}
button {
  border: grey 2px solid;
  background: #343541;
  border-radius: 10px;
  padding: 5px 20px 5px 20px;
  width: 120px;
  color: white;
  font-size: 1em;
  transition: 0.1s;
  font-weight: bold;
  margin-top: 20%;
  
} 
button:hover {
  background: #535466;
  color: white;
  border-color: hotpink;
}

.pointer {
  cursor: pointer;
}

.loader {
border: 16px solid #f3f3f3;
border-radius: 50%;
border-top: 16px solid hotpink;
width: 60px;
height: 60px;
-webkit-animation: spin 2s linear infinite; /* Safari */
animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
0% { -webkit-transform: rotate(0deg); }
100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}
</style>
