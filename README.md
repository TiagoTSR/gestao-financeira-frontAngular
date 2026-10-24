# 💼 Gestão Financeira (Frontend Angular)

[![Angular 21](https://img.shields.io/badge/Angular-21-DD0031.svg)](https://angular.dev/)
[![PrimeNG 21](https://img.shields.io/badge/PrimeNG-21-blue.svg)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Interface web moderna, responsiva e de alta performance desenvolvida em **Angular 21** e **PrimeNG 21** para gerenciamento financeiro completo, consumo de APIs RESTful, relatórios analíticos e controle patrimonial.

---

## 🌐 Ecossistema do Projeto

Esta aplicação consome a API backend construída em **Arquitetura Hexagonal**:

- **Backend API (Spring Boot):** [gestao-financeira-api-Hexagonnal-J25](https://github.com/TiagoTSR/gestao-financeira-api-Hexagonnal-J25)
  - Desenvolvido em **Java 25**, **Spring Boot 4**, **PostgreSQL**, mensageria com **RabbitMQ**, segurança JWT e motores de relatórios nativos em PDF e Excel.
- **Ambientes em Produção:**
  - **Interface Web (Vercel):** `https://gestao-financeira-front-angular.vercel.app`
  - **API REST (Railway):** `https://gestao-financeira-api-hexagonnal-j25-production.up.railway.app`

---

## 📌 Sumário
- [Destaques Técnicos](#-destaques-técnicos)
- [Funcionalidades da Aplicação](#-funcionalidades-da-aplicação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Segurança & Interceptor JWT](#-segurança--interceptor-jwt)
- [Configuração de Ambientes](#-configuração-de-ambientes)
- [Como Executar Localmente](#-como-executar-localmente)
- [Compilação e Deploy](#-compilação-e-deploy)
- [Autor](#-autor)

---

## ⚡ Destaques Técnicos

| Recurso | Detalhes |
|---|---|
| **Arquitetura Reativa** | Uso de **Angular Signals** (`signal`, `computed`) para gerenciamento de estado previsível e granular |
| **Standalone Components** | Componentes independentes sem sobrecarga de `NgModules` |
| **Control Flow Moderno** | Diretivas nativas de fluxo `@if`, `@for`, `@else` do Angular 21 |
| **Design System PrimeNG** | Biblioteca de componentes UI PrimeNG 21 + PrimeFlex + PrimeIcons |
| **Multi-Environment** | Alternância automática de endpoints entre desenvolvimento e produção via `angular.json` |

---

## 🚀 Funcionalidades da Aplicação

### 🔐 1. Autenticação & Cadastro
- **Login com Credenciais**: Entrada com e-mail/usuário e senha.
- **Alternância de Visibilidade da Senha**: Botão intuitivo com ícones dinâmicos (`pi-eye` / `pi-eye-slash`) para visualizar ou ocultar os caracteres digitados.
- **Criação de Conta**: Formulário com validações em tempo real de tamanho mínimo e formato de e-mail.
- **Sessão Persistente**: Armazenamento seguro de tokens com interceptor automático em requisições protegidas.

### 📊 2. Dashboard Financeiro
- Indicadores visuais de saldo atual, total de receitas e total de despesas.
- Gráficos analíticos de distribuição por categorias e evolução temporal.

### 💳 3. Lançamentos Financeiros
- Controle de **Receitas** e **Despesas**.
- Suporte a parcelamentos (`1/3`, `2/3`, etc.).
- Badges visuais coloridas de status financeiro (`PAGO`, `RECEBIDO`, `PENDENTE`, `CANCELADO`).
- Filtros por período, categoria, pessoa e tipo de operação.

### 👥 4. Gestão de Pessoas
- Cadastro completo de credores, favorecidos e clientes.
- Ativação e desativação de contatos.

### 📑 5. Central de Relatórios
- Exportação instantânea de relatórios analíticos por período em dois formatos:
  - **Relatório PDF**: Layout executivo com KPIs, cabeçalho corporativo e listagem zebrada.
  - **Planilha Excel (.xlsx)**: Planilha pronta para conciliação bancária e contábil.

---

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                        # Núcleo da aplicação
│   │   ├── guards/                  # AuthGuard para proteção de rotas
│   │   ├── interceptors/            # AuthInterceptor (injeção do token JWT)
│   │   └── services/                # Serviços HTTP (Auth, Lançamentos, Pessoas, etc.)
│   ├── dashboard/                   # Módulo de Dashboard com métricas financeiras
│   ├── lancamentos/                 # Telas e tabelas de lançamentos
│   ├── login/                       # Tela de autenticação e registro com toggle de senha
│   ├── navbar/                      # Barra de navegação responsiva com drawer lateral
│   ├── pessoas/                     # Gestão de contatos e pessoas
│   └── relatorios/                  # Emissão de relatórios em PDF e Excel
├── environments/                    # Configurações de API por ambiente
│   ├── environment.ts               # Produção (aponta para o Railway)
│   └── environment.development.ts   # Desenvolvimento (aponta para localhost:8080)
└── public/                          # Ativos estáticos e ícones da aplicação
```

---

## 🛡️ Segurança & Interceptor JWT

Todas as chamadas HTTP para o backend são monitoradas pelo `AuthInterceptor`:
1. Verifica se o usuário possui um token JWT válido em `localStorage`.
2. Injeta automaticamente o cabeçalho:
   ```http
   Authorization: Bearer <seu_token_jwt>
   ```
3. Rotas privadas são resguardadas pelo `authGuard`, redirecionando usuários não autenticados diretamente para a tela de `/login`.

---

## ⚙️ Configuração de Ambientes

O projeto utiliza substituição de arquivos no build (`fileReplacements`) no `angular.json`:

- **Desenvolvimento (`environment.development.ts`):**
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080'
  };
  ```

- **Produção (`environment.ts`):**
  ```typescript
  export const environment = {
    production: true,
    apiUrl: 'https://gestao-financeira-api-hexagonnal-j25-production.up.railway.app'
  };
  ```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- **Node.js** 20+ ou 22+ (LTS)
- **NPM** instalado
- Backend da API em execução (localmente ou via Railway)

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/TiagoTSR/gestao-financeira-frontAngular.git
cd gestao-financeira-frontAngular
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm start
# ou
ng serve
```

Acesse no navegador: `http://localhost:4200`

---

## 📦 Compilação e Deploy

Para gerar o pacote otimizado de produção:
```bash
npm run build
```

Os artefatos compilados serão gerados na pasta `dist/gestao-financeira-frontAngular`.  
O repositório está configurado para **Deploy Contínuo (CI/CD)** automático na **Vercel** a cada push na branch `master`.

---

## 👨‍💻 Autor

Desenvolvido por **Tiago Silva Rufiniano**  
- **GitHub:** [@TiagoTSR](https://github.com/TiagoTSR)
- **Repositório da API Backend:** [gestao-financeira-api-Hexagonnal-J25](https://github.com/TiagoTSR/gestao-financeira-api-Hexagonnal-J25)