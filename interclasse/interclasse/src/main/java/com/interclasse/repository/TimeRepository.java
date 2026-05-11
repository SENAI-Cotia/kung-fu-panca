package com.interclasse.repository;

import com.interclasse.model.Time;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeRepository extends JpaRepository<Time, Long> {

    boolean existsByUsuario(String usuario);

    boolean existsByNome(String nome);
}