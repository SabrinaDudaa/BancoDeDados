document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pessoas');

    if (!response.ok) {
      throw new Error(`Erro na resposta da API: ${response.status}`);
    }

    const pessoas = await response.json();
    const listaContainer = document.querySelector('#listaPessoas');

    if (!Array.isArray(pessoas)) {
      throw new Error('A resposta da API não é uma lista de pessoas.');
    }

    pessoas.forEach(pessoa => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('pessoa-wrapper');

      const card = document.createElement('div');
      card.classList.add('pessoa-card');

      const cabecalho = document.createElement('div');
      cabecalho.classList.add('cabecalho');
      cabecalho.innerHTML = `
        <span class="nome">${pessoa.nomepessoa}</span>
        <span class="seta">▼</span>
      `;

      const basicInfo = document.createElement('div');
      basicInfo.classList.add('pessoaBasicInfo');
      basicInfo.innerHTML = `
        <span class="cpf">CPF: <span>${pessoa.cpf}</span></span>
        <span class="idade">Idade: <span>${pessoa.idade}</span></span>
        <span class="email">Email: <span>${pessoa.email}</span></span>
      `;

      const detalhes = document.createElement('div');
detalhes.classList.add('pessoa-detalhes');
detalhes.innerHTML = `
  <span class="item">CEP: ${pessoa.cep || '---'}</span>
  <span class="item">Rua: ${pessoa.rua || '---'}</span>
  <span class="item">Bairro: ${pessoa.bairro || '---'}</span>
  <span class="item">Cidade: ${pessoa.cidade || '---'}</span>
  <span class="item">UF: ${pessoa.uf || '---'}</span>
  <span class="item">Telefone 1: ${pessoa.telefone1 || '---'}</span>
  <span class="item">Telefone 2: ${pessoa.telefone2 || '---'}</span>
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
    console.error('Erro ao buscar pessoas:', error);
  }
});
