document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pessoas');
    const pessoas = await response.json();

    const tbody = document.querySelector('#tabelaPessoas tbody');

    pessoas.forEach(pessoa => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pessoa.nomepessoa}</td>
        <td>${pessoa.cpf}</td>
        <td>${pessoa.idade}</td>
        <td>${pessoa.email}</td>
        <td>${pessoa.referencia}</td> <!-- isso é o CEP -->
        <td>${pessoa.rua}</td>
        <td>${pessoa.bairro}</td>
        <td>${pessoa.cidade}</td>
        <td>${pessoa.uf}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
  }
});
