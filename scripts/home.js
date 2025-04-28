const cards = document.querySelector('main');
fetch('../assets/dados.json')
    .then(resp => resp.json())
    .then(resp => {
        resp.forEach(l => {
            const card = document.createElement('div');
            card.innerHTML = `
                <img src="${l.imagem}" alt="Avatar">
                <h3>${l.modelo}</h3>
                <p>${l.marca}</p>
                <p>${l.ano}</p>
                <button onclick="mostrarDetalhes(${JSON.stringify(l.id)})">Ver detalhes</button>
            `;
            cards.appendChild(card);
        });
    });

const inform = document.querySelector('#inform');
const cadas = document.querySelector('#cad');

function mostrarDetalhes(id) {
    fetch('../assets/dados.json')
        .then(resp => resp.json())
        .then(resp => {
            const inf = resp.find(item => item.id === id);
            if (inf) {
                const informacoes = document.querySelector('#inform .janela');
                informacoes.innerHTML = `
                    <div>
                        <h3>${inf.modelo} (${inf.marca})</h3>
                        <button onclick="fecharModal('inform')">X</button>
                    </div>
                    <img src="${inf.imagem}" alt="Imagem do ${inf.modelo}">
                    <p>Ano: ${inf.ano}</p>
                    <hr>
                    <p>Combustível: ${inf.combustivel}</p>
                    <hr>
                    <p>Portas: ${inf.portas}</p>
                    <hr>
                    <p>Transmissão: ${inf.transmissao}</p>
                    <hr>
                    <p>Cor: ${inf.cor}</p>
                    <h3>Valor Diário: R$ ${inf.valor_diaria.toFixed(2)}</h3>
                    <button class="btn" onclick="fecharInformacoesEAbrirCadastro(${id})">Alugar</button>
                `;
                inform.classList.remove('oculta');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);
        });
}

function fecharInformacoesEAbrirCadastro(id) {
    inform.classList.add('fade-out');

    setTimeout(() => {
        inform.classList.add('oculta');
        inform.classList.remove('fade-out');

        cadastrarCarro(id);
        cadas.classList.remove('oculta');
    }, 300);
}

function cadastrarCarro(id) {
    fetch('../assets/dados.json')
        .then(resp => resp.json())
        .then(resp => {
            const carroSelecionado = resp.find(item => item.id === id);
            if (carroSelecionado) {
                const cadastro = document.querySelector('#cad .janela');
                cadastro.innerHTML = `
                    <div>
                        <h3>Cadastro de locação</h3>
                        <button onclick="fecharModal('cad')">X</button>
                    </div>
                    <form id="formCadastro">
                        <label for="nome">Nome do cliente:</label>
                        <input type="text" name="nome" placeholder="Nome" required>

                        <label for="cpf">CPF:</label>
                        <input type="number" name="cpf" placeholder="CPF" required>

                        <label for="data-inicio">Data de início:</label>
                        <input type="date" name="data-inicio" required>

                        <label for="data-fim">Data de fim:</label>
                        <input type="date" name="data-fim" required>

                        <label for="carroSelecionado">Carro:</label>
                        <select id="carroSelecionado">
                            <option value="">Selecione um modelo</option> 
                        </select>

                        <button type="button" onclick="salvarLocacao()">Adicionar</button>

                    </form>
                `;

                const selectCarro = document.getElementById('carroSelecionado');
                resp.forEach(carro => {
                    const option = document.createElement('option');
                    option.value = carro.id;
                    option.textContent = carro.modelo;
                    selectCarro.appendChild(option);
                });

                selectCarro.value = carroSelecionado.id;

                document.getElementById('formCadastro').addEventListener('submit', function (e) {
                    e.preventDefault();

                    const locacao = {
                        nome: this.nome.value,
                        cpf: this.cpf.value,
                        dataInicio: this['data-inicio'].value,
                        dataFim: this['data-fim'].value,
                        carroId: this.carroSelecionado.value
                    };

                    let locacoes = JSON.parse(localStorage.getItem('locacoes') || '[]');
                    try {
                        locacoes = JSON.parse(localStorage.getItem('locacoes')) || [];
                    } catch (e) {
                        console.error("Erro ao ler locações:", e);
                        locacoes = [];
                    }

                    locacoes.push(novaLocacao);
                    localStorage.setItem('locacoes', JSON.stringify(locacoes));


                    alert('Locação salva com sucesso!');
                    fecharModal('cad');
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);
        });
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.add('oculta');
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); 
    if(cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  }
  

function salvarLocacao() {
    const nome = document.querySelector('input[name="nome"]').value.trim();
    const cpf = document.querySelector('input[name="cpf"]').value.trim();
    const dataInicio = document.querySelector('input[name="data-inicio"]').value;
    const dataFim = document.querySelector('input[name="data-fim"]').value;
    const carroId = document.getElementById('carroSelecionado').value;

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    if (isNaN(inicio) || isNaN(fim) || fim < inicio) {
        throw new Error("Datas inválidas ou fim antes de início");
    }

    if (!nome || !cpf || !dataInicio || !dataFim || !carroId) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const novaLocacao = {
        nome,
        cpf,
        dataInicio,
        dataFim,
        carroId
    };

    const locacoes = JSON.parse(localStorage.getItem('locacoes') || '[]');
    locacoes.push({
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        dataInicio: new Date(dataInicio).toISOString(),
        dataFim: new Date(dataFim).toISOString(),
        carroId: Number(carroId) || carroId
      });
      
      try {
        localStorage.setItem('locacoes', JSON.stringify(locacoes));
      } catch (e) {
        console.error("Falha ao salvar locações:", e);
        alert("Não foi possível salvar a locação no momento.");
      }
      

    alert("Locação salva com sucesso!");

    cad.classList.add('oculta');
    window.location.reload();
}

