
/* ==========================================
   ACOLHE+ 💛
   Assistente virtual de prevenção ao suicídio
   Integração com Supabase
========================================== */

// 1. CONEXÃO COM O SUPABASE

const SUPABASE_URL = "https://ysblefnczwupjjkthgqc.supabase.co";
const SUPABASE_KEY = "sb_publishable_QOuhlxo-Qis9S5OxkBh-2Q_t5xjeHEY";

let banco = null;
let conhecimentos = [];

if (window.supabase && window.supabase.createClient) {
    banco = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase conectado!");
} else {
    console.error("ERRO: biblioteca do Supabase não carregada.");
}

// 2. ELEMENTOS DO HTML

const abrir = document.getElementById("abrir-assistente");
const fechar = document.getElementById("fechar-assistente");
const painel = document.getElementById("painel-assistente");

const mensagens = document.getElementById("mensagens-assistente");
const formulario = document.getElementById("form-assistente");
const entrada = document.getElementById("entrada-assistente");

// 3. ABRIR E FECHAR O ASSISTENTE

if (abrir && painel && entrada) {
    abrir.addEventListener("click", () => {
        painel.hidden = false;
        abrir.setAttribute("aria-expanded", "true");
        entrada.focus();
    });
}

if (fechar && painel && abrir) {
    fechar.addEventListener("click", () => {
        painel.hidden = true;
        abrir.setAttribute("aria-expanded", "false");
        abrir.focus();
    });
}

// 4. ADICIONAR MENSAGENS NA TELA

function adicionarMensagem(texto, tipo) {
    if (!mensagens) {
        console.error("Elemento mensagens-assistente não encontrado.");
        return null;
    }

    const mensagem = document.createElement("div");
    mensagem.classList.add("mensagem", ...tipo.split(" "));
    mensagem.textContent = texto;

    mensagens.appendChild(mensagem);
    mensagens.scrollTop = mensagens.scrollHeight;

    return mensagem;
}

// 5. NORMALIZAR TEXTO

