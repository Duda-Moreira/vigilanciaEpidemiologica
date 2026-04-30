package com.monitoramento.epidemia.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class ApiErro {

    private int status;
    private String mensagem;
    private String caminho;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public ApiErro(int status, String mensagem, String caminho) {
        this.status = status;
        this.mensagem = mensagem;
        this.caminho = caminho;
        this.timestamp = LocalDateTime.now();
    }

    // Getters
    public int getStatus() {
        return status;
    }

    public String getMensagem() {
        return mensagem;
    }

    public String getCaminho() {
        return caminho;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}