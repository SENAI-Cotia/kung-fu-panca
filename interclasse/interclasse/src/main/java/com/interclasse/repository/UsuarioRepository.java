package com.interclasse.repository;

import com.interclasse.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsernameAndSenha(String username, String senha);
    Optional<Usuario> findByUsername(String username);
}