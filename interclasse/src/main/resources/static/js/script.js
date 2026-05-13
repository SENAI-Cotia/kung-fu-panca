let alunosCount = 0;

function toast(msg) {
  const t = document.getElementById("toast");

  if (!t) return;

  t.innerText = msg;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 3000);
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

function addAluno() {
  if (alunosCount >= 12) {
    toast("Máximo de 12 jogadores");
    return;
  }

  alunosCount++;

  const area = document.getElementById("alunos");

  if (!area) return;

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

function delAluno(btn) {
  alunosCount--;
  btn.parentElement.remove();
}

async function buscarAlunosDoTime(timeId) {
  try {
    const req = await fetch(`/alunos/${timeId}`);

    if (!req.ok) return [];

    return await req.json();

  } catch (e) {
    return [];
  }
}

function atualizarStatsUsuarios() {
  const usuarios = document.querySelectorAll(".user-card");

  let banidos = 0;

  usuarios.forEach(user => {
    const badge = user.querySelector(".badge");

    if (badge && badge.innerText.trim().includes("Banido")) {
      banidos++;
    }
  });

  const statUsuarios = document.getElementById("statUsuarios");
  const statBanidos = document.getElementById("statBanidos");

  if (statUsuarios) statUsuarios.innerText = usuarios.length;
  if (statBanidos) statBanidos.innerText = banidos;
}

async function carregarTimes() {
  const area = document.getElementById("times");
  const adminArea = document.getElementById("adminTimes");

  atualizarStatsUsuarios();

  if (!area && !adminArea) return;

  try {
    const req = await fetch("/times");

    if (!req.ok) {
      toast("Erro ao carregar times");
      return;
    }

    const times = await req.json();

    let jogadoresTotal = 0;

    if (area) area.innerHTML = "";
    if (adminArea) adminArea.innerHTML = "";

    for (const time of times) {
      const alunos = await buscarAlunosDoTime(time.id);

      jogadoresTotal += alunos.length;

      const jogadoresTexto = alunos.length > 0
        ? alunos.map(a => a.nome).join(", ")
        : "Nenhum jogador";

      if (area) {
        area.innerHTML += `
          <div class="team-card">

            <h3>${time.nome}</h3>

            <div class="team-meta">
              <span>${time.turma || "Sem turma"}</span>
              <span>${time.modalidade || "Sem modalidade"}</span>
              <span>${time.categoria || "Sem categoria"}</span>
            </div>

            <div>
              <b>Jogadores:</b>
              ${jogadoresTexto}
            </div>

          </div>
        `;
      }

      if (adminArea) {
        adminArea.innerHTML += `
          <div class="admin-card">

            <h3>${time.nome}</h3>

            <div class="team-meta">
              <span>${time.turma || "Sem turma"}</span>
              <span>${time.modalidade || "Sem modalidade"}</span>
              <span>${time.categoria || "Sem categoria"}</span>
            </div>

            <div>
              <b>Dono:</b> ${time.usuario || "Não informado"}
            </div>

            <div>
              <b>Jogadores:</b>
              ${jogadoresTexto}
            </div>

            <div class="admin-actions">

              <button class="btn primary" onclick="editarNomeTime(${time.id}, '${time.nome}')">
                Editar nome
              </button>

              <button class="btn ghost" onclick="adicionarJogadorAdmin(${time.id})">
                Adicionar jogador
              </button>

              <button class="btn warning" onclick="removerJogadorAdmin(${time.id})">
                Remover jogador
              </button>

              <button class="btn danger" onclick="excluirTime(${time.id})">
                Excluir time
              </button>

            </div>

          </div>
        `;
      }
    }

    const statTimes = document.getElementById("statTimes");
    const statAlunos = document.getElementById("statAlunos");
    const statMeuTime = document.getElementById("statMeuTime");
    const statTimesAdmin = document.getElementById("statTimesAdmin");
    const statJogadoresAdmin = document.getElementById("statJogadoresAdmin");

    if (statTimes) statTimes.innerText = times.length;
    if (statAlunos) statAlunos.innerText = jogadoresTotal;
    if (statMeuTime) statMeuTime.innerText = "0";
    if (statTimesAdmin) statTimesAdmin.innerText = times.length;
    if (statJogadoresAdmin) statJogadoresAdmin.innerText = jogadoresTotal;

    atualizarStatsUsuarios();

  } catch (e) {
    console.log(e);
    toast("Erro ao carregar times");
  }
}

async function criarTime() {
  const nome = document.getElementById("nomeTime")?.value;
  const turma = document.getElementById("turma")?.value;
  const modalidade = document.getElementById("modalidade")?.value;
  const categoria = document.getElementById("categoria")?.value;
  const usuario = document.getElementById("usuarioLogado")?.value;

  const inputs = document.querySelectorAll("#alunos input");

  const alunos = [];

  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      alunos.push(input.value.trim());
    }
  });

  if (!nome || !turma || !modalidade || !categoria) {
    toast("Preencha todos os campos");
    return;
  }

  if (alunos.length === 0) {
    toast("Adicione pelo menos um jogador");
    return;
  }

  if (alunos.length > 12) {
    toast("Máximo de 12 jogadores");
    return;
  }

  const time = {
    nome,
    turma,
    modalidade,
    categoria,
    usuario
  };

  try {
    const req = await fetch("/times", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(time)
    });

    if (!req.ok) {
      const erro = await req.json();
      toast(erro.erro || "Erro ao criar time");
      return;
    }

    const timeSalvo = await req.json();

    for (const nomeAluno of alunos) {
      await fetch("/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          time_id: timeSalvo.id,
          nome: nomeAluno,
          usuario: usuario,
          tipo: "user"
        })
      });
    }

    toast("Time criado com sucesso");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 900);

  } catch (e) {
    console.log(e);
    toast("Erro no servidor");
  }
}

