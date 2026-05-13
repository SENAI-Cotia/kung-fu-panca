package com.interclasse.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String inicio() {
        return "redirect:/login";
    }

    @GetMapping("/index.html")
    public String indexHtml() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/dashboard.html")
    public String dashboardHtml() {
        return "redirect:/dashboard";
    }

    @GetMapping("/criarTime")
    public String criarTime() {
        return "criarTime";
    }

    @GetMapping("/criarTime.html")
    public String criarTimeHtml() {
        return "redirect:/criarTime";
    }
}