package com.interclasse.controller;

import com.interclasse.model.Time;
import com.interclasse.repository.TimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class TimeController {

    @Autowired
    private TimeRepository repo;

    @PostMapping("/times")
    public Object criar(@RequestBody Time t){

        if(repo.existsByUsuario(t.getUsuario())){
            return Map.of("erro","Você já criou um time");
        }

        repo.save(t);
        return Map.of("msg","ok");
    }

    @GetMapping("/times")
    public List<Time> listar(){
        return repo.findAll();
    }

    @PutMapping("/times/{id}")
    public Object editar(@PathVariable Long id, @RequestBody Map<String,String> data){
        Time time = repo.findById(id).orElse(null);

        if(time == null){
            return Map.of("erro","Time não encontrado");
        }

        String usuario = data.get("usuario");
        String tipo = data.get("tipo");

        if(!"admin".equals(tipo) && !time.getUsuario().equals(usuario)){
            return Map.of("erro","Sem permissão");
        }

        time.setNome(data.get("nome"));
        repo.save(time);

        return Map.of("msg","ok");
    }

    @DeleteMapping("/times/{id}")
    public Object deletar(@PathVariable Long id, @RequestBody Map<String,String> data){
        repo.deleteById(id);
        return Map.of("msg","ok");
    }
}