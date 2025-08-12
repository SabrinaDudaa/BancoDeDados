document.addEventListener("DOMContentLoaded", async () => {
  // Função para buscar dados da API
  async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
  }

  // ---------- PESSOAS ----------
  const tiposPessoas = await fetchData("/api/tipos-pessoas");

  const pessoasData = {
    labels: [
      "Nenhum cargo",
      "Voluntário",
      "Adotante",
      "Doador",
      "Voluntário + Adotante",
      "Voluntário + Doador",
      "Doador + Adotante",
      "Voluntário + Adotante + Doador"
    ],
    datasets: [{
      data: [
        tiposPessoas.nenhum,
        tiposPessoas.voluntario,
        tiposPessoas.adotante,
        tiposPessoas.doador,
        tiposPessoas.voluntario_adotante,
        tiposPessoas.voluntario_doador,
        tiposPessoas.doador_adotante,
        tiposPessoas.voluntario_adotante_doador
      ],
      backgroundColor: [
        "#A9A9A9", // cinza
        "#D8BFD8", // roxo claro
        "#FFD580", // laranja claro
        "#FF9999", // vermelho claro
        "#ADD8E6", // azul claro
        "#00FFFF", // ciano
        "#A0522D", // marrom
        "#FFB6C1"  // rosa
      ]
    }]
  };

  const ctxPessoas = document.getElementById("graficoPessoas").getContext("2d");
  new Chart(ctxPessoas, {
    type: "pie",
    data: pessoasData
  });

   // ---------------- Gráfico de Pets ----------------
    try {
        const resPets = await fetch('/api/pets-por-tipo');
        const dataPets = await resPets.json();

        // transforma dados em arrays para o Chart.js
        const labelsPets = dataPets.map(item => item.especie);
        const valoresPets = dataPets.map(item => parseInt(item.quantidade));

        const ctxPets = document.getElementById('graficoPets').getContext('2d');
        new Chart(ctxPets, {
            type: 'pie',
            data: {
                labels: labelsPets,
                datasets: [{
                    label: 'Pets cadastrados',
                    data: valoresPets,
                    backgroundColor: ['#FFD700', '#1E90FF', '#FF6347', '#32CD32']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    } catch (err) {
        console.error('Erro ao carregar gráfico de pets:', err);
    }
});
