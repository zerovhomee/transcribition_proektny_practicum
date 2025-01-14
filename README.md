# Локальный веб сервис транскрибации речи из аудио в текст
Данный продукт позволяет транскрибировать аудиосообщения разных форматов в текстовый формат благодаря нейросети OpenAI Whisper.
## Основной функционал
Можно прикреплять аудиофайлы и получать расшифровку в окне вывода. Есть возможность получения результата в текстовый файл,
который можно загрузить на устройство.

# Установка (без использования Docker)
## Windows
https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/ здесь туториал как установить ffmpeg, он необходим для работы whisper.
Пакеты Python:
torch
transformers
websockets
asyncio

Если какие то из пакетов у вас не установлены и подсвечиваются желтым в редакторе, установите их командой в терминале:

pip install "Название пакета"

## Linux
На этой системе также нужно загрузить пакет ffmpeg.

sudo dnf install ffmpeg

Выполните в терминале эту команду. Второе слово(пакетный менеджер) зависит от версии вашего Линукс. В нашем случае использовалась Fedora,
для Ubuntu это apt или apt-get

Далее нужно обновить pip следующуй командой.

python -m pip install -upgrade pip

Затем нужно установить пакеты Python по такой же схеме как на Windows.
При установке torch лучше использовать следующую команду:

TMPDIR=/var/tmp pip install --cache-dir=/var/tmp torch

### Копирование проекта
Создайте папку в удобном для вас месте, откройте его в редакторе кода (предпочтительнее Visual Studio Code)

У вас должен быть установлен Git, если нет установите отсюда https://git-scm.com/downloads

Создайте новый терминал Git Bash, далее введите следующие команды

git init

git clone https://github.com/zerovhomee/transcribition_proektny_practicum

### Запуск проекта
В терминале выполните команду

python server.py

Откройте в браузере файл index.html.
![image](https://github.com/user-attachments/assets/3a5c3e7f-e43f-4639-8a0f-eb54d8fd3d61)

Готово. Нажмите на кнопку прикрепить файл, выберете аудиофайл,
подтвердите операцию и в скором времени вы получите транскрибацию.
