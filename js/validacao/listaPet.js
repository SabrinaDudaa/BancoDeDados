document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pet');

    if (!response.ok) {
      throw new Error(`Erro na resposta da API: ${response.status}`);
    }

    const pets = await response.json();
    const listaContainer = document.querySelector('#listaPets');

    if (!Array.isArray(pets)) {
      throw new Error('A resposta da API não é uma lista de pets.');
    }

    pets.forEach(pet => {
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

      // Inicialmente escondido
      detalhes.style.display = 'none';

      // Toggle visibilidade
      card.addEventListener('click', () => {
        const isVisible = detalhes.style.display === 'block';
        detalhes.style.display = isVisible ? 'none' : 'block';
        cabecalho.querySelector('.seta').textContent = isVisible ? '▼' : '▲';
      });

      card.appendChild(cabecalho);
      card.appendChild(basicInfo);
      wrapper.appendChild(card);
      wrapper.appendChild(detalhes);
      listaContainer.appendChild(wrapper);
    });

  } catch (error) {
    console.error('Erro ao buscar animal:', error);
  }
});
