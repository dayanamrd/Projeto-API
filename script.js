// Ativação do dropdown
const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

function toggleDropdown() {   
    dropdownMenu.classList.toggle("show");
}

dropdownButton.addEventListener('click', toggleDropdown);


// Assistente de IA - Gemini API
// Seleciona o formulário
const form = document.querySelector('form');
const outputResponse = document.getElementById("output");

form.addEventListener('submit', async (event) => {
    // Impede a submissão padrão do formulário
    event.preventDefault();

    const API_KEY = document.querySelector('#key').value;
    const model = document.querySelector('#model').value;
    const promptText = document.querySelector('#prompt').value;
    
    if (!API_KEY) {
        alert("Por favor, digite sua chave da API.");
        return;
    }
    
    if (!promptText) {
        alert("Por favor, digite sua pergunta.");
        return;
    }

    // Limpa a resposta anterior e mostra um indicador de carregamento
    outputResponse.innerHTML = "Carregando...";

    // Construção do corpo da requisição
    const requestBody = {
        contents: [{
            parts: [{
                text: promptText
            }]
        }]
    };

    try {
        const URL_API = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;
        // Exibe a resposta na tela
        outputResponse.innerHTML = responseText;

    } catch (error) {
        console.error('Ocorreu um erro:', error);
        outputResponse.innerHTML = '<p>Desculpe, ocorreu um erro ao obter a resposta.</p>';
    }
});