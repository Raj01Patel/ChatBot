const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");



let userMessage;
const API_KEY = "AIzaSyBF_7ZAS5u1oTMnEQPKn55IVr_ph9nR4G0";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span><i class="fa-solid fa-robot"></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatli) => {
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBF_7ZAS5u1oTMnEQPKn55IVr_ph9nR4G0";
    const messageElement = incomingChatli.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gemini-pro",
            "contents": [{
                "parts": [{
                    text: userMessage
                }],
                role: "user"
            }]
        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        const responseHTML = convertMarkdownToHTML(data.candidates[0].content.parts[0].text);
        messageElement.innerHTML = responseHTML;
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

}

const convertMarkdownToHTML = (markdownText) => {
    let htmlText = markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Convert **text** to <strong>text</strong>
    return htmlText.replace(/\n/g, '<br>')
}

const handleChat = () => {
    userMessage = chatInput.value.trim();

    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;


    chatbox.appendChild(createChatLi(userMessage, "outgoing"));


    setTimeout(() => {
        const incomingChatli = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatli);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatli);
    }, 600)
}


chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftkey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener('click', handleChat);

// chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));
// chatbotCloseBtn.addEventListener("click",()=> document.body.classList.remove("show-chatbot"));


