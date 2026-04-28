const API = "http://localhost:8080";

// LOGIN
function login(){
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    fetch(API + "/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:user, senha:pass})
    })
    .then(r=>r.json())
    .then(res=>{
        if(res.msg){
            localStorage.setItem("usuario", user);
            localStorage.setItem("tipo", res.tipo);

            if(res.tipo === "admin"){
                window.location = "admin.html";
            }else{
                window.location = "dashboard.html";
            }
        }else{
            alert(res.erro);
        }
    });
}

// REGISTRAR
function register(){
    const user = document.getElementById("newUser").value;
    const pass = document.getElementById("newPass").value;

    fetch(API + "/register",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:user, senha:pass})
    })
    .then(r=>r.json())
    .then(res=>{
        if(res.msg){
            alert("ok");
        }else{
            alert(res.erro);
        }
    });
}

// SAIR
function logout(){
    localStorage.clear();
    window.location = "index.html";
}

// CRIAR TIME
function criarTime(){
    fetch(API + "/times",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            nome: document.getElementById("nome").value,
            turma: document.getElementById("turma").value,
            categoria: document.getElementById("categoria").value,
            modalidade: document.getElementById("modalidade").value,
            usuario: localStorage.getItem("usuario")
        })
    })
    .then(r=>r.json())
    .then(res=>{
        if(res.msg){
            carregarTimes();
        }else{
            alert(res.erro);
        }
    });
}

// LISTAR TIMES
function carregarTimes(){
    fetch(API + "/times")
    .then(r=>r.json())
    .then(data=>{
        const div = document.getElementById("times");
        if(!div) return;

        div.innerHTML = "";

        data.forEach(t=>{
            div.innerHTML += `
            <div>
                <b>${t.nome}</b>
                <input id="a-${t.id}">
                <button onclick="addAluno(${t.id})">+</button>
                <div id="alunos-${t.id}"></div>
            </div>
            `;

            fetch(API + "/alunos/" + t.id)
            .then(r=>r.json())
            .then(alunos=>{
                document.getElementById("alunos-" + t.id).innerHTML =
                    alunos.map(a=>a.nome).join("<br>");
            });
        });
    });
}

// ADICIONAR ALUNO
function addAluno(id){
    const input = document.getElementById("a-" + id) || document.getElementById("adm-" + id);

    fetch(API + "/alunos",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            nome: input.value,
            time_id: id,
            usuario: localStorage.getItem("usuario"),
            tipo: localStorage.getItem("tipo")
        })
    })
    .then(r=>r.json())
    .then(res=>{
        if(res.erro){
            alert(res.erro);
        }else{
            input.value = "";
            carregarTimes();
            carregarAdmin();
        }
    });
}

// DELETAR ALUNO
function delAluno(id){
    fetch(API + "/alunos/" + id + "?tipo=" + localStorage.getItem("tipo"),{
        method:"DELETE"
    })
    .then(()=>carregarAdmin());
}

// LOGIN ADMIN
function loginAdmin(){
    const user = prompt("login");
    const pass = prompt("senha");

    if(user === "admin" && pass === "1234"){
        localStorage.setItem("usuario","admin");
        localStorage.setItem("tipo","admin");
        window.location = "admin.html";
    }else{
        alert("erro");
    }
}

// PAINEL ADMIN
function carregarAdmin(){
    fetch(API + "/times")
    .then(r=>r.json())
    .then(data=>{
        const div = document.getElementById("listaAdmin");
        if(!div) return;

        div.innerHTML = "";

        data.forEach(t=>{
            div.innerHTML += `
            <div>
                <input id="n-${t.id}" value="${t.nome}">
                <button onclick="editar(${t.id})">ok</button>
                <button onclick="excluir(${t.id})">x</button>

                <input id="adm-${t.id}">
                <button onclick="addAluno(${t.id})">+</button>

                <div id="adm-alunos-${t.id}"></div>
            </div>
            `;

            fetch(API + "/alunos/" + t.id)
            .then(r=>r.json())
            .then(alunos=>{
                document.getElementById("adm-alunos-" + t.id).innerHTML =
                    alunos.map(a=>a.nome + " <button onclick='delAluno("+a.id+")'>x</button>").join("<br>");
            });
        });
    });
}

// EDITAR TIME
function editar(id){
    fetch(API + "/times/" + id,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            nome: document.getElementById("n-" + id).value,
            tipo: localStorage.getItem("tipo")
        })
    })
    .then(()=>carregarAdmin());
}

// EXCLUIR TIME
function excluir(id){
    fetch(API + "/times/" + id + "?tipo=" + localStorage.getItem("tipo"),{
        method:"DELETE"
    })
    .then(()=>carregarAdmin());
}

// INICIO
window.onload = ()=>{
    carregarTimes();
    carregarAdmin();
};