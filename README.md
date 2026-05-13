# Interclasse SENAI/SESI

Sistema web desenvolvido para gerenciamento de campeonatos interclasse do SENAI/SESI.

O projeto permite cadastro de alunos, criação de times, autenticação de usuários e gerenciamento administrativo através de uma interface web moderna utilizando Spring Boot.

════════════════════════════════════

# Preview do Projeto

> Adicione aqui prints do sistema:

* Tela de Login
* Dashboard
* Cadastro de Times
* Painel Administrativo

Exemplo:

```md
![Login](./docs/login.png)
```

════════════════════════════════════

# Tecnologias Utilizadas

## Backend

* Java 21
* Spring Boot 3
* Spring MVC
* Spring Security
* Spring Data JPA
* Hibernate
* Maven

## Frontend

* HTML5
* CSS3
* JavaScript
* Thymeleaf

## Banco de Dados

* H2 Database (desenvolvimento)
* PostgreSQL (produção/Render)

════════════════════════════════════

# Estrutura do Projeto

```bash
src/
 ├── main/
 │   ├── java/com/interclasse
 │   │   ├── config/
 │   │   ├── controller/
 │   │   ├── dto/
 │   │   ├── model/
 │   │   ├── repository/
 │   │   └── service/
 │   │
 │   └── resources/
 │       ├── static/
 │       │   ├── css/
 │       │   └── js/
 │       │
 │       └── templates/
 │
 └── test/
```

════════════════════════════════════

# Funcionalidades

Sistema de login e autenticação

Controle de acesso com Spring Security

Cadastro de alunos

Criação de times

Dashboard administrativa

Persistência com JPA/Hibernate

Integração com PostgreSQL

Templates dinâmicos com Thymeleaf

════════════════════════════════════

# Segurança

O projeto utiliza:

* Spring Security
* Controle de rotas protegidas
* Autenticação de usuários
* Configuração personalizada de segurança

════════════════════════════════════

# Como Executar o Projeto

## Pré-requisitos

Instale:

* Java 21
* Maven
* Git

════════════════════════════════════

## Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/interclasse.git
```

════════════════════════════════════

## Entre na pasta do projeto

```bash
cd interclasse
```

════════════════════════════════════

## Execute o projeto

### Linux/Mac

```bash
./mvnw spring-boot:run
```

### Windows

```bash
mvnw.cmd spring-boot:run
```

════════════════════════════════════

# Acesso

Após iniciar:

```bash
http://localhost:8080
```

════════════════════════════════════

# Banco de Dados H2

Console H2:

```bash
http://localhost:8080/h2-console
```

════════════════════════════════════

# Deploy

O sistema foi preparado para deploy utilizando:

* H2 dadabase (spring boot)
* Render

════════════════════════════════════

# Aprendizados

Este projeto foi desenvolvido para prática de:

* Arquitetura MVC
* Segurança com Spring Security
* CRUD com Spring Boot
* Integração frontend/backend
* Persistência de dados
* Organização de projetos Java

════════════════════════════════════

# Autor

Desenvolvido por:

Arthur Feliciano
Pedro Marinho
Winicius Cesar


