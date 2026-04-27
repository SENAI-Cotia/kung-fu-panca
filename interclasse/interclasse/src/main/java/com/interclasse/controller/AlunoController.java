package com.interclasse.controller;

import com.interclasse.model.Aluno;
import com.interclasse.model.Time;
import com.interclasse.repository.AlunoRepository;
import com.interclasse.repository.TimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class AlunoController {

    @Autowired
    private AlunoRepository repo;

    @Autowired
    private TimeRepository timeRepo;

    @PostMapping("/alunos")
    public Object add(@RequestBody Map<String,Object> data){

        Long timeId = Long.valueOf(data.get("time_id").toString());

        if(repo.countByTimeId(timeId) >= 12){
            return Map.of("erro","Limite atingido");
        }

        Time time = timeRepo.findById(timeId).orElse(null);

        if(time == null){
            return Map.of("erro","Time não encontrado");
        }

        Aluno a = new Aluno();
        a.setNome(data.get("nome").toString());
        a.setTime(time);

        repo.save(a);

        return Map.of("msg","ok");
    }

    @GetMapping("/alunos/{id}")
    public List<Aluno> listar(@PathVariable Long id){
        return repo.findAll().stream()
                .filter(a -> a.getTime().getId().equals(id))
                .toList();
    }

    @DeleteMapping("/alunos/{id}")
    public Object deletar(@PathVariable Long id){
        repo.deleteById(id);
        return Map.of("msg","ok");
    }
}