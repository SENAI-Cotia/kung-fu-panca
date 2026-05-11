package com.interclasse.repository;

import com.interclasse.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    long countByTimeId(Long timeId);

    List<Aluno> findByTimeId(Long timeId);
}