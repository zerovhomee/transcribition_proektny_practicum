const socket = new WebSocket("ws://localhost:80");

socket.onopen = function (event) {
  console.log("WebSocket connection established");
};

// При ошибке соединения
socket.onerror = function (event) {
  console.error("WebSocket error:", event);
};

document.getElementById("file-upload").onchange = function () {
  const fileInput = document.getElementById("file-upload");
  const file = fileInput.files[0];

  if (file) {
    // Показываем уведомление и кнопку подтверждения
    document.getElementById("fileStatus").textContent = "Файл загружен: " + file.name;
    document.getElementById("submit-file").classList.add('visible-block');
  } else {
    document.getElementById("fileStatus").textContent = "Пожалуйста, выберите файл.";
    document.getElementById("submit-file").style.display = "none"; // Скрыть кнопку, если файл не выбран
  }
};

// Обработчик подтверждения и отправки файла
document.getElementById("confirmButton").onclick = function () {
  sendAudio();
};

socket.onmessage = (event) => {
  console.log("Received response from server:", event.data);
  const response = JSON.parse(event.data);
  if (response.transcription) {
    // Находим поле textarea и вставляем текст транскрипции
    document.getElementById("transcriptionResult").value = response.transcription;
    document.getElementById("fileStatus").textContent = "Транскрибация завершена!";
    document.getElementById("file-upload").value = ""; // Сброс поля выбора файла
    document.getElementById("confirmButton").style.display = "none"; // Скрыть кнопку подтверждения
  }
};

function sendAudio() {
  const fileInput = document.getElementById("file-upload");
  const file = fileInput.files[0];

  if (file) {
    if (socket.readyState === WebSocket.OPEN) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const audioContentBase64 = event.target.result.split(",")[1];

        // Отправляем аудиофайл в виде JSON-объекта
        const data = {
          audio_content: audioContentBase64,
        };
        console.log("Sending audio data:", data);
        socket.send(JSON.stringify(data));
      };

      reader.onerror = function (error) {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file); // Преобразуем в Base64 для передачи через WebSocket
    } else {
      console.log("WebSocket is not ready. Please try again.");
    }
  } else {
    console.log("No file selected.");
  }
}