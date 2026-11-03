
<?php

// Conexão com o banco de dados
include "conexao.php";

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recebe os dados do formulário
    $nome = trim($_POST["nome"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $mensagem = trim($_POST["mensagem"] ?? "");

    // Verifica se os campos estão preenchidos
    if (empty($nome) || empty($email) || empty($mensagem)) {
        die("Preencha todos os campos.");
    }

    // Prepara o comando SQL
    $sql = $conexao->prepare(
        "INSERT INTO contatos (nome, email, mensagem)
         VALUES (?, ?, ?)"
    );

    if (!$sql) {
        die("Erro ao preparar o envio.");
    }

    // Associa os valores aos campos
    $sql->bind_param("sss", $nome, $email, $mensagem);

    // Executa o comando
    if ($sql->execute()) {

        echo "Mensagem enviada com sucesso!";

    } else {

        echo "Erro ao enviar mensagem.";

    }

    // Fecha a consulta
    $sql->close();

} else {

    echo "Acesso inválido.";

}

// Fecha a conexão
$conexao->close();

?>
