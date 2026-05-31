# Setup GitHub Secrets para Deploy Automático no Render

Para ativar o deploy automático no Render, adicione dois secrets no repositório GitHub:

## Passo 1: Acesse os Settings do Repositório
1. Vá para https://github.com/ramonluz10/luz-moda/settings/secrets/actions
2. Clique em **"New repository secret"**

## Passo 2: Adicione `RENDER_API_KEY`
- **Name:** `RENDER_API_KEY`
- **Value:** `rnd_sWuXP77067i3Tgw5PSn4QDWygnfc`
- Clique em **"Add secret"**

## Passo 3: Adicione `RENDER_SERVICE_ID`
- **Name:** `RENDER_SERVICE_ID`
- **Value:** `srv-d8e9rj57vvec73efatk0`
- Clique em **"Add secret"**

## Resultado
Após adicionar os secrets, todo push para `main` acionará automaticamente:
1. Build da imagem Docker (`.github/workflows/docker-publish.yml`)
2. Deploy no Render (`.github/workflows/render-deploy.yml`)

## Verificar Deploy
- No GitHub, vá para **Actions** para ver o status dos workflows
- No Render (https://dashboard.render.com), monitore o deploy em tempo real

## URLs Públicas
- **Frontend (GitHub Pages):** https://ramonluz10.github.io/luz-moda
- **Backend + Frontend (Render):** será exibido após o deploy completar (veja em Render dashboard)