function normalizar(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// 6. IDENTIFICAR PALAVRAS

function contem(texto, palavras) {
    return palavras.some(palavra =>
        texto.includes(normalizar(palavra))
    );
}

// 7. CRIAR CONVERSAS E SALVAR MENSAGENS

let conversaAtualId = null;

async function obterOuCriarConversa() {
    if (!banco) return null;

    if (conversaAtualId) {
        return conversaAtualId;
    }

    try {
        const novoId = crypto.randomUUID();

        const { error } = await banco
            .from("conversas")
            .insert({ id: novoId });

        if (error) {
            console.error("Erro ao criar conversa:", error);
            return null;
        }

        conversaAtualId = novoId;

        console.log("Conversa criada:", conversaAtualId);

        return conversaAtualId;

    } catch (erro) {
        console.error("Falha ao criar conversa:", erro);
        return null;
    }
}

async function salvarMensagem(remetente, texto) {
    if (!banco) return;

    const conversaId = await obterOuCriarConversa();

    if (!conversaId) {
        console.warn("Não foi possível salvar a mensagem.");
        return;
    }

    try {
        const { error } = await banco
            .from("mensagens")
            .insert({
                conversa_id: conversaId,
                remetente: remetente,
                mensagem: texto
            });

        if (error) {
            console.error("Erro ao salvar mensagem:", error);
        } else {
            console.log("Mensagem salva:", remetente);
        }

    } catch (erro) {
        console.error("Falha ao salvar mensagem:", erro);
    }
}

// 8. CARREGAR CONHECIMENTOS DO SUPABASE

async function carregarConhecimentos() {
    if (!banco) {
        console.error("Supabase não conectado.");
        return;
    }

    try {
        const { data, error } = await banco
            .from("conhecimentos")
            .select("categoria, pergunta, resposta")
            .limit(100);

        if (error) {
            console.error("Erro ao carregar conhecimentos:", error);
            return;
        }

        conhecimentos = data || [];

        console.log("Conhecimentos carregados:", conhecimentos.length);

    } catch (erro) {
        console.error("Falha ao carregar conhecimentos:", erro);
    }
}

const carregamentoInicial = carregarConhecimentos();

// 9. PESQUISAR RESPOSTAS NO BANCO

async function buscarConhecimento(perguntaUsuario) {
    await carregamentoInicial;

    if (!banco || conhecimentos.length === 0) {
        return null;
    }

    const pergunta = normalizar(perguntaUsuario);

    const ignorar = [
        "como", "qual", "quais", "onde", "quando",
        "porque", "para", "sobre", "isso", "essa",
        "esse", "uma", "que", "com", "dos", "das",
        "estou", "quero", "voce", "o", "a", "os",
        "as", "e", "de", "do", "da"
    ];

    const palavras = pergunta
        .split(" ")
        .filter(palavra =>
            palavra.length >= 3 && !ignorar.includes(palavra)
        );

    if (palavras.length === 0) return null;

    let melhorResultado = null;
    let maiorPontuacao = 0;

    conhecimentos.forEach(item => {
        const perguntaBanco = normalizar(item.pergunta);
        const categoriaBanco = normalizar(item.categoria);

        let pontuacao = 0;

        palavras.forEach(palavra => {
            if (perguntaBanco.includes(palavra)) {
                pontuacao += 2;
            } else if (categoriaBanco.includes(palavra)) {
                pontuacao += 1;
            }
        });

        if (pontuacao > maiorPontuacao) {
            maiorPontuacao = pontuacao;
            melhorResultado = item.resposta;
        }
    });

    console.log("Pergunta recebida:", perguntaUsuario);
    console.log("Pontuação:", maiorPontuacao);

    return maiorPontuacao > 0 ? melhorResultado : null;
}

// 10. RESPOSTAS PROGRAMADAS

function responder(pergunta) {
    const texto = normalizar(pergunta);

    // SITUAÇÕES DE RISCO

    if (contem(texto, [
        "quero me matar", "vou me matar", "quero morrer",
        "nao quero mais viver", "tirar minha vida",
        "acabar com minha vida", "pensando em suicidio",
        "estou pensando em morrer", "quero acabar com tudo",
        "vou tirar minha vida", "quero me machucar",
        "nao aguento mais viver", "nao vejo motivo para viver"
    ])) {
        return `💛 Obrigado por compartilhar o que está sentindo.

Sinto muito que você esteja passando por um momento tão difícil. Você merece ser ouvido(a), acolhido(a) e receber ajuda.

Por favor, procure agora uma pessoa de confiança, como um familiar, professor ou responsável. Não fique sozinho(a) se estiver em perigo.

🚑 Em uma emergência, ligue 192 (SAMU) ou procure uma UPA ou pronto-socorro.

💛 CVV – 188: apoio emocional gratuito, disponível 24 horas.

Se você estiver pensando em se machucar, procure ajuda presencial imediatamente.

Eu sou um assistente educativo e não substituo atendimento profissional ou de emergência. Sua vida importa!`;
    }

    // SAUDAÇÕES

    if (contem(texto, [
        "oi", "ola", "bom dia", "boa tarde",
        "boa noite", "tudo bem", "quem e voce", "seu nome"
    ])) {
        return `Olá! 💛 Seja bem-vindo(a) ao Acolhe+!

Sou o assistente virtual do projeto Prevenção ao Suicídio do 2 TDS do Colégio Dirce.

Estou aqui para compartilhar informações sobre saúde mental, prevenção e valorização da vida.

E também para conversar contigo!`;
    }

    // SUICÍDIO

    if (contem(texto, [
        "o que e suicidio", "significado de suicidio",
        "definicao de suicidio", "sobre suicidio"
    ])) {
        return `O suicídio é um fenômeno complexo e multifatorial, relacionado a diferentes fatores emocionais, sociais, psicológicos e também a situações de sofrimento.

Não existe uma única causa.

Por isso, é importante falar sobre saúde mental, combater o preconceito e facilitar o acesso ao acolhimento e ao atendimento profissional.

A prevenção é uma responsabilidade de toda a sociedade. 💛`;
    }

    // SAÚDE MENTAL

    if (contem(texto, [
        "saude mental", "cuidar da mente", "bem estar emocional",
        "ansiedade", "tristeza", "estresse", "emocional"
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

    // COMO AJUDAR ALGUÉM

    if (contem(texto, [
        "ajudar alguem", "ajudar um amigo", "meu amigo",
        "minha amiga", "pessoa triste", "alguem sofrendo",
        "como ajudar", "amigo quer morrer"
    ])) {
        return `Acolher alguém que está sofrendo pode fazer muita diferença!

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

    // SINAIS DE ALERTA

    if (contem(texto, [
        "sinais de alerta", "sinais de suicidio",
        "como identificar", "como perceber",
        "sinais de sofrimento", "mudancas de comportamento"
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

    // PREVENÇÃO

    if (contem(texto, [
        "prevencao", "prevenir", "como evitar",
        "combater o suicidio", "como combater", "valorizar a vida"
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

    // AJUDA E CONTATOS

    if (contem(texto, [
        "onde buscar ajuda", "onde procurar ajuda",
        "preciso de ajuda", "telefone de ajuda",
        "numero do cvv", "cvv", "caps", "ubs",
        "psicologo", "psicologa", "atendimento"
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

    // SETEMBRO AMARELO

    if (contem(texto, [
        "setembro amarelo", "campanha amarela", "mes de prevencao"
    ])) {
        return `O Setembro Amarelo é uma campanha de conscientização sobre a prevenção ao suicídio.

Seu objetivo é incentivar o diálogo, promover a valorização da vida e combater o preconceito relacionado à saúde mental.

Falar sobre o assunto com responsabilidade é uma forma de contribuir para a prevenção! 💛`;
    }

    // ESCOLA

    if (contem(texto, [
        "escola", "professor", "aluno",
        "estudante", "ambiente escolar"
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

    // BULLYING

    if (contem(texto, [
        "bullying", "cyberbullying", "perseguicao", "humilhacao"
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

    // AGRADECIMENTOS

    if (contem(texto, ["obrigado", "obrigada", "valeu"])) {
        return `Por nada! 💛

Obrigado por conversar comigo.

Lembre-se: ouvir, acolher e respeitar são atitudes que podem fazer a diferença na vida de alguém!`;
    }

    // DESPEDIDAS

    if (contem(texto, ["tchau", "ate mais", "adeus", "vou embora"])) {
        return `Até mais! 💛

Obrigado por conhecer nosso projeto.

Lembre-se de que pedir ajuda não é sinal de fraqueza. Você merece cuidado e acolhimento!`;
    }

    return null;
}

// 11. ENVIAR E REGISTRAR MENSAGENS

async function enviarMensagem(texto) {
    if (!texto || !texto.trim()) return;

    if (!mensagens) {
        console.error("Elemento mensagens-assistente não encontrado.");
        return;
    }

    // Mostra e salva a mensagem do usuário.
    adicionarMensagem(texto, "usuario");
    await salvarMensagem("usuario", texto);

    // Primeiro verifica as respostas de segurança e programadas.
    let resposta = responder(texto);

    // Se não encontrar, procura no Supabase.
    if (!resposta) {
        const carregando = adicionarMensagem(
            "Estou procurando uma resposta para você... 💛",
            "bot carregando"
        );

        try {
            resposta = await buscarConhecimento(texto);
        } catch (erro) {
            console.error("Erro ao pesquisar no banco:", erro);
        } finally {
            if (carregando) {
                carregando.remove();
            }
        }
    }

    // Resposta padrão quando não encontrar correspondência.
    if (!resposta) {
        resposta = `Ainda estou aprendendo a responder diferentes perguntas! 💛

Tente perguntar de outra maneira ou escolha um destes assuntos:

• O que é prevenção ao suicídio?
• Como cuidar da saúde mental?
• Como ajudar alguém?
• Quais são os sinais de alerta?
• Onde procurar ajuda?
• O que é Setembro Amarelo?

Estou aqui para compartilhar informações educativas!`;
    }

    // Mostra e salva a resposta do Acolhe+.
    adicionarMensagem(resposta, "bot");
    await salvarMensagem("assistente", resposta);
}

// 12. FORMULÁRIO DE ENVIO

if (formulario && entrada) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        const texto = entrada.value.trim();

        if (!texto) return;

        entrada.value = "";

        await enviarMensagem(texto);

        entrada.focus();
    });
} else {
    console.error(
        "ERRO: formulário ou campo de entrada não encontrado. Confira os IDs no HTML."
    );
}

// 13. PERGUNTAS PRONTAS

document.querySelectorAll(".pergunta-pronta").forEach(botao => {
    botao.addEventListener("click", function() {
        enviarMensagem(botao.textContent);
    });
});

// 14. CONFERÊNCIA FINAL

console.log("Acolhe+ inicializado!");

if (!mensagens) {
    console.error("Confira se existe id='mensagens-assistente' no HTML.");
}
