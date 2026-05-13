package com.interclasse.controller;

import com.interclasse.model.Time;
import com.interclasse.repository.TimeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class TimeController {

    @Autowired
    private TimeRepository repo;

    @PostMapping("/times")
    public ResponseEntity<?> criar(@RequestBody Time t){

        if(t.getUsuario() == null || t.getUsuario().isBlank()){
            return ResponseEntity.badRequest().body(Map.of("erro","Usuário obrigatório"));
        }

        if(repo.existsByUsuario(t.getUsuario())){
            return ResponseEntity.badRequest().body(Map.of("erro","Você já criou um time"));
        }

        if(repo.existsByNome(t.getNome())){
            return ResponseEntity.badRequest().body(Map.of("erro","Nome do time já existe"));
        }

        repo.save(t);
        return ResponseEntity.ok(Map.of("msg","ok"));
    }

    @GetMapping("/times")
    public List<Time> listar(){
        return repo.findAll();
    }

    // EDITAR (ADMIN)
    @PutMapping("/times/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id,
                                    @RequestBody Map<String,String> data){

        Time time = repo.findById(id).orElse(null);

        if(time == null){
            return ResponseEntity.badRequest().body(Map.of("erro","Time não encontrado"));
        }

        if(!"admin".equals(data.get("tipo"))){
            return ResponseEntity.status(403).body(Map.of("erro","Apenas admin"));
        }

        String nome = data.get("nome");

        if(nome == null || nome.isBlank()){
            return ResponseEntity.badRequest().body(Map.of("erro","Nome obrigatório"));
        }

        time.setNome(nome);
        repo.save(time);

        return ResponseEntity.ok(Map.of("msg","ok"));
    }

    // EXCLUIR (ADMIN)
    @DeleteMapping("/times/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id,
                                     @RequestParam String tipo){

        if(!"admin".equals(tipo)){
            return ResponseEntity.status(403).body(Map.of("erro","Apenas admin"));
        }

        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("msg","ok"));
    }
}