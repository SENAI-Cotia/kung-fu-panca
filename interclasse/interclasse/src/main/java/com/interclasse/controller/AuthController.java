package com.interclasse.controller;

import com.interclasse.model.Usuario;
import com.interclasse.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
public class AuthController {

    @Autowired
    private UsuarioRepository repo;

    @PostMapping("/register")
    public Object register(@RequestBody Usuario u){
        if(repo.findByUsername(u.getUsername()).isPresent()){
            return Map.of("erro","Usuário já existe");
        }

        repo.save(u);
        return Map.of("msg","ok");
    }

    @PostMapping("/login")
    public Object login(@RequestBody Usuario u){
        return repo.findByUsernameAndSenha(u.getUsername(), u.getSenha())
                .map(user -> Map.of("msg","ok","tipo", user.getTipo()))
                .orElse(Map.of("erro","Login inválido"));
    }
}