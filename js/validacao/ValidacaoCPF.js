document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.querySelector('input[name="cpf"]');
  const formCadastro = document.querySelector('form'); // Assumindo que há um formulário de cadastro

  if (!cpfInput || !formCadastro) return;

  cpfInput.addEventListener('blur', async () => {
    const cpf = cpfInput.value.replace(/\D/g, '');

    if (!validarCPF(cpf)) {
      alert('CPF inválido.');
      cpfInput.focus();
      cpfInput.select();
      return;
    }

    // Verifica se CPF já existe no banco
    const cpfExiste = await verificarCPFExistente(cpf);
    if (cpfExiste) {
      alert('Este CPF já está cadastrado no sistema.');
      cpfInput.focus();
      cpfInput.select();
    }
  });

  // Adiciona validação no submit do formulário
  formCadastro.addEventListener('submit', async (e) => {
    const cpf = cpfInput.value.replace(/\D/g, '');

    if (!validarCPF(cpf)) {
      e.preventDefault();
      alert('CPF inválido.');
      cpfInput.focus();
      cpfInput.select();
      return;
    }

    const cpfExiste = await verificarCPFExistente(cpf);
    if (cpfExiste) {
      e.preventDefault();
      alert('Este CPF já está cadastrado no sistema.');
      cpfInput.focus();
      cpfInput.select();
    }
  });

  // Função para validar formato do CPF (mantida da sua versão original)
  function validarCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let digito1 = 11 - (soma % 11);
    if (digito1 >= 10) digito1 = 0;
    if (digito1 != parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    let digito2 = 11 - (soma % 11);
    if (digito2 >= 10) digito2 = 0;

    return digito2 == parseInt(cpf.charAt(10));
  }

  // Função para verificar se CPF já existe no banco
  async function verificarCPFExistente(cpf) {
    try {
      const response = await fetch(`/api/verificar-cpf?cpf=${cpf}`);
      
      if (!response.ok) {
        throw new Error('Erro ao verificar CPF');
      }
      
      const data = await response.json();
      return data.existe;
    } catch (error) {
      console.error('Erro:', error);
      // Em caso de erro na verificação, assumimos que o CPF existe para evitar duplicatas
      return true;
    }
  }
});