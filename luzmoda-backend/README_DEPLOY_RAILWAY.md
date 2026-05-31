Guia rápido de deploy no Railway

Passos resumidos:

1. Commit e push do repositório no GitHub.

2. No Railway (https://railway.app) faça:
   - New Project → Deploy From GitHub → conecte sua conta e selecione o repositório.
   - Ao criar o Service, escolha "Dockerfile" (o Dockerfile está na raiz do repositório).

3. Variáveis de ambiente principais (adicionar no painel do Service):
   - `NODE_ENV=production`
   - `JWT_SECRET` (se usado)
   - credenciais de SMTP, payments, etc.

4. O `Dockerfile` constrói o `luzmoda` (frontend) e o `luzmoda-backend` e expõe a aplicação em `PORT` 3001.
   - Railway fornece uma variável `PORT`; o servidor usa `process.env.PORT || 3001`.

5. Após deploy, o Railway vai fornecer a URL pública do seu serviço. Use esta URL como domínio do site.

Observações:
- Se quiser usar banco de dados persistente, adicione um plugin PostgreSQL no Railway e ajuste o backend para usar o banco em vez dos arrays em memória (atualmente os dados estão em memória no arquivo `src/data/db.js`).
- Se preferir deploy sem Docker, crie um Web Service apontando para a subpasta `luzmoda-backend`, com `Start Command: npm start` e `Postinstall` para construir o frontend.
