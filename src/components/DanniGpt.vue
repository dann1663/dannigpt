<template>
  <h1>DanniGPT 2.0</h1>
  <p class="bodytext">Velkommen! Jeg er her for at hjælpe!</p>
  <div id="chat-container" ref="chatContainer">
    <div id="chat">
      <div v-for="(message, index) in messages" :key="index" :class="message.type">
        <div class="message-box">
          <p>{{ message.text }}</p>
        </div>
      </div>
      <div v-if="isLoading">
      <p class="loading">Loading...</p>
    </div>
    </div>

    <div class="input-element">
      <input type="text" v-model="userInput" placeholder="Skriv her" @keyup.enter="generateResponse">
      <button @click="generateResponse">Send</button>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import axios from 'axios';

export default {
  name: 'DanniGPT',
  setup() {
    const userInput = ref('');
    const generatedText = ref('');
    const isLoading = ref(false);
    const generateBox = ref(false);
    const apiKey = ref('');
    const messages = ref([]);
    const chatContainer = ref(null);

    const fetchApiKey = async () => {
      try {
        const response = await axios.get('https://us-central1-dannigbt-6f10d.cloudfunctions.net/getApiKey');
        apiKey.value = response.data;
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    const scrollToEnd = () => {
      nextTick(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
      });
    };

    const generateResponse = async () => {
      if (userInput.value.trim() === '') return;

      isLoading.value = true;

      await fetchApiKey();

      messages.value.push({ type: 'person', text: userInput.value });

      const conversationHistory = messages.value.map(msg => msg.text).join('\n');

      try {
        const response = await axios.post('https://us-central1-dannigbt-6f10d.cloudfunctions.net/generateText', {
          userInput: conversationHistory,
        });

        generatedText.value = response.data.generatedText;
        isLoading.value = false;
        generateBox.value = true;

        messages.value.push({ type: 'bot', text: generatedText.value });

        userInput.value = '';

        // Scroll to the end after the DOM has updated
        scrollToEnd();
      } catch (error) {
        console.error('Fejl ved generering af svar:', error);
        isLoading.value = false;
      }
    };

    return {
      userInput,
      generatedText,
      isLoading,
      generateBox,
      generateResponse,
      messages,
      chatContainer,
    };
  },
};
</script>

<style>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-size: 1rem;
  text-align: center;
  color:white;
}

.bodytext {
  text-align: center;
}
.loading {
  color: white;
  font-size: 0.6rem;
}
#chat-container {

  display: flex;
  flex-direction: column;
  height: 80vh;
  justify-content: center;
  align-items: center; 
  padding: 0px 30px;

}

#chat {
  
  flex-grow: 1;
  overflow-y: auto; 
  width: 100%; 
  display: flex;
  flex-direction: column;
  padding: 30px;

}

.person .message-box, .bot .message-box {

  margin: 10px 0;
  display: inline-block;

  padding: 0 20px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: white;
  word-wrap: break-word; 


}

.person .message-box {
  text-align: left;
  position: relative;
  left: 100%;
  background-color: rgb(178, 37, 108);
  transform: translateX(-100%);
}

.bot .message-box {
  background-color: #1e1e1e;

}

.input-element {
  display: flex;
  justify-content: center;
  width: 100%;

}

input[type="text"] {
  display: block;
  margin-left: auto;
  width: 60%;
  flex-grow: 1;
  font-size: 0.8rem;
  padding: 5px 15px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 200px;
   /* Adjust this to fit your design */
}

button {
  padding: 10px;
  border: none;
  background-color: hotpink;
  color: white;
  padding: 10px 25px;
  border-radius: 200px;
  cursor: pointer;
  transition: 0.05s;
}

button:hover {
  background-color: rgb(153, 31, 92);
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #310e2b; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: hotpink; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(153, 31, 92); 
}

</style>
