package com.interclasse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AlunoDTO {

    @NotBlank
    private String nome;

    @NotNull
    private Long timeId;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Long getTimeId() { return timeId; }
    public void setTimeId(Long timeId) { this.timeId = timeId; }
}