document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cep');
  const cidadeInput = document.getElementById('cidade');
  const ufInput = document.getElementById('uf');

  if (!cepInput) {
    console.error('Campo #cep não encontrado.');
    return;
  }

  cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, '');

    if (!/^[0-9]{8}$/.test(cep)) {
      alert('CEP inválido. Use 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado.');
        cidadeInput.value = '';
        ufInput.value = '';
        return;
      }

      cidadeInput.value = data.localidade;
      ufInput.value = data.uf;
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      alert('Erro ao consultar o CEP.');
    }
  });
});
