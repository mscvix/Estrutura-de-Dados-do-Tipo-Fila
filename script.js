class Fila {
    constructor(limite = 5) {
        this.itens = [];
        this.limite = limite;
    }
    
enqueue(item) {
        if (this.itens.length >= this.limite) {
            return false; // fila cheia
        }
        this.itens.push(item);
        return true;
    }

    dequeue() {
        if (this.itens.length === 0) return null;
        return this.itens.shift();
    }

    listar() {
        return this.itens;
    }

    tamanho() {
        return this.itens.length;
    }
}

const fila = new Fila(5);
const historico = [];
async function buscarUsuario() {
    try {
        const res = await fetch("https://randomuser.me/api/");
        const data = await res.json();
        return data.results[0];
    } catch (erro) {
        alert("Erro ao buscar dados da API");
        return null;
    }
}
async function gerarPacote() {

    const user = await buscarUsuario();
    if (!user) return;

    const prioridade = Math.random() < 0.3 ? "Alta" : "Normal";

    const pacote = {
        nome: `${user.name.first} ${user.name.last}`,
        cidade: user.location.city,
        pais: user.location.country,
        foto: user.picture.medium,
        prioridade: prioridade,
        criadoEm: new Date().toLocaleTimeString()
    };

    if (fila.tamanho() >= fila.limite) {
        alert("⚠️ Fila cheia!");
        return;
    }

    if (prioridade === "Alta") {
        fila.itens.unshift(pacote);
    } else {
        fila.enqueue(pacote);
    }

    atualizarFila();
}
function animarEntrega() {
    const div = document.getElementById("entrega");

    div.innerHTML = `
        <div class="entregador">🚚</div>
        <p>Entregando pacote...</p>
    `;
}
function entregar() {

    if (fila.tamanho() === 0) {
        alert("Fila vazia!");
        return;
    }

    animarEntrega();

    const tempoEntrega = Math.floor(Math.random() * 2000) + 1000;

    setTimeout(() => {

        const pacote = fila.dequeue();

        document.getElementById("entrega").innerHTML = `
            <div class="card destaque">
                <img src="${pacote.foto}">
                <p><strong>${pacote.nome}</strong></p>
                <p>${pacote.cidade} - ${pacote.pais}</p>
                <p>⏱ Criado: ${pacote.criadoEm}</p>
                <p>🔥 Prioridade: ${pacote.prioridade}</p>
            </div>
        `;

        historico.push({
            ...pacote,
            entregueEm: new Date().toLocaleTimeString()
        });

        atualizarHistorico();
        atualizarFila();

    }, tempoEntrega);
}
function atualizarFila() {

    const div = document.getElementById("fila");
    div.innerHTML = "";

    fila.listar().forEach((p, i) => {

        const cor = p.prioridade === "Alta" ? "#ffe5e5" : "white";

        div.innerHTML += `
            <div class="card" style="background:${cor}">
                <p><strong>#${i + 1}</strong></p>
                <img src="${p.foto}">
                <p>${p.nome}</p>
                <p>${p.cidade}</p>
                <p>🔥 ${p.prioridade}</p>
            </div>
        `;
    });

    div.innerHTML += `<p><strong>Total na fila: ${fila.tamanho()}</strong></p>`;
}
function atualizarHistorico() {

    const div = document.getElementById("historico");
    div.innerHTML = "";

    historico.forEach((p, i) => {

        div.innerHTML += `
            <div class="card">
                <p><strong>Entrega #${i + 1}</strong></p>
                <img src="${p.foto}">
                <p>${p.nome}</p>
                <p>${p.cidade} - ${p.pais}</p>
                <p>📦 Criado: ${p.criadoEm}</p>
                <p>✅ Entregue: ${p.entregueEm}</p>
                <p>🔥 ${p.prioridade}</p>
            </div>
        `;
    });
}
function limparHistorico() {
    historico.length = 0;
    atualizarHistorico();
}