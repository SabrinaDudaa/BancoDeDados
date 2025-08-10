console.log("enviaAdocao.js carregado");

let selecionadoAdotante = null;
let selecionadoPet = null;

document.addEventListener('DOMContentLoaded', () => {
  carregarAdotantes();
  carregarPets();

  // Filtros
  document.getElementById('searchAdotante').addEventListener('input', e => {
    filtrarTabela('tableAdotantes', e.target.value);
  });
  document.getElementById('searchPet').addEventListener('input', e => {
    filtrarTabela('tablePets', e.target.value);
  });

  // Submit do formulário
  document.getElementById('formAdocao').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selecionadoAdotante) {
      alert('Selecione um adotante.');
      return;
    }
    if (!selecionadoPet) {
      alert('Selecione um pet.');
      return;
    }

    const dataAdocao = e.target.dataAdocao.value;
    if (!dataAdocao) {
      alert('Informe a data da adoção.');
      return;
    }

    const data = {
      idAdotante: selecionadoAdotante,
      idPet: selecionadoPet,
      dataAdocao: dataAdocao
    };

    console.log('Dados enviados:', data);

    try {
      const response = await fetch('http://localhost:3000/api/adocao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Adoção cadastrada com sucesso!');
        e.target.reset();
        limparSelecao();
        location.reload();
      } else {
        const err = await response.json();
        alert('Erro ao cadastrar adoção: ' + (err.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    }
  });

  // Botão reset para limpar seleção junto com o form
  document.getElementById('formAdocao').addEventListener('reset', () => {
    limparSelecao();
  });
});

function carregarAdotantes() {
    console.log("Carregando adotantes...");
    fetch('http://localhost:3000/api/adotantes')
    .then(res => res.json())
    .then(pessoas => {
      const tbody = document.querySelector('#tableAdotantes tbody');
      tbody.innerHTML = '';
      pessoas.forEach(pessoa => {
        const tr = document.createElement('tr');
        tr.dataset.id = pessoa.idpessoa;
        tr.innerHTML = `<td>${pessoa.nomepessoa}</td><td>${pessoa.cpf}</td>`;
        tr.addEventListener('click', () => selecionarLinha(tr, 'adotante'));
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar adotantes:', err);
      alert('Erro ao carregar adotantes');
    });
}


function carregarPets() {
  fetch('http://localhost:3000/api/pets-disponiveis')
    .then(res => res.json())
    .then(pets => {
      const tbody = document.querySelector('#tablePets tbody');
      tbody.innerHTML = '';
      pets.forEach(pet => {
        const tr = document.createElement('tr');
        tr.dataset.id = pet.idpet;
        tr.innerHTML = `<td>${pet.nomepet}</td><td>${pet.especie}</td>`;
        tr.addEventListener('click', () => selecionarLinha(tr, 'pet'));
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar pets:', err);
      alert('Erro ao carregar pets');
    });
}

function selecionarLinha(tr, tipo) {
  // Limpar seleção anterior
  if (tipo === 'adotante') {
    document.querySelectorAll('#tableAdotantes tr.selected').forEach(row => {
      row.classList.remove('selected');
    });
    tr.classList.add('selected');
    selecionadoAdotante = tr.dataset.id;
  } else if (tipo === 'pet') {
    document.querySelectorAll('#tablePets tr.selected').forEach(row => {
      row.classList.remove('selected');
    });
    tr.classList.add('selected');
    selecionadoPet = tr.dataset.id;
  }
}

function limparSelecao() {
  selecionadoAdotante = null;
  selecionadoPet = null;
  document.querySelectorAll('tr.selected').forEach(row => {
    row.classList.remove('selected');
  });
}

function filtrarTabela(idTabela, textoFiltro) {
  textoFiltro = textoFiltro.toLowerCase();
  const tbody = document.querySelector(`#${idTabela} tbody`);
  tbody.querySelectorAll('tr').forEach(tr => {
    const nome = tr.cells[0].textContent.toLowerCase();
    tr.style.display = nome.includes(textoFiltro) ? '' : 'none';
  });
}