async function editarNomeTime(id, nomeAtual) {
  const novoNome = prompt("Novo nome do time:", nomeAtual);

  if (!novoNome) return;

  try {
    const req = await fetch(`/times/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: novoNome,
        tipo: "admin"
      })
    });

    if (req.ok) {
      toast("Time atualizado");
      carregarTimes();
    } else {
      toast("Erro ao editar time");
    }

  } catch (e) {
    toast("Erro no servidor");
  }
}

async function excluirTime(id) {
  const confirmar = confirm("Deseja excluir este time?");

  if (!confirmar) return;

  try {
    const req = await fetch(`/times/${id}?tipo=admin`, {
      method: "DELETE"
    });

    if (req.ok) {
      toast("Time excluído");
      carregarTimes();
    } else {
      toast("Erro ao excluir time");
    }

  } catch (e) {
    toast("Erro no servidor");
  }
}

async function adicionarJogadorAdmin(timeId) {
  const nome = prompt("Nome do jogador:");

  if (!nome) return;

  try {
    const req = await fetch("/alunos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        time_id: timeId,
        nome: nome,
        usuario: "admin",
        tipo: "admin"
      })
    });

    if (req.ok) {
      toast("Jogador adicionado");
      carregarTimes();
    } else {
      toast("Erro ao adicionar jogador");
    }

  } catch (e) {
    toast("Erro no servidor");
  }
}

async function removerJogadorAdmin(timeId) {
  const alunos = await buscarAlunosDoTime(timeId);

  if (alunos.length === 0) {
    toast("Esse time não tem jogadores");
    return;
  }

  const lista = alunos.map(a => `${a.id} - ${a.nome}`).join("\n");

  const id = prompt("Digite o ID do jogador para remover:\n\n" + lista);

  if (!id) return;

  try {
    const req = await fetch(`/alunos/${id}?tipo=admin`, {
      method: "DELETE"
    });

    if (req.ok) {
      toast("Jogador removido");
      carregarTimes();
    } else {
      toast("Erro ao remover jogador");
    }

  } catch (e) {
    toast("Erro no servidor");
  }
}

async function simularEvento() {
  const modalidade = document.getElementById("simModalidade")?.value;
  const categoria = document.getElementById("simCategoria")?.value;
  const area = document.getElementById("resultadoSimulacao");

  if (!area) return;

  area.innerHTML = "";

  if (!modalidade || !categoria) {
    toast("Selecione modalidade e categoria");
    return;
  }

  try {
    const req = await fetch("/times");
    const todosTimes = await req.json();

    const times = todosTimes.filter(t =>
      t.modalidade === modalidade &&
      t.categoria === categoria
    );

    if (times.length < 2) {
      area.innerHTML = `
        <div class="sim-card">
          Necessário no mínimo 2 times dessa modalidade e categoria.
        </div>
      `;
      return;
    }

    for (let i = 0; i < times.length; i += 2) {
      const t1 = times[i];
      const t2 = times[i + 1];

      if (!t2) break;

      const p1 = Math.floor(Math.random() * 6);
      const p2 = Math.floor(Math.random() * 6);

      let vencedor = "Empate";

      if (p1 > p2) vencedor = t1.nome;
      if (p2 > p1) vencedor = t2.nome;

      area.innerHTML += `
        <div class="sim-card">
          <strong>${t1.nome} ${p1} x ${p2} ${t2.nome}</strong>

          <br>

          <span>Modalidade: ${modalidade}</span>

          <br>

          <span>Categoria: ${categoria}</span>

          <br><br>

          <b>
            ${
              vencedor === "Empate"
              ? "Partida empatada"
              : "Vencedor: " + vencedor
            }
          </b>
        </div>
      `;
    }

  } catch (e) {
    console.log(e);
    toast("Erro ao simular evento");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarStatsUsuarios();
  carregarTimes();
});