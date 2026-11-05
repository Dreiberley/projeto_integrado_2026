
/* ==========================================
   ACOLHE+ 💛
   Assistente virtual de prevenção ao suicídio
   Projeto Web pela Convivência
========================================== */

// ELEMENTOS DO HTML

const abrir = document.getElementById("abrir-assistente");
const fechar = document.getElementById("fechar-assistente");
const painel = document.getElementById("painel-assistente");

const mensagens = document.getElementById("mensagens-assistente");
const formulario = document.getElementById("form-assistente");
const entrada = document.getElementById("entrada-assistente");

// ABRIR O ASSISTENTE

abrir.addEventListener("click", () => {
    painel.hidden = false;
    abrir.setAttribute("aria-expanded", "true");
    entrada.focus();
});

// FECHAR O ASSISTENTE

fechar.addEventListener("click", () => {
    painel.hidden = true;
    abrir.setAttribute("aria-expanded", "false");
    abrir.focus();
});

// ADICIONAR MENSAGENS

function adicionarMensagem(texto, tipo) {

    const mensagem = document.createElement("div");

    mensagem.classList.add("mensagem", tipo);
    mensagem.textContent = texto;

    mensagens.appendChild(mensagem);

    mensagens.scrollTop = mensagens.scrollHeight;
}

// NORMALIZAR TEXTO

function normalizar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// IDENTIFICAR PALAVRAS

function contem(texto, palavras) {

    return palavras.some(palavra => texto.includes(palavra));
}

// RESPOSTAS DO ACOLHE+

