
const botaoFonte = document.querySelector("#botao-fonte");

// Botão para ampliar e reduzir o texto
if (botaoFonte) {
    botaoFonte.addEventListener("click", function () {
        const ampliada =
            document.body.classList.toggle("fonte-ampliada");

        botaoFonte.textContent = ampliada
            ? "Reduzir texto"
            : "Ampliar texto";

        botaoFonte.setAttribute(
            "aria-pressed",
            String(ampliada)
        );
    });
}


// FORMULÁRIO DE CONTATO - FORMSPREE

const formContato = document.querySelector("#form-contato");

if (formContato) {
    formContato.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nome = document.querySelector("#nome");
        const email = document.querySelector("#email");
        const mensagem = document.querySelector("#mensagem");

        const resultado = document.querySelector(
            "#resultado-contato"
        );

        if (!nome || !email || !mensagem || !resultado) {
            console.error("Não foi possível encontrar todos os campos do formulário.");
            return;
        }

        // Validar campos vazios
        if (
            nome.value.trim() === "" ||
            email.value.trim() === "" ||
            mensagem.value.trim() === ""
        ) {
            resultado.textContent = "Preencha todos os campos.";
            return;
        }

        // Validar e-mail
        if (!email.validity.valid) {
            resultado.textContent =
                "Digite um endereço de e-mail válido.";

            email.focus();
            return;
        }

        // Validar tamanho da mensagem
        if (mensagem.value.trim().length < 10) {
            resultado.textContent =
                "A mensagem deve ter pelo menos 10 caracteres.";

            mensagem.focus();
            return;
        }

        // Preparar os dados para envio
        const dados = new FormData();

        dados.append("nome", nome.value.trim());
        dados.append("email", email.value.trim());
        dados.append("mensagem", mensagem.value.trim());

        dados.append(
            "_subject",
            "Nova mensagem - Projeto Setembro Amarelo"
        );

        // Evitar vários envios ao mesmo tempo
        const botaoEnviar = formContato.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (botaoEnviar) {
            botaoEnviar.disabled = true;
        }

        resultado.textContent = "Enviando sua mensagem...";

        try {
            const resposta = await fetch(
                "https://formspree.io/f/mbggqrqw",
                {
                    method: "POST",
                    body: dados,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            if (resposta.ok) {
                resultado.textContent =
                    "Mensagem enviada com sucesso! Obrigado pelo contato.";

                formContato.reset();

            } else {
                resultado.textContent =
                    "Não foi possível enviar sua mensagem. Tente novamente.";

                console.error(
                    "Erro ao enviar formulário:",
                    resposta.status
                );
            }

        } catch (erro) {
            resultado.textContent =
                "Erro de conexão. Verifique sua internet e tente novamente.";

            console.error("Erro no envio:", erro);

        } finally {
            if (botaoEnviar) {
                botaoEnviar.disabled = false;
            }
        }
    });
}


console.log("JavaScript carregado com sucesso!");


// DADOS.HTML

const localDados = document.querySelector("#local-dados");

if (localDados) {
    fetch("dados.html")
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error("Erro ao carregar dados.html");
            }

            return resposta.text();
        })
        .then(html => {
            localDados.innerHTML = html;

            const painel = document.querySelector("#painel-dados");
            const abrir = document.querySelector("#abrir-dados");
            const fechar = document.querySelector("#fechar-dados");

            if (painel && abrir && fechar) {

                abrir.addEventListener("click", function () {
                    painel.hidden = false;

                    abrir.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                    fechar.focus();
                });

                fechar.addEventListener("click", function () {
                    painel.hidden = true;

                    abrir.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    abrir.focus();
                });
            }
        })
        .catch(erro => {
            console.error(
                "Não foi possível carregar dados.html.",
                erro
            );
        });
}


// FORMULARIOFIC.HTML

const abrirRelato = document.querySelector("#abrir-relato");
const fecharRelato = document.querySelector("#fechar-relato");
const painelRelato = document.querySelector("#painel-relato");

if (abrirRelato && fecharRelato && painelRelato) {

    abrirRelato.addEventListener("click", function () {
        painelRelato.hidden = false;
    });

    fecharRelato.addEventListener("click", function () {
        painelRelato.hidden = true;
        abrirRelato.focus();
    });
}
