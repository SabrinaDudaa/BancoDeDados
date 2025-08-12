async function loadAndRenderPets() {
  try {
    const [petsDisponiveis, petsAdotados] = await Promise.all([
      fetchPets('http://localhost:3000/api/pets-disponiveis'),
      fetchPets('http://localhost:3000/api/pets-adotados-ativos')
    ]);

    renderPetList(petsDisponiveis, 'listaPetsDisponiveis');
    renderPetList(petsAdotados, 'listaPetsAdotados');
  } catch (error) {
    console.error('Falha ao carregar pets:', error);
    // Adicione aqui notificação visual para o usuário
  }
}

async function fetchPets(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  return await response.json();
}

function renderPetList(pets, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  pets.forEach(pet => {
    const petWrapper = document.createElement('div');
    petWrapper.className = 'pet-wrapper';

    const petCard = document.createElement('div');
    petCard.className = 'pet-card';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'cabecalho';
    cabecalho.innerHTML = `
      <span class="nome">${pet.nomepet || '---'}</span>
      <span class="seta">▼</span>
    `;

    const basicInfo = document.createElement('div');
    basicInfo.className = 'petBasicInfo';
    basicInfo.innerHTML = `
      <span class="especie">Espécie: <span>${pet.especie || '---'}</span></span>
      <span class="raca">Raça: <span>${pet.raca || '---'}</span></span>
      <span class="idade">Idade: <span>${pet.idade || '---'}</span></span>
    `;

    const detalhes = document.createElement('div');
    detalhes.className = 'pet-detalhes';
    detalhes.innerHTML = `<span class="item">Chegada: ${pet.chegada || '---'}</span>`;
    detalhes.style.display = 'none';

    // Evento de clique mantido como no seu original
    petCard.addEventListener('click', () => {
      const isVisible = detalhes.style.display === 'block';
      detalhes.style.display = isVisible ? 'none' : 'block';
      cabecalho.querySelector('.seta').textContent = isVisible ? '▼' : '▲';
    });

    // Montagem da estrutura
    petCard.appendChild(cabecalho);
    petCard.appendChild(basicInfo);
    petWrapper.appendChild(petCard);
    petWrapper.appendChild(detalhes);
    container.appendChild(petWrapper);
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', loadAndRenderPets);