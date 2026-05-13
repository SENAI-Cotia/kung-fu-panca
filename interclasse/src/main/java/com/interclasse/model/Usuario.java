package com.interclasse.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean banido;

    @Column(unique = true, nullable = false)
    private String email;

    private String nome;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String senha;

    public Long getId() {
        return id;
    }

    public boolean isBanido() {
        return banido;
    }

    public String getEmail() {
        return email;
    }

    public String getNome() {
        return nome;
    }

    public String getRole() {
        return role;
    }

    public String getSenha() {
        return senha;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setBanido(boolean banido) {
        this.banido = banido;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}