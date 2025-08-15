// Assistente de IA - Gemini API
// Seleciona o formulário
const form = document.querySelector('form');
const outputResponse = document.getElementById("output");
const exportBtn = document.getElementById("exportPDF");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");
let lastPrompt = "";
let lastResponse = "";

// Inicialmente esconde a caixa de resposta e o botão PDF
outputResponse.style.display = "none";
exportBtn.style.display = "none";
clearButton.style.display = "none";
copyButton.style.display = "none";

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

    // Enquanto carrega, esconde a caixa de resposta
    outputResponse.style.display = "none";
    outputResponse.style.textAlign = "center";
    outputResponse.innerHTML = "Carregando...";

    // Limpa a resposta anterior e mostra um indicador de carregamento
    outputResponse.style.display = "block";   
    outputResponse.style.textAlign = "center";
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

        // Guarda para exportar em PDF
        lastPrompt = promptText;
        lastResponse = responseText;

        // Exibe a resposta na tela
        outputResponse.style.textAlign = "justify";
        outputResponse.innerHTML = `<div class="container"><h4>Resposta:</h4><span>${responseText}</span></div>`;
        outputResponse.style.display = "block";

        // Mostra o botão de exportar PDF
        exportBtn.style.display = "inline-block";
        clearButton.style.display = "inline-block";
        copyButton.style.display = "inline-block";


    } catch (error) {
        console.error('Ocorreu um erro:', error);
        outputResponse.innerHTML = '<p>Desculpe, ocorreu um erro ao obter a resposta.</p>';
    }
});

// Exportar a pesquisa em PDF
exportBtn.addEventListener('click', () => {
    if (!lastPrompt || !lastResponse) {
        alert("Não há o que exportar.");
        return;
    }

    const docDefinition = {
        content: [
            { text: 'Assistente de IA - Grupo Hydrastack', style: 'header' },
            { text: '\nPergunta:', style: 'subheader' },
            { text: lastPrompt, margin: [0, 0, 0, 10] },
            { text: 'Resposta:', style: 'subheader' },
            { text: lastResponse }
        ],
        styles: {
            header: { fontSize: 18, bold: true, alignment: 'center' },
            subheader: { fontSize: 14, bold: true }
        }
    };

    pdfMake.createPdf(docDefinition).download('resposta.pdf');
});

// Limpar pergunta e resposta
clearButton.addEventListener('click', () => {
    alert("Tem certeza que deseja apagar o conteúdo?");
    // Limpa os inputs e a área de resposta
    document.querySelector('#prompt').value = "";
    outputResponse.innerHTML = "";
    outputResponse.style.display = "none";

    // Esconde os botões 
    exportBtn.style.display = "none";
    clearButton.style.display = "none";
    copyButton.style.display = "none";

    // Limpa o histórico
    lastPrompt = "";
    lastResponse = "";
});

// Copiar pergunta e resposta
copyButton.addEventListener('click', () => {
    if (!lastPrompt && !lastResponse) {
        alert("Não há conteúdo para copiar.");
        return;
    }

    const textToCopy = `Pergunta:\n${lastPrompt}\n\nResposta:\n${lastResponse}`;

    // API web para copiar para a área de transferência
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert("Pergunta e resposta copiadas!"))
        .catch(err => alert("Erro ao copiar: " + err));
});
