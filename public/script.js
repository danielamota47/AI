//Liga o botão "Ask" da secção .chat ao backend em /api/chat
const chatSection = document.querySelector(".chat");
const textarea = chatSection.querySelector("textarea");
const askButton = chatSection.querySelector("button");

//Área simples para mostrar a resposta (criada dinamicamente)
const responseBox = document.createElement("div");
responseBox.className = "ai-response";
chatSection.appendChild(responseBox);

askButton.addEventListener("click", async () => {
    const question = textarea.value.trim();
    if (!question){
        responseBox.textContent = "Escreve uma pergunta primeiro.";
        return;
    }
    askButton.disabled = true;
    responseBox.textContent = "A pensar...";

    try{
        const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        });

        if (!res.ok) throw new Error("Erro na resposta do servidor.");

        const data = await res.json();
        responseBox.textContent = data.answer;
    } catch (err) {
        console.error(err);
        responseBox.textContent = "Ocorreu um erro. Tenta novamente.";
    } finally {
        askButton.disabled = false;
    }
});