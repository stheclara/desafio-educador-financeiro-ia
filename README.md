# Finora

### Educador Financeiro Inteligente

Aplicação web de planejamento financeiro que utiliza **Inteligência Artificial Generativa** para transformar informações pessoais e dados financeiros em análises, orientações e conversas personalizadas.

<br>

**React • TypeScript • Vite • Tailwind CSS • Google Gemini**

---

## Sobre o projeto

A **Finora** é uma aplicação de planejamento financeiro pessoal criada para ajudar o usuário a compreender melhor sua situação financeira e visualizar caminhos para alcançar seus objetivos.

A experiência começa com uma simulação em etapas, na qual o usuário informa dados sobre seu perfil e sua situação financeira:

- profissão;
- hobbies;
- renda mensal;
- gastos mensais;
- reserva atual;
- objetivo financeiro;
- valor da meta.

A profissão e os hobbies ajudam a fornecer contexto adicional para a Inteligência Artificial, permitindo que as orientações sejam mais personalizadas quando essas informações forem relevantes.

A partir desses dados, a aplicação utiliza **Inteligência Artificial Generativa** para produzir uma análise financeira personalizada.

Após receber a análise, o usuário pode conversar imediatamente com a **Finora** na própria página de resultado, fazendo novas perguntas sobre sua situação e seu planejamento financeiro.

As simulações, análises e conversas ficam armazenadas no histórico e podem ser consultadas posteriormente. Ao acessar os detalhes de uma simulação, o usuário encontra novamente a análise e todo o histórico da conversa.

O projeto foi desenvolvido como parte de um desafio prático da **Digital Innovation One (DIO)**, utilizando o projeto **Planej.ai** como base técnica e referência.

---

## Acesse o projeto

A aplicação está publicada na Vercel:

**Finora:**  
https://finora-financas.vercel.app

> A geração das análises e respostas utiliza a API do Google Gemini e pode estar sujeita à disponibilidade do serviço.

---

## Funcionalidades

- Formulário dividido em etapas
- Coleta de profissão e hobbies
- Coleta de informações financeiras
- Acompanhamento do progresso da simulação
- Campos monetários formatados
- Análise financeira utilizando IA Generativa
- Recomendações personalizadas
- Uso do perfil do usuário como contexto adicional para a IA
- Chat com a Finora diretamente na página de resultado
- Conversa contextual sobre a simulação
- Manutenção do contexto durante a conversa
- Histórico de simulações
- Visualização dos detalhes de cada simulação
- Recuperação do histórico da conversa
- Exclusão de simulações do histórico
- Persistência das simulações e conversas no navegador
- Feedback visual durante análises e respostas da IA
- Tratamento de erros
- Tema claro e escuro
- Layout responsivo para desktop e mobile

---

# Demonstração

## Nova simulação

A Finora conduz o usuário por um formulário em etapas para coletar informações pessoais e financeiras necessárias para gerar uma análise personalizada.

O fluxo inclui:

```text
Profissão
    ↓
Hobbies
    ↓
Renda mensal
    ↓
Gastos mensais
    ↓
Reserva atual
    ↓
Objetivo financeiro
    ↓
Valor da meta
```

### ☀️ Tema claro

![Finora em tema claro](./docs/screenshots/inicio-claro.png)

### 🌙 Tema escuro

![Finora em tema escuro](./docs/screenshots/inicio-escuro.png)

<br>

## Resultado da simulação

Após concluir o formulário, as informações fornecidas pelo usuário são organizadas e utilizadas como contexto para a geração da análise financeira.

A página de resultado apresenta os dados da simulação, a análise produzida pela Finora e, logo abaixo, o espaço para continuar conversando com a Inteligência Artificial.

![Resultado da simulação](./docs/screenshots/resultado.png)

<br>

## Converse com a Finora

Depois que a análise inicial é gerada, o usuário pode continuar a conversa com a Finora sem precisar acessar outra página.

O chat aparece diretamente abaixo da análise financeira.

A Finora utiliza como contexto:

- profissão;
- hobbies;
- dados financeiros;
- objetivo financeiro;
- análise inicial;
- histórico da conversa;
- nova pergunta realizada pelo usuário.

