const API = "http://localhost:8080";

let alunosCount = 0;

function toast(msg){

  const t = document.getElementById("toast");

  if(!t) return;

  t.innerText = msg;

  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 3000);
}

function getUsuarios(){
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function setUsuarios(lista){
  localStorage.setItem("usuarios", JSON.stringify(lista));
}

function getTimes(){
  return JSON.parse(localStorage.getItem("times")) || [];
}

function setTimes(lista){
  localStorage.setItem("times", JSON.stringify(lista));
}

async function login(){

  const email = document.getElementById("user").value;
  const senha = document.getElementById("pass").value;

  if(
    email === "superadmin@admin.com" &&
    senha === "1234"
  ){

    localStorage.setItem("tipoUsuario","admin");
    localStorage.setItem("usuarioLogado",email);

    window.location.href = "admin.html";

    return;
  }

  const usuarios = getUsuarios();

  const usuario = usuarios.find(u =>
    u.email === email &&
    u.senha === senha
  );

  if(!usuario){

    toast("Usuário ou senha inválidos");

    return;
  }

  if(usuario.banido){

    toast("Usuário banido");

    return;
  }

  localStorage.setItem("tipoUsuario","usuario");
  localStorage.setItem("usuarioLogado",email);

  window.location.href = "dashboard.html";
}

function logout(){

  localStorage.removeItem("tipoUsuario");
  localStorage.removeItem("usuarioLogado");

  window.location.href = "index.html";
}

function toggleSidebar(){

  document
    .querySelector(".sidebar")
    .classList
    .toggle("open");
}

/* =======================
   DASHBOARD
======================= */

function initDashboard(){

  const tipo = localStorage.getItem("tipoUsuario");

  if(tipo !== "usuario"){

    window.location.href = "index.html";

    return;
  }

  const email = localStorage.getItem("usuarioLogado");

  document.getElementById("topEmail").innerText = email;

  carregarDashboard();
}

function carregarDashboard(){

  const times = getTimes();

  const area = document.getElementById("times");

  area.innerHTML = "";

  let jogadores = 0;

  times.forEach(time => {

    jogadores += time.alunos.length;

    area.innerHTML += `
      <div class="team-card">

        <h3>${time.nome}</h3>

        <div class="team-meta">
          <span>${time.turma}</span>
          <span>${time.modalidade}</span>
          <span>${time.categoria}</span>
        </div>

        <div>
          <b>Jogadores:</b>
          ${time.alunos.join(", ")}
        </div>

      </div>
    `;
  });

  document.getElementById("statTimes").innerText = times.length;
  document.getElementById("statAlunos").innerText = jogadores;

  const meuEmail = localStorage.getItem("usuarioLogado");

  const meuTime = times.find(t => t.criador === meuEmail);

  document.getElementById("statMeuTime").innerText =
    meuTime ? "1" : "0";
}

function addAluno(){

  if(alunosCount >= 12){

    toast("Máximo de 12 jogadores");

    return;
  }

  alunosCount++;

  const area = document.getElementById("alunos");

  const div = document.createElement("div");

  div.className = "player-row";

  div.innerHTML = `
    <input type="text" placeholder="Nome do jogador">

    <button class="btn danger" onclick="delAluno(this)">
      Remover
    </button>
  `;

  area.appendChild(div);
}

function delAluno(btn){

  alunosCount--;

  btn.parentElement.remove();
}

function criarTime(){

  const nome = document.getElementById("nomeTime").value;

  const turma = document.getElementById("turma").value;

  const modalidade =
    document.getElementById("modalidade").value;

  const categoria =
    document.getElementById("categoria").value;

  const usuario =
    localStorage.getItem("usuarioLogado");

  const times = getTimes();

  const jaTem = times.find(t => t.criador === usuario);

  if(jaTem){

    toast("Você já possui um time");

    return;
  }

  const nomeDuplicado =
    times.find(t =>
      t.nome.toLowerCase() === nome.toLowerCase()
    );

  if(nomeDuplicado){

    toast("Nome do time já existe");

    return;
  }

  const inputs =
    document.querySelectorAll("#alunos input");

  const alunos = [];

  inputs.forEach(i => {

    if(i.value.trim() !== ""){

      alunos.push(i.value);
    }
  });

  if(
    !nome ||
    !turma ||
    !modalidade ||
    !categoria
  ){

    toast("Preencha todos os campos");

    return;
  }

  if(alunos.length === 0){

    toast("Adicione jogadores");

    return;
  }

  const novo = {
    id:Date.now(),
    nome,
    turma,
    modalidade,
    categoria,
    criador:usuario,
    alunos
  };

  times.push(novo);

  setTimes(times);

  toast("Time criado");

  document.getElementById("nomeTime").value = "";
  document.getElementById("alunos").innerHTML = "";

  carregarDashboard();
}

/* =======================
   ADMIN
======================= */

function initAdmin(){

  const tipo = localStorage.getItem("tipoUsuario");

  if(tipo !== "admin"){

    window.location.href = "index.html";

    return;
  }

  carregarUsuarios();
  carregarTimesAdmin();
  atualizarStatsAdmin();
}

function atualizarStatsAdmin(){

  const usuarios = getUsuarios();
  const times = getTimes();

  let jogadores = 0;

  times.forEach(t => {
    jogadores += t.alunos.length;
  });

  const banidos =
    usuarios.filter(u => u.banido).length;

  document.getElementById("statUsuarios").innerText =
    usuarios.length;

  document.getElementById("statTimesAdmin").innerText =
    times.length;

  document.getElementById("statJogadoresAdmin").innerText =
    jogadores;

  document.getElementById("statBanidos").innerText =
    banidos;
}

/* =======================
   CRIAR USUARIO
======================= */

function criarUsuario(){

  const nome =
    document.getElementById("novoNomeUsuario").value;

  const email =
    document.getElementById("novoEmailUsuario").value;

  const senha =
    document.getElementById("novaSenhaUsuario").value;

  if(!nome || !email || !senha){

    toast("Preencha tudo");

    return;
  }

  const usuarios = getUsuarios();

  const existe =
    usuarios.find(u => u.email === email);

  if(existe){

    toast("Usuário já existe");

    return;
  }

  usuarios.push({
    id:Date.now(),
    nome,
    email,
    senha,
    banido:false
  });

  setUsuarios(usuarios);

  toast("Usuário criado");

  carregarUsuarios();
  atualizarStatsAdmin();

  document.getElementById("novoNomeUsuario").value = "";
  document.getElementById("novoEmailUsuario").value = "";
  document.getElementById("novaSenhaUsuario").value = "";
}

/* =======================
   LISTAR USUARIOS
======================= */

function carregarUsuarios(){

  const usuarios = getUsuarios();

  const area =
    document.getElementById("listaUsuarios");

  area.innerHTML = "";

  usuarios.forEach(user => {

    area.innerHTML += `
      <div class="user-card">

        <div class="user-top">

          <div>
            <h3>${user.nome}</h3>
            <p>${user.email}</p>
          </div>

          <span class="badge ${
            user.banido ? "status-ban" : "status-ok"
          }">

            ${user.banido ? "Banido" : "Ativo"}

          </span>

        </div>

        <div class="admin-actions">

          <button
            class="btn ${
              user.banido ? "success-btn" : "warning"
            }"

            onclick="toggleBan(${user.id})"
          >

            ${
              user.banido
              ? "Desbanir"
              : "Banir"
            }

          </button>

        </div>

      </div>
    `;
  });
}

function toggleBan(id){

  const usuarios = getUsuarios();

  const usuario =
    usuarios.find(u => u.id === id);

  usuario.banido = !usuario.banido;

  setUsuarios(usuarios);

  carregarUsuarios();
  atualizarStatsAdmin();
}

/* =======================
   TIMES ADMIN
======================= */

function carregarTimesAdmin(){

  const times = getTimes();

  const area =
    document.getElementById("adminTimes");

  area.innerHTML = "";

  times.forEach(time => {

    area.innerHTML += `
      <div class="admin-card">

        <h3>${time.nome}</h3>

        <div class="team-meta">

          <span>${time.turma}</span>
          <span>${time.modalidade}</span>
          <span>${time.categoria}</span>

        </div>

        <div>
          <b>Jogadores:</b>
          ${time.alunos.join(", ")}
        </div>

        <div class="admin-actions">

          <button
            class="btn primary"
            onclick="editarNome(${time.id})"
          >
            Editar nome
          </button>

          <button
            class="btn ghost"
            onclick="addJogador(${time.id})"
          >
            Adicionar jogador
          </button>

          <button
            class="btn warning"
            onclick="removerJogador(${time.id})"
          >
            Remover jogador
          </button>

          <button
            class="btn danger"
            onclick="excluirTime(${time.id})"
          >
            Excluir time
          </button>

        </div>

      </div>
    `;
  });
}

function editarNome(id){

  const times = getTimes();

  const time =
    times.find(t => t.id === id);

  const novo =
    prompt("Novo nome:", time.nome);

  if(!novo) return;

  time.nome = novo;

  setTimes(times);

  carregarTimesAdmin();
}

function addJogador(id){

  const times = getTimes();

  const time =
    times.find(t => t.id === id);

  if(time.alunos.length >= 12){

    toast("Máximo de 12");

    return;
  }

  const nome =
    prompt("Nome do jogador:");

  if(!nome) return;

  time.alunos.push(nome);

  setTimes(times);

  carregarTimesAdmin();
  atualizarStatsAdmin();
}

function removerJogador(id){

  const times = getTimes();

  const time =
    times.find(t => t.id === id);

  const nome =
    prompt(
      "Nome do jogador para remover:"
    );

  if(!nome) return;

  time.alunos =
    time.alunos.filter(a => a !== nome);

  setTimes(times);

  carregarTimesAdmin();
  atualizarStatsAdmin();
}

function excluirTime(id){

  const confirmar =
    confirm("Excluir time?");

  if(!confirmar) return;

  let times = getTimes();

  times = times.filter(t => t.id !== id);

  setTimes(times);

  carregarTimesAdmin();
  atualizarStatsAdmin();
}

/* =======================
   SIMULAR EVENTO
======================= */

function simularEvento(){

  const modalidade =
    document.getElementById("simModalidade").value;

  const categoria =
    document.getElementById("simCategoria").value;

  const area =
    document.getElementById("resultadoSimulacao");

  area.innerHTML = "";

  const times = getTimes().filter(t =>
    t.modalidade === modalidade &&
    t.categoria === categoria
  );

  if(times.length < 2){

    area.innerHTML = `
      <div class="sim-card">
        Necessário no mínimo 2 times.
      </div>
    `;

    return;
  }

  for(let i = 0; i < times.length; i += 2){

    const t1 = times[i];
    const t2 = times[i + 1];

    if(!t2) break;

    const p1 =
      Math.floor(Math.random() * 6);

    const p2 =
      Math.floor(Math.random() * 6);

    let vencedor =
      p1 > p2 ? t1.nome : t2.nome;

    if(p1 === p2){

      vencedor = "Empate";
    }

    area.innerHTML += `
      <div class="sim-card">

        <strong>
          ${t1.nome} ${p1} x ${p2} ${t2.nome}
        </strong>

        <span>
          Modalidade: ${modalidade}
        </span>

        <br>

        <span>
          Categoria: ${categoria}
        </span>

        <br><br>

        <b>
          ${
            vencedor === "Empate"
            ? "Partida empatada"
            : `Vencedor: ${vencedor}`
          }
        </b>

      </div>
    `;
  }
}