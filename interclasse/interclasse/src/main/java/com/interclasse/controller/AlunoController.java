package com.interclasse.controller;

import com.interclasse.model.Aluno;
import com.interclasse.model.Time;
import com.interclasse.repository.AlunoRepository;
import com.interclasse.repository.TimeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin
public class AlunoController {

    @Autowired
    private AlunoRepository repo;

    @Autowired
    private TimeRepository timeRepo;

    @PostMapping("/alunos")
    public ResponseEntity<?> add(@RequestBody Map<String,Object> data){

        try{
            Long timeId = Long.valueOf(data.get("time_id").toString());
            String nome = data.get("nome").toString().trim();
            String usuario = data.get("usuario").toString();
            String tipo = data.get("tipo").toString();

            Time time = timeRepo.findById(timeId).orElse(null);

            if(time == null){
                return ResponseEntity.badRequest().body(Map.of("erro","Time não encontrado"));
            }

            // REGRA: só dono ou admin
            if(!"admin".equals(tipo) && !time.getUsuario().equals(usuario)){
                return ResponseEntity.status(403)
                        .body(Map.of("erro","Só no seu time"));
            }

            if(repo.countByTimeId(timeId) >= 12){
                return ResponseEntity.badRequest()
                        .body(Map.of("erro","Máx 12 alunos"));
            }

            Aluno a = new Aluno();
            a.setNome(nome);
            a.setTime(time);

            repo.save(a);

            return ResponseEntity.ok(Map.of("msg","ok"));

        }catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("erro","Dados inválidos"));
        }
    }

    @GetMapping("/alunos/{id}")
    public List<Aluno> listar(@PathVariable Long id){
        return repo.findByTimeId(id);
    }

    // DELETE (ADMIN)
    @DeleteMapping("/alunos/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id,
                                     @RequestParam String tipo){

        if(!"admin".equals(tipo)){
            return ResponseEntity.status(403)
                    .body(Map.of("erro","Apenas admin"));
        }

        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("msg","ok"));
    }
}