Dessa forma, o usuário pode tirar dúvidas e explorar diferentes possibilidades relacionadas ao planejamento apresentado.

![Conversa com a Finora](./docs/screenshots/chat.png)

<br>

## Histórico de simulações

As simulações realizadas ficam disponíveis no histórico.

Cada registro apresenta informações importantes como **objetivo financeiro, custo da meta, prazo estimado e economia mensal**.

O usuário também pode excluir uma simulação ou acessar seus detalhes.

![Histórico de simulações](./docs/screenshots/historico.png)

<br>

## Detalhes da simulação

Ao selecionar histórico e depois **Ver detalhes**, o usuário pode acessar novamente a simulação escolhida, consultar sua análise e visualizar o histórico da conversa realizada com a Finora.

Também é possível continuar a conversa a partir dessa página.

![Detalhes da simulação](./docs/screenshots/detalhes.png)

<br>

## Experiência mobile

A aplicação também possui layout responsivo para dispositivos móveis.

<div align="center">

<img
  src="./docs/screenshots/chat-mobile.png"
  alt="Conversa com a Finora em dispositivo móvel"
  width="360"
/>

</div>

---

## Inteligência Artificial

A Finora utiliza a **API do Google Gemini** para gerar orientações financeiras personalizadas a partir das informações fornecidas pelo usuário.

A integração possui dois fluxos principais.

### Análise inicial

Depois que a simulação é concluída:

```text
Perfil do usuário
(profissão + hobbies)
        +
Dados financeiros
        ↓
Construção do prompt
        ↓
Google Gemini
        ↓
Análise personalizada
        ↓
Resultado da simulação
```

A análise pode considerar informações como:

- profissão e contexto pessoal informado;
- hobbies, quando forem relevantes para a orientação;
- relação entre renda e gastos;
- capacidade mensal de economia;
- reserva financeira atual;
- objetivo informado;
- valor necessário para atingir a meta;
- possíveis pontos de atenção;
- sugestões de organização;
- próximos passos.

A profissão e os hobbies são utilizados apenas como contexto adicional. A Finora é orientada a não presumir salário, estabilidade profissional, rotina ou gastos apenas com base nessas informações.

Os hobbies também não são tratados automaticamente como gastos desnecessários.

### Conversa contextual

Após receber a análise inicial, o usuário pode continuar fazendo perguntas sobre aquela simulação diretamente na página de resultado.

O contexto enviado para a IA considera:

```text
Perfil do usuário
        +
Dados da simulação
        +
Análise financeira
        +
Histórico da conversa
        +
Nova pergunta
        ↓
Google Gemini
        ↓
Resposta contextualizada
```

Dessa forma, cada pergunta não é tratada como uma interação completamente isolada.

A Finora consegue utilizar as informações da simulação e as mensagens anteriores para manter uma conversa mais coerente com o planejamento do usuário.

---

## Experiência de conversa

O chat da Finora permite que o usuário continue explorando seu planejamento financeiro imediatamente após receber a análise inicial.

Entre os recursos implementados estão:

- chat diretamente na página de resultado;
- múltiplas perguntas por simulação;
- histórico de perguntas e respostas;
- contexto financeiro da simulação;
- contexto de profissão e hobbies;
- uso da análise inicial como contexto;
- persistência da conversa;
- recuperação da conversa nos detalhes da simulação;
- feedback enquanto a IA está respondendo;
- tratamento de erros;
- envio com `Enter`;
- quebra de linha com `Shift + Enter`;
- rolagem automática para novas mensagens;
- respostas formatadas em Markdown.

---

## Persistência dos dados

Atualmente, a Finora utiliza a **Web Storage API (`localStorage`)** para armazenar as informações no navegador.

Cada simulação pode conter:

```text
Simulação
│
├── ID
├── Data de criação
├── Profissão
├── Hobbies
├── Renda mensal
├── Gastos mensais
├── Reserva atual
├── Objetivo financeiro
├── Valor da meta
├── Análise da IA
│
└── Histórico da conversa
    ├── Perguntas do usuário
    └── Respostas da Finora
```

