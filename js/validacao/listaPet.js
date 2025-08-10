document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Busca pets disponíveis (sem adoção ativa)
    const responseDisponiveis = await fetch('http://localhost:3000/api/pets-disponiveis');
    if (!responseDisponiveis.ok) throw new Error(`Erro na resposta pets disponíveis: ${responseDisponiveis.status}`);
    const petsDisponiveis = await responseDisponiveis.json();

    // Busca pets adotados (adoção ativa)
    const responseAdotados = await fetch('http://localhost:3000/api/pets-adotados-ativos');
    if (!responseAdotados.ok) throw new Error(`Erro na resposta pets adotados: ${responseAdotados.status}`);
    const petsAdotados = await responseAdotados.json();

    // Containers no HTML
    const containerDisponiveis = document.querySelector('#listaPetsDisponiveis');
    const containerAdotados = document.querySelector('#listaPetsAdotados');

    // Função para criar cards de pets
    function criarCardPet(pet) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('pet-wrapper');

      const card = document.createElement('div');
      card.classList.add('pet-card');

      const cabecalho = document.createElement('div');
      cabecalho.classList.add('cabecalho');
      cabecalho.innerHTML = `
        <span class="nome">${pet.nomepet || '---'}</span>
        <span class="seta">▼</span>
      `;

      const basicInfo = document.createElement('div');
      basicInfo.classList.add('petBasicInfo');
      basicInfo.innerHTML = `
        <span class="especie">Espécie: <span>${pet.especie || '---'}</span></span>
        <span class="raca">Raça: <span>${pet.raca || '---'}</span></span>
        <span class="idade">Idade: <span>${pet.idade || '---'}</span></span>
      `;

      const detalhes = document.createElement('div');
      detalhes.classList.add('pet-detalhes');
      detalhes.innerHTML = `
        <span class="item">Chegada: ${pet.chegada || '---'}</span>
      `.replace(/\n/g, '').replace(/\s{2,}/g, '');

      detalhes.style.display = 'none';

      card.addEventListener('click', () => {
        const isVisible = detalhes.style.display === 'block';
        detalhes.style.display = isVisible ? 'none' : 'block';
        cabecalho.querySelector('.seta').textContent = isVisible ? '▼' : '▲';
      });

      card.appendChild(cabecalho);
      card.appendChild(basicInfo);
      wrapper.appendChild(card);
      wrapper.appendChild(detalhes);

      return wrapper;
    }

    // Preencher pets disponíveis
    petsDisponiveis.forEach(pet => {
      containerDisponiveis.appendChild(criarCardPet(pet));
    });

    // Preencher pets adotados
    petsAdotados.forEach(pet => {
      containerAdotados.appendChild(criarCardPet(pet));
    });

  } catch (error) {
    console.error('Erro ao buscar pets:', error);
  }
});
