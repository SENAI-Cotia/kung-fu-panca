package com.interclasse.controller;

import com.interclasse.repository.UsuarioRepository;
import com.interclasse.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AuthController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(
            UsuarioService usuarioService,
            UsuarioRepository usuarioRepository
    ) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public String admin(Model model) {
        model.addAttribute("usuarios", usuarioRepository.findAll());
        return "admin";
    }

    @PostMapping("/usuarios")
    public String criarUsuario(
            @RequestParam String nome,
            @RequestParam String email,
            @RequestParam String senha
    ) {
        usuarioService.criarUsuario(nome, email, senha, "ROLE_USER");
        return "redirect:/admin";
    }

    @PostMapping("/usuarios/{id}/banir")
    public String banirOuDesbanir(@PathVariable Long id) {
        usuarioService.banirOuDesbanir(id);
        return "redirect:/admin";
    }
}