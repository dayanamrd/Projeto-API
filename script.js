// Ativação do dropdown
const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

function toggleDropdown() {   
    dropdownMenu.classList.toggle("show");
}

dropdownButton.addEventListener('click', toggleDropdown);

// Assistente de IA - OpenIA
const API_KEY = document.getElementById("key").value;

async function sendMessage() {
    const msg = document.getElementById("prompt").value;
    const modelGpt = document.getElementById("prompt").value;

    document.getElementById("res").innerHTML += `<p><b>Você:</b> ${msg}</p>`;
    document.getElementById("prompt").value = "";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: modelGpt,
            messages: [{ role: "user", content: msg }]
        })
    });

    const data = await res.json();
    document.getElementById("res").innerHTML += `<p><b>IA:</b> ${data.choices[0].message.content}</p>`;
}
