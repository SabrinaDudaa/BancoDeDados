// Gráfico de Pessoas
fetch('/api/quantidade-pessoas')
    .then(res => res.json())
    .then(data => {
        const ctxPessoas = document.getElementById('graficoPessoas').getContext('2d');
        new Chart(ctxPessoas, {
            type: 'doughnut',
            data: {
                labels: ['Pessoas'],
                datasets: [{
                    label: 'Pessoas Cadastradas',
                    data: [data.quantidade],
                    backgroundColor: ['green']
                }]
            },
            options: {
                responsive: true
            }
        });
    });

// Gráfico de Pets por tipo
fetch('/api/pets-por-tipo')
    .then(res => res.json())
    .then(data => {
        const labels = data.map(row => row.especie);
        const valores = data.map(row => row.quantidade);

        const cores = labels.map(tipo => 
            tipo.toLowerCase() === 'cachorro' ? 'yellow' : 'blue'
        );

        const ctxPets = document.getElementById('graficoPets').getContext('2d');
        new Chart(ctxPets, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pets Cadastrados',
                    data: valores,
                    backgroundColor: cores
                }]
            },
            options: {
                responsive: true
            }
        });
    });
