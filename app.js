// Reconhecimento de fala usando Web Speech API
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const transcriptionElement = document.getElementById("transcription");

let recognition;
let isRecognizing = false;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isRecognizing = true;
    transcriptionElement.innerText = "Ouvindo...";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  recognition.onerror = (event) => {
    transcriptionElement.innerText = "Erro no reconhecimento: " + event.error;
  };

  recognition.onend = () => {
    isRecognizing = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    transcriptionElement.innerText += "\n[Fim do reconhecimento]";
  };

  recognition.onresult = (event) => {
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      }
    }
    if (finalTranscript) {
      transcriptionElement.innerText = finalTranscript;
      // Atualiza VLibras automaticamente
      window.postMessage({ type: "vlibras-translate", text: finalTranscript }, "*");
    }
  };

  startBtn.addEventListener("click", () => recognition.start());
  stopBtn.addEventListener("click", () => recognition.stop());
} else {
  transcriptionElement.innerText = "Seu navegador não suporta reconhecimento de fala.";
  startBtn.disabled = true;
  stopBtn.disabled = true;
}