function responder(pergunta) {

    const texto = normalizar(pergunta);

    // 1. POSSÍVEL SITUAÇÃO DE RISCO

    const sinaisDeRisco = [
        "quero me matar",
        "vou me matar",
        "quero morrer",
        "nao quero mais viver",
        "tirar minha vida",
        "acabar com minha vida",
        "pensando em suicidio",
        "estou pensando em morrer",
        "quero acabar com tudo",
        "vou tirar minha vida",
        "quero me machucar",
        "nao aguento mais viver",
        "nao vejo motivo para viver"
    ];

    if (contem(texto, sinaisDeRisco)) {

        return `💛 Obrigado por compartilhar o que está sentindo.

Sinto muito que você esteja passando por um momento tão difícil. Você merece ser ouvido(a), acolhido(a) e receber ajuda.

Por favor, não enfrente isso sozinho(a).

• Procure imediatamente alguém de confiança e conte o que está acontecendo.
• Se houver risco de você se machucar, fique perto de outra pessoa e procure uma UPA ou pronto-socorro.
• Em uma emergência médica, ligue para o SAMU: 192.
• Você também pode conversar gratuitamente com o CVV: 188, disponível 24 horas.

Se puder, procure ajuda agora. Sua vida importa. 💛

Eu sou apenas um assistente educativo e não consigo oferecer atendimento de emergência.`;

    }

    // 2. SAUDAÇÕES

    if (contem(texto, [
        "oi", "ola", "bom dia",
        "boa tarde", "boa noite",
        "tudo bem", "quem e voce",
        "seu nome"
    ])) {

        return `Olá! 💛 Seja bem-vindo(a) ao Acolhe+!

Sou o assistente virtual do projeto Prevenção ao Suicídio.

Estou aqui para compartilhar informações sobre saúde mental, prevenção e valorização da vida.

Pode conversar comigo!`;
    }

    // 3. O QUE É SUICÍDIO?

    if (contem(texto, [
        "o que e suicidio",
        "significado de suicidio",
        "definicao de suicidio",
        "sobre suicidio"
    ])) {

        return `O suicídio é um fenômeno complexo e multifatorial, relacionado a diferentes fatores emocionais, sociais, psicológicos e também a situações de sofrimento.

Não existe uma única causa.

Por isso, é importante falar sobre saúde mental, combater o preconceito e facilitar o acesso ao acolhimento e ao atendimento profissional.

A prevenção é uma responsabilidade de toda a sociedade. 💛`;
    }

    // 4. SAÚDE MENTAL

    if (contem(texto, [
        "saude mental",
        "cuidar da mente",
        "bem estar emocional",
        "ansiedade",
        "tristeza",
        "estresse",
        "emocional"
    ])) {

        return `Cuidar da saúde mental é tão importante quanto cuidar da saúde física! 💛

Algumas atitudes podem ajudar:

• Conversar com pessoas de confiança.
• Respeitar seus próprios limites.
• Ter momentos de descanso e lazer.
• Manter vínculos com pessoas importantes.
• Procurar ajuda profissional quando necessário.

Não é necessário enfrentar momentos difíceis sozinho(a).`;
    }

    // 5. COMO AJUDAR ALGUÉM?

    if (contem(texto, [
        "ajudar alguem",
        "ajudar um amigo",
        "meu amigo",
        "minha amiga",
        "pessoa triste",
        "alguem sofrendo",
        "como ajudar",
        "amigo quer morrer"
    ])) {

        return `Acolher alguém que está sofrendo pode fazer muita diferença! 💛

Você pode:

• Escutar com atenção e sem julgamentos.
• Demonstrar preocupação e carinho.
• Levar a sério falas sobre morte ou sofrimento.
• Perguntar diretamente se a pessoa está pensando em suicídio, sem julgá-la.
• Incentivar a busca por ajuda profissional.
• Procurar um adulto de confiança, especialmente quando envolver estudantes menores de idade.

Se houver risco imediato, não deixe a pessoa sozinha e procure atendimento de emergência.

Lembre-se: você pode apoiar alguém, mas não precisa resolver tudo sozinho(a).`;
    }

    // 6. SINAIS DE ALERTA

    if (contem(texto, [
        "sinais de alerta",
        "sinais de suicidio",
        "como identificar",
        "como perceber",
        "sinais de sofrimento",
        "mudancas de comportamento"
    ])) {

        return `Algumas mudanças podem indicar que alguém precisa de acolhimento:

• Isolamento social.
• Falas sobre morte ou falta de esperança.
• Sofrimento emocional intenso.
• Sentimentos de culpa ou inutilidade.
• Mudanças importantes no comportamento.
• Despedidas ou falas preocupantes.

Esses sinais não confirmam um diagnóstico, mas merecem atenção.

O mais importante é ouvir, acolher e incentivar a procura por ajuda.`;
    }

    // 7. PREVENÇÃO

    if (contem(texto, [
        "prevencao",
        "prevenir",
        "como evitar",
        "combater o suicidio",
        "como combater",
        "valorizar a vida"
    ])) {

        return `A prevenção ao suicídio envolve informação, acolhimento e acesso à ajuda!

Algumas atitudes importantes:

• Conversar sobre saúde mental.
• Combater o preconceito.
• Incentivar a busca por atendimento profissional.
• Construir ambientes escolares acolhedores.
• Não ignorar sinais de sofrimento.
• Fortalecer os vínculos de amizade e familiares.

Todos podemos contribuir para uma sociedade mais acolhedora! 💛`;
    }

    // 8. AJUDA E CONTATOS

    if (contem(texto, [
        "onde buscar ajuda",
        "onde procurar ajuda",
        "preciso de ajuda",
        "telefone de ajuda",
        "numero do cvv",
        "cvv",
        "caps",
        "ubs",
        "psicologo",
        "psicologa",
        "atendimento"
    ])) {

        return `Você não precisa enfrentar momentos difíceis sozinho(a). Existem serviços preparados para ajudar! 💛

📞 CVV – 188
Apoio emocional gratuito, disponível 24 horas.

🏥 UBS
Unidade Básica de Saúde da sua região.

💛 CAPS
Serviços públicos especializados em saúde mental.

🚑 SAMU – 192
Para emergências médicas.

Você também pode procurar um professor, familiar ou adulto de confiança.

Se houver perigo imediato, procure uma UPA ou pronto-socorro.`;
    }

    // 9. SETEMBRO AMARELO

    if (contem(texto, [
        "setembro amarelo",
        "campanha amarela",
        "mes de prevencao"
    ])) {

        return `O Setembro Amarelo é uma campanha de conscientização sobre a prevenção ao suicídio.

Seu objetivo é incentivar o diálogo, promover a valorização da vida e combater o preconceito relacionado à saúde mental.

Falar sobre o assunto com responsabilidade é uma forma de contribuir para a prevenção! 💛`;
    }

    // 10. IMPORTÂNCIA DA ESCOLA

    if (contem(texto, [
        "escola",
        "professor",
        "aluno",
        "estudante",
        "ambiente escolar"
    ])) {

        return `A escola possui um papel muito importante na promoção da saúde mental!

Ela pode:

• Promover campanhas educativas.
• Incentivar conversas sobre emoções.
• Combater o bullying e a discriminação.
• Oferecer espaços de escuta e acolhimento.
• Orientar estudantes sobre onde buscar ajuda.

Uma escola acolhedora pode contribuir para que ninguém se sinta sozinho(a). 💛`;
    }

    // 11. BULLYING

    if (contem(texto, [
        "bullying",
        "cyberbullying",
        "perseguicao",
        "humilhacao"
    ])) {

        return `O bullying pode causar sofrimento emocional e prejudicar a saúde mental.

É importante:

• Não participar de humilhações.
• Não compartilhar conteúdos ofensivos.
• Apoiar quem sofre agressões.
• Comunicar a situação a um professor ou responsável.
• Buscar ajuda quando necessário.

Respeito e empatia ajudam a construir uma escola mais segura. 💛`;
    }

    // 12. AGRADECIMENTOS

    if (contem(texto, [
        "obrigado",
        "obrigada",
        "valeu"
    ])) {

        return `Por nada! 💛

Obrigado por conversar comigo.

Lembre-se: ouvir, acolher e respeitar são atitudes que podem fazer a diferença na vida de alguém!`;
    }

    // 13. DESPEDIDAS

    if (contem(texto, [
        "tchau",
        "ate mais",
        "adeus",
        "vou embora"
    ])) {

        return `Até mais! 💛

Obrigado por conhecer nosso projeto.

Lembre-se de que pedir ajuda não é sinal de fraqueza. Você merece cuidado e acolhimento!`;
    }

    // 14. RESPOSTA PADRÃO

    return `Ainda estou aprendendo a responder diferentes perguntas! 💛

Tente perguntar de outra maneira ou escolha um destes assuntos:

• O que é prevenção ao suicídio?
• Como cuidar da saúde mental?
• Como ajudar alguém?
• Quais são os sinais de alerta?
• Onde procurar ajuda?
• O que é Setembro Amarelo?

Estou aqui para compartilhar informações educativas!`;
}

// ENVIAR MENSAGEM

function enviarMensagem(texto) {

    if (!texto.trim()) return;

    adicionarMensagem(texto, "usuario");

    const resposta = responder(texto);

    adicionarMensagem(resposta, "bot");
}

// FORMULÁRIO

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    enviarMensagem(entrada.value);

    entrada.value = "";
    entrada.focus();

});

// PERGUNTAS PRONTAS

document.querySelectorAll(".pergunta-pronta").forEach(botao => {

    botao.addEventListener("click", function() {

        enviarMensagem(botao.textContent);

    });

});
