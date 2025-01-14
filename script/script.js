const socket = new WebSocket("ws://localhost:80");
const container = document.querySelector(".container");
const textOutput = document.querySelector(".text-output");

socket.onopen = function (event) {
  console.log("WebSocket connection established");
};


// При ошибке соединения
socket.onerror = function (event) {
  console.error("WebSocket error:", event);
};

document.getElementById("file-upload").onchange = function () {
  const fileInput = document.getElementById("file-upload");
  container.style.maxHeight = "530px";
  setTimeout(() => {
    container.classList.remove("shrink");
    container.classList.add("expand");

    textOutput.classList.remove("shrink");
    textOutput.classList.add("expand");

    // Убираем класс expand после завершения анимации
    setTimeout(() => {
      container.classList.remove("expand");
      textOutput.classList.remove("expand");
    }, 800); // Длительность анимации
  }, 1000); // Время до начала возвращения высоты
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
  // document.getElementById("download-file").style.display = "block";
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
    document.getElementById("download-file").style.display = "block";
  } else if (response.error) {
    console.error("Transcription error:", response.error);
    document.getElementById("fileStatus").textContent = "Ошибка при транскрибации.";
  }
};

document.getElementById("downloadButton").onclick = function () {
  // Получаем текст из поля с транскрипцией
  let transcriptionText = document.getElementById("transcriptionResult").value;

  // Устанавливаем максимальную длину строки
  const maxLineLength = 80;

  // Разбиваем текст с учётом пробелов
  const formattedText = transcriptionText
    .split('\n') // Сначала разделяем текст на строки, если они уже есть
    .map(line => {
      const words = line.split(' '); // Разделяем строку на слова
      let currentLine = '';
      const resultLines = [];

      words.forEach(word => {
        if ((currentLine + word).length > maxLineLength) {
          resultLines.push(currentLine.trim()); // Добавляем текущую строку в результат
          currentLine = ''; // Начинаем новую строку
        }
        currentLine += word + ' '; // Добавляем слово в текущую строку
      });

      if (currentLine) {
        resultLines.push(currentLine.trim()); // Добавляем последнюю строку
      }

      return resultLines.join('\r\n'); // Собираем строки с переносами
    })
    .join('\r\n'); // Собираем весь текст с переносами строк

  // Создаём Blob для текста
  const blob = new Blob([formattedText], { type: "text/plain" });

  // Создаём ссылку для скачивания
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "transcription.txt";
  a.click();

  // Освобождаем URL после использования
  URL.revokeObjectURL(a.href);
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