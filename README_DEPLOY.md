Deploy recomendado — frontend + backend numa única app (Docker)

Resumo:
- O repositório contém um `Dockerfile` multi-stage que produz uma imagem com o backend (Express) e o frontend (Vite) compilado em `luzmoda/dist`.
- Estratégia recomendada: publicar a imagem no GitHub Container Registry (GHCR) e conectar um host (Render, Railway, Fly) ou usar o deploy direto do repositório via Render/Railway.

O que já preparei:
- Workflow GitHub Actions `.github/workflows/docker-publish.yml` que constrói a imagem e a publica em `ghcr.io/<owner>/luz-moda:latest` e com tag pelo commit SHA.

Passos para finalizar (rápido):
1. Push do código para o repositório remoto `origin` no GitHub (já existe `origin`).
2. Permitir que o `GITHUB_TOKEN` tenha permissão para publicar packages (normalmente padrão no Actions).
3. Conectar a imagem ao provedor de hospedagem (ex.: Render -> criar Web Service a partir do repositório ou usar a imagem GHCR).

Render (opção simples):
1. Criar conta em https://render.com
2. New -> Web Service -> Connect GitHub -> selecionar repo -> Environment: Docker -> Branch: `main` -> Deploy

Railway (opção alternativa):
1. Criar conta em https://railway.app
2. New Project -> Deploy from GitHub -> selecionar repo -> definir `start` script (o `start` em `luzmoda-backend` está configurado) -> adicionar variáveis de ambiente (DATABASE_URL etc.)

Observações:
- A `postinstall` em `luzmoda-backend/package.json` já instala e builda o frontend, então o servidor servirá os arquivos estáticos.
- Se preferir separar frontend e usar Vercel/Netlify para frontend e Railway/Render para backend, eu posso configurar os ajustes necessários.

Quer que eu:
- 1) crie e abra um PR com estas alterações e instruções, ou
- 2) siga e configure automaticamente um dos provedores (preciso de credenciais/token), ou
- 3) apenas finalize o README com instruções adicionais?
