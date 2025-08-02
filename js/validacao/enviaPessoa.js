document.getElementById('formPessoa').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

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
    telefone2: form.telefone2.value
  };

  // ✅ Log para depurar
  console.log('Dados enviados:', data);

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
    } else {
      const error = await response.json();
      alert('Erro ao cadastrar pessoa: ' + (error.error || 'Erro desconhecido'));
    }
  } catch (err) {
    console.error('Erro:', err);
    alert('Erro de conexão com o servidor.');
  }
});