Isso permite que o usuário atualize a página ou volte posteriormente e continue acessando suas simulações e conversas no mesmo navegador.

Simulações criadas antes da inclusão dos campos de profissão e hobbies continuam podendo ser acessadas, mesmo sem essas informações.

---

## Tecnologias utilizadas

### Front-end

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Inteligência Artificial

- Google Gemini API

### Interface e conteúdo

- Lucide React
- React Markdown
- remark-gfm

### Persistência

- Web Storage API (`localStorage`)

### Desenvolvimento

- pnpm
- ESLint
- Git
- GitHub

---

## Estrutura do projeto

```text
src/
│
├── components/
│
├── pages/
│   ├── SimulationFormPage.tsx
│   ├── SimulationResultPage.tsx
│   ├── SimulationHistoryPage.tsx
│   └── SimulationHistoryDetailsPage.tsx
│
├── services/
│   └── ai/
│       ├── buildFinancialPrompt.ts
│       ├── buildChatPrompt.ts
│       └── gemini.ts
│
├── types/
│   └── Simulation.ts
│
└── router.tsx
```

A lógica relacionada à Inteligência Artificial foi separada da interface, mantendo a construção dos prompts e a comunicação com o Gemini dentro da camada `services/ai`.

---

## Como executar

### Pré-requisitos

Antes de começar, tenha instalado:

- Node.js
- pnpm
- Git

Também será necessária uma chave da API do Google Gemini.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/stheclara/desafio-educador-financeiro-ia.git
```

Acesse a pasta:

```bash
cd desafio-educador-financeiro-ia
```

Instale as dependências:

```bash
pnpm install
```

Crie um arquivo `.env` na raiz do projeto seguindo o `.env.example`:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

---

## Variáveis de ambiente

A chave da API não deve ser enviada para o repositório.

Utilize o arquivo `.env.example` como referência:

```env
VITE_GEMINI_API_KEY=
```

> **Importante:** o arquivo `.env` deve permanecer no `.gitignore`.

Em uma aplicação de produção, a comunicação com serviços que dependem de credenciais privadas deve ser intermediada por um backend ou serviço apropriado.

---

## Validação

O projeto pode ser validado utilizando:

```bash
pnpm lint
```

e:

```bash
pnpm build
```

Durante o desenvolvimento, também foram realizados testes manuais dos principais fluxos da aplicação em diferentes tamanhos de tela.

---

### Histórico de Simulações

Foi implementado um histórico para permitir que o usuário:

- visualize suas simulações anteriores;
- consulte informações resumidas;
- exclua uma simulação;
- acesse os detalhes de uma simulação específica;
- recupere a análise anteriormente gerada;
- visualize as conversas realizadas com a Finora;
- continue uma conversa anteriormente iniciada.

### Conversando com o Educador Financeiro

A experiência foi expandida para permitir que o usuário continue conversando com a Finora imediatamente depois da análise inicial.

Foram implementados:

- campo para novas perguntas;
- respostas geradas por IA;
- contexto do perfil do usuário;
- contexto financeiro da simulação;
- análise inicial como parte do contexto;
- histórico da conversa;
- persistência no `localStorage`;
- feedback de carregamento;
- tratamento de erros;
- múltiplas perguntas dentro da mesma simulação;
- acesso à mesma conversa pela página de detalhes.

---

## Possíveis evoluções

Algumas melhorias que podem ser implementadas futuramente:

- autenticação de usuários;
- backend próprio;
- banco de dados;
- sincronização entre dispositivos;
- gráficos financeiros;
- comparação entre diferentes cenários;
- edição de simulações;
- exportação de relatórios;
- testes automatizados;
- melhorias adicionais de acessibilidade.

---

## Sobre o desafio

Projeto desenvolvido como parte de um desafio prático da **Digital Innovation One (DIO)**.

A solução utiliza o **Planej.ai** como base técnica e referência e expande a experiência com perfil personalizado, histórico de simulações, recuperação de análises e interação contextual com Inteligência Artificial.

---

<div align="center">

## Finora

**Planeje. Entenda. Evolua.**

Desenvolvido por **Sthefanie**

</div>