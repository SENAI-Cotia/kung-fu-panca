package com.interclasse.repository;

import com.interclasse.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    long countByTimeId(Long timeId);
}