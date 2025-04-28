const locacoes = JSON.parse(localStorage.getItem('locacoes') || '[]');
const tableBody = document.querySelector('#locacoesTable tbody');
let locacaoId = 1;

fetch('../assets/dados.json')
    .then(resp => resp.json())
    .then(carros => {
        locacoes.forEach((locacao, index) => {
            const row = document.createElement('tr');
            const carro = carros.find(c => c.id === locacao.carroId);

            let cpfFormatado = locacao.cpf.replace(/\D/g, '');
            if (cpfFormatado.length === 11) {
                cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }

            row.innerHTML = `
        <td>${locacaoId++}</td>
        <td>${carro ? carro.modelo : ''}</td>
        <td>${carro ? carro.marca : ''}</td>
        <td>${locacao.nome}</td>
        <td>${cpfFormatado}</td>
        <td>${new Date(locacao.dataInicio).toLocaleDateString()}</td>
        <td id="entrega-${index}"> ${locacao.dataFim ? new Date(locacao.dataFim).toLocaleDateString() : '<button onclick="devolver('+index+')">Devolver</button>'}</td>
        <td>${locacao.dataPrevista != undefined ? new Date(locacao.dataPrevista).toLocaleDateString('pt-BR') : '<button onclick="devolver('+index+')">Entregar</button>'}</td>
        <td><button onclick="excluirLocacao(${index})">Excluir</button></td>
      `;

            tableBody.appendChild(row);
        });
    });

    function devolver(index) {
        const locacoes = JSON.parse(localStorage.getItem('locacoes') || '[]');
        locacoes[index].status = 'devolvido';
        locacoes[index].dataPrevista = new Date();
        localStorage.setItem('locacoes', JSON.stringify(locacoes));
        window.location.reload();
    }
    
    

function excluirLocacao(index) {
    const locacoes = JSON.parse(localStorage.getItem('locacoes') || '[]');
    locacoes.splice(index, 1);
    localStorage.setItem('locacoes', JSON.stringify(locacoes));
    location.reload();
}
