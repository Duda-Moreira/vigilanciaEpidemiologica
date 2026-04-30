package com.monitoramento.epidemia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "casos")
public class Caso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(name = "cidade", nullable = false, length = 100)
    private String cidade;

    @NotNull(message = "Data de coleta é obrigatória")
    @Column(name = "data_coleta", nullable = false)
    private LocalDate dataColeta;

    @NotNull(message = "Número de casos é obrigatório")
    @Min(value = 0, message = "Número de casos deve ser maior ou igual a zero")
    @Column(name = "casos", nullable = false)
    private int casos;

    @NotNull(message = "População é obrigatória")
    @Min(value = 1, message = "População deve ser maior que zero")
    @Column(name = "populacao", nullable = false)
    private int populacao;

    // Construtores
    public Caso() {}

    public Caso(String cidade, LocalDate dataColeta, int casos, int populacao) {
        this.cidade = cidade;
        this.dataColeta = dataColeta;
        this.casos = casos;
        this.populacao = populacao;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public LocalDate getDataColeta() {
        return dataColeta;
    }

    public void setDataColeta(LocalDate dataColeta) {
        this.dataColeta = dataColeta;
    }

    public int getCasos() {
        return casos;
    }

    public void setCasos(int casos) {
        this.casos = casos;
    }

    public int getPopulacao() {
        return populacao;
    }

    public void setPopulacao(int populacao) {
        this.populacao = populacao;
    }

    @Override
    public String toString() {
        return "Caso{" +
                "id=" + id +
                ", cidade='" + cidade + '\'' +
                ", dataColeta=" + dataColeta +
                ", casos=" + casos +
                ", populacao=" + populacao +
                '}';
    }
}