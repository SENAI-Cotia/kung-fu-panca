package com.interclasse.controller;

import com.interclasse.model.Time;
import com.interclasse.repository.AlunoRepository;
import com.interclasse.repository.TimeRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class TimeController {

    private final TimeRepository timeRepository;
    private final AlunoRepository alunoRepository;

    public TimeController(
            TimeRepository timeRepository,
            AlunoRepository alunoRepository
    ) {
        this.timeRepository = timeRepository;
        this.alunoRepository = alunoRepository;
    }

    @PostMapping("/times")
    public ResponseEntity<?> criar(@RequestBody Time time) {

        if (time.getUsuario() == null || time.getUsuario().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Usuário obrigatório"));
        }

        if (timeRepository.existsByUsuario(time.getUsuario())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Você já criou um time"));
        }

        if (timeRepository.existsByNome(time.getNome())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nome do time já existe"));
        }

        Time salvo = timeRepository.save(time);

        return ResponseEntity.ok(salvo);
    }

    @GetMapping("/times")
    public List<Time> listar() {
        return timeRepository.findAll();
    }

    @PutMapping("/times/{id}")
    public ResponseEntity<?> editar(
            @PathVariable Long id,
            @RequestBody Map<String, String> data
    ) {

        Time time = timeRepository.findById(id).orElse(null);

        if (time == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Time não encontrado"));
        }

        String nome = data.get("nome");

        if (nome == null || nome.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nome obrigatório"));
        }

        time.setNome(nome);

        timeRepository.save(time);

        return ResponseEntity.ok(Map.of("msg", "Time atualizado"));
    }

    @DeleteMapping("/times/{id}")
    @Transactional
    public ResponseEntity<?> deletar(@PathVariable Long id) {

        if (!timeRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Time não encontrado"));
        }

        alunoRepository.deleteByTimeId(id);

        timeRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("msg", "Time removido"));
    }
}