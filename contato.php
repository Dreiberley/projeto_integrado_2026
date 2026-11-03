<?php

include "conexao.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nome = $_POST["nome"];
    $email = $_POST["email"];
    $mensagem = $_POST["mensagem"];

    $sql = $conexao->prepare(
        "INSERT INTO contatos (nome, email, mensagem)
         VALUES (?, ?, ?)"
    );

    $sql->bind_param("sss", $nome, $email, $mensagem);

    if ($sql->execute()) {
        echo "Mensagem enviada com sucesso!";
    } else {
        echo "Erro ao enviar mensagem.";
    }

    $sql->close();
}

$conexao->close();

?>