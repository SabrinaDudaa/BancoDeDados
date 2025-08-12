Para o funcionamento do sistema, é preciso criar um usuário com permissão total para escrever e ler com o nome GrupoBD, e senha serverBD2025;
Além disso o banco de dados deve se chamar sistemaong.

host: 'localhost',
port: 5432,
user: 'GrupoBD',
password: 'serverBD2025', // Adicione a senha correta do seu banco
database: 'sistemaong',

Após o banco de dados ser iniciado da forma correta, execute o arquivo server.js utilizando o comando:
node server.js

O servidor irá rodar em http://localhost:3000