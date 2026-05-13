package com.interclasse.config;

import com.interclasse.model.Usuario;
import com.interclasse.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!usuarioRepository.existsByEmail("superadmin@admin.com")) {

            Usuario admin = new Usuario();

            admin.setNome("Administrador");
            admin.setEmail("superadmin@admin.com");
            admin.setSenha(passwordEncoder.encode("1234"));
            admin.setRole("ROLE_ADMIN");
            admin.setBanido(false);

            usuarioRepository.save(admin);
        }
    }
}