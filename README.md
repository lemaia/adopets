# adopets

1 - É necessário criar um arquivo .env baseado no .env.example;

2 - O acesso a API é feito através da URL: http://fbb1ee300f43.ngrok.io;

Os end-points para Usuário são os seguintes:

- post('/signup') - Criação de usuário;

- post('/signin') - Login de usuário;

- post('/logout') - Logout de usuário;


Os end-points para Produtos são os seguintes:

- post('/products') - Criação de produto;

- put('/products') - Edição de produto;

- delete('/products') - Exclusão de produto;

- get('/products') - Listagem de produto;

Os paramêtros para paginação de produdos e filtros são os seguinte:

- Paginação: page & limit

- Filtragem: name, description e category
