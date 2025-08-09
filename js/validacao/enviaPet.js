console.log("enviaPet.js carregado"); // Testa se o script foi importado

document.getElementById('formPet').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;

    const data = {
        nomePet: form.nomePet.value,
        Especie: form.especiePet.value,
        Raca: form.racaPet.value,
        Chegada: form.dataChegada.value,
        Idade: form.idadePet.value,
    };

    console.log('Dados enviados:', data);

    try {
        const response = await fetch('http://localhost:3000/api/pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Corrigido
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Animal cadastrado com sucesso!');
            form.reset();
        } else {
            const error = await response.json();
            alert('Erro ao cadastrar o animal: ' + (error.error || 'Erro desconhecido'));
        }
    } catch (err) {
        console.error('Erro: ', err);
        alert('Erro de conexão com o servidor.');
    }
});
