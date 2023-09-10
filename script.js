const voiceQuestionButton = document.getElementById('voice-question');
const textQuestionButton = document.getElementById('text-question');
const audioResponseElement = document.getElementById('audio-response');
const questionInput = document.getElementById('questionInput');
const responseModeToggle = document.getElementById('response-mode-toggle');
let mediaRecorder;
let audioChunks = [];
var clickCount = 0;

voiceQuestionButton.addEventListener('click', () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        startRecordingVoice();
    } else if (mediaRecorder.state === 'recording') {
        stopRecordingVoice();
    }
});

textQuestionButton.addEventListener('click', () => {
    const question = questionInput.value.trim();
    
    if (question) {
        const mode = (clickCount + 1) % 2 ? 'голосом' : 'текстом';
        sendTextRequest(question, mode);
        // Очистить текстовое поле после отправки
        questionInput.value = '';
    } else {
        alert("Запрос отсутствует")
    }
});

responseModeToggle.addEventListener('click', () => {
    responseModeToggle.innerHTML = (clickCount % 2) ? 'Ответ голосом' : 'Ответ текстом';
    clickCount++;
})


function startRecordingVoice() {
    voiceQuestionButton.innerHTML = 'Вопрос записывается...';
    audioChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };
            mediaRecorder.onstop = function () {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioResponseElement.src = audioUrl;
                // audioResponseElement.style.display = 'block'; // отображение аудио
                voiceQuestionButton.innerHTML = 'Задать вопрос голосом';
                sendVoiceRequest(audioBlob);
            };
            mediaRecorder.start();
        })
        .catch(function (err) {
            console.error('Ошибка при получении доступа к микрофону:', err);
        });
}

function stopRecordingVoice() {
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

// Отправка аудио-записи на сервер
function sendVoiceRequest(audioBlob) {
    fetch('/record-voice', {
        method: 'POST',
        body: audioBlob
    })
    .then(response => response.json())
    .then(data => {
        // Обработка ответа от сервера
        // В данном случае, можно обновить аудио-элемент на фронтенде
        audioResponseElement.src = data.audio_response;
        audioResponseElement.style.display = 'block';
    });
}

// Отправка текстового вопроса на сервер
function sendTextRequest(question, mode) {
    fetch('/text-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, mode })
    })
    .then(response => response.json())
    .then(data => {
        // Обработка ответа от сервера
        if (data.audio_response) {
            audioResponseElement.src = data.audio_response;
            audioResponseElement.style.display = 'block';
        } else if (data.text_response) {
            // Обработка текстового ответа
            // В данном случае, можно отобразить текстовый ответ на фронтенде
            alert(data.text_response);
            // questionInput.value = data.text_response;
        }
    });
}
