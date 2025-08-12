document.getElementById('formPessoa').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  // Coletar opções marcadas CORRETAMENTE
  const tiposSelecionados = Array.from(
    document.querySelectorAll('input[name="tipoPessoa[]"]:checked')
  ).map(checkbox => checkbox.value);

  console.log('Tipos selecionados:', tiposSelecionados); // Adicione este log para depuração

  const data = {
    nomePessoa: form.nomePessoa.value,
    cpf: form.cpf.value,
    idade: form.idade.value,
    email: form.email.value,
    cep: form.cep.value,
    rua: form.rua.value,
    bairro: form.bairro.value,
    cidade: form.cidade.value,
    uf: form.uf.value,
    telefone1: form.telefone1.value,
    telefone2: form.telefone2.value,
    tiposPessoa: tiposSelecionados // Enviar array de tipos
  };

  console.log('Dados enviados:', data); // Verifique se os tipos estão no objeto

  try {
    const response = await fetch('http://localhost:3000/api/pessoas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Pessoa cadastrada com sucesso!');
      form.reset();
      // Recarregar a lista se estiver na página de listagem
      if (window.location.pathname.includes('listaPessoa')) {
        document.querySelector('#listaPessoas').innerHTML = '';
        // Disparar o evento de carregamento novamente
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }
    } else {
      const error = await response.json();
      alert('Erro ao cadastrar pessoa: ' + (error.error || 'Erro desconhecido'));
    }
  } catch (err) {
    console.error('Erro:', err);
    alert('Erro de conexão com o servidor.');
  }
});

// Função auxiliar para recarregar a lista (opcional)
async function loadPessoas() {
  const listaContainer = document.querySelector('#listaPessoas');
  if (listaContainer) {
    // Recarregar a lista de pessoas
    document.dispatchEvent(new Event('DOMContentLoaded'));
  }
}