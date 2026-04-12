# Design System — FORGEE Fitness Brand

> **Referência oficial do projeto FORGEE Academy.**  
> Este documento deve ser consultado em toda implementação de UI para garantir consistência visual, acessibilidade e fidelidade à identidade da marca.

---

## 1. Concept and Style

Este sistema de design é construído sobre uma tensão intencional: **força bruta encontra controle absoluto**. A identidade visual oscila entre dois estados — a intensidade crua de um atleta em movimento e a quietude disciplinada de quem já dominou o processo. O resultado é uma linguagem visual que é simultaneamente agressiva e sofisticada, energética e controlada.

A iluminação cinematográfica (rim light vermelho-laranja sobre fundos escuros) não é apenas estética — ela é a metáfora central do sistema: o ser humano emergindo da escuridão, definido pela luz que o contorna.

**Keywords:** `high-contrast` · `editorial-athletic` · `cinematic` · `raw-premium` · `dark-dominant` · `heat-driven`

---

## 2. Color System

### Primitive Colors

#### Neutrals

| Token          | HEX       | Uso                                        |
|----------------|-----------|--------------------------------------------|
| `neutral-950`  | `#0A0A0A` | Background absoluto, void total            |
| `neutral-900`  | `#111111` | Background principal (dark)                |
| `neutral-850`  | `#1A1A1A` | Superfícies primárias                      |
| `neutral-800`  | `#222222` | Cards, containers elevated                 |
| `neutral-700`  | `#2E2E2E` | Borders sutis, divisores                   |
| `neutral-400`  | `#888888` | Texto secundário, labels                   |
| `neutral-200`  | `#CCCCCC` | Texto de suporte, captions                 |
| `neutral-50`   | `#F5F5F5` | Texto principal em fundos escuros          |
| `white`        | `#FFFFFF` | Headlines primários, CTAs em dark          |

#### Reds (Core Energy)

| Token      | HEX       | Uso                                     |
|------------|-----------|-----------------------------------------|
| `red-600`  | `#CC0000` | Tom base — presença sólida              |
| `red-500`  | `#E02020` | Vermelho principal — ação, destaque     |
| `red-400`  | `#E94040` | Estados hover, glow interno             |
| `red-300`  | `#FF5050` | Rim light tone, gradiente quente        |

#### Oranges (Heat / Energy)

| Token        | HEX       | Uso                                        |
|--------------|-----------|--------------------------------------------|
| `orange-500` | `#FF4500` | Laranja intenso — energia máxima           |
| `orange-400` | `#FF6B2B` | Gradiente de calor, transições             |
| `orange-300` | `#FF8C42` | Brilho rim-light, glows fotográficos       |

#### Accent Light

| Token           | HEX       | Uso                                    |
|-----------------|-----------|----------------------------------------|
| `light-surface` | `#F0EFEB` | Fundo light alternativo (editorial)    |
| `light-text`    | `#1A1A1A` | Texto em contextos light               |

---

### Semantic Colors

| Role              | Token          | HEX       | Aplicação                                           |
|-------------------|----------------|-----------|-----------------------------------------------------|
| **Background**    | `neutral-900`  | `#111111` | Canvas padrão dark                                  |
| **Surface**       | `neutral-800`  | `#222222` | Cards, modais, painéis                              |
| **Primary**       | `red-500`      | `#E02020` | CTAs principais, destaques de heading               |
| **Primary Hover** | `red-400`      | `#E94040` | Hover e estados ativos                              |
| **Accent**        | `orange-500`   | `#FF4500` | Energy callouts, badges, rim-light UI               |
| **Text Primary**  | `white`        | `#FFFFFF` | Headings, body em dark                              |
| **Text Secondary**| `neutral-200`  | `#CCCCCC` | Labels, descrições                                  |
| **Text Muted**    | `neutral-400`  | `#888888` | Captions, metadata                                  |
| **Border Subtle** | `neutral-700`  | `#2E2E2E` | Separadores, outline de cards                       |
| **Border Active** | `red-500`      | `#E02020` | Borda de destaque, seleção                          |
| **Success**       | —              | `#4ADE80` | Confirmações, checklists                            |
| **Warning**       | `orange-400`   | `#FF6B2B` | Alertas leves                                       |
| **Error**         | `red-600`      | `#CC0000` | Erros críticos                                      |

### Lógica de uso de cor

- O **vermelho** é a cor de ação e identidade. Ele nunca decora — ele instrui.
- O **laranja-quente** existe exclusivamente como gradiente energético e efeito de iluminação. Não é usado em UI estático.
- O sistema é **dark-first**. O modo light (quando presente) usa o mesmo vocabulário em inversão: fundo branco/off-white, texto preto, vermelho como único acento.
- Cor como hierarquia: **branco > vermelho > cinza claro > cinza médio**.

---

## 3. Typography

### Estilo Geral

O sistema tipográfico é construído sobre **grotescos condensados e extended bold**, com títulos que ocupam espaço físico de forma agressiva — letras que "pesam". O contraste entre o display gigantesco e o body pequeno e denso é intencional e define a hierarquia visual do sistema.

**Família principal:** `Nimbus Sans` (Display, Headlines) + grotesco limpo para body/UI.

Dois eixos coexistem:
- **Display / Headline**: Condensed, extended width, uppercase, weight 800–900. Comunica poder e urgência.
- **Body / UI**: Clean grotesco regular, weight 400–500. Funcional, legível, sem ornamento.

### Hierarquia

| Nível          | Tamanho      | Weight          | Estilo              | Uso                                    |
|----------------|--------------|-----------------|---------------------|----------------------------------------|
| **Display XL** | 96–120px     | 900 (Black)     | Uppercase, condensed| Hero statements, capa                  |
| **H1**         | 56–72px      | 800 (ExtraBold) | Uppercase           | Títulos de seção principais            |
| **H2**         | 36–48px      | 700 (Bold)      | Uppercase ou Sentence | Subtítulos de seção                  |
| **H3**         | 24–32px      | 600–700         | Mixed case          | Títulos de card, módulos               |
| **Body Large** | 18–20px      | 400             | Normal              | Parágrafos intro, descrições           |
| **Body**       | 14–16px      | 400             | Normal              | Corpo de texto geral                   |
| **Caption / Label** | 11–13px | 500            | Uppercase, tracked  | Tags, badges, metadata                 |
| **Stat / Number** | 48–64px   | 800             | Numeric             | Métricas, contadores                   |

### Características

- **Tracking (letter-spacing):** Tight em display (−0.02em a 0), normal em body, wide em labels (0.08–0.12em uppercase)
- **Leading (line-height):** Comprimido em headlines (0.9–1.0), confortável em body (1.5–1.6)
- **Mix de casing:** Headlines são predominantemente ALL CAPS. Body usa sentence case. Jamais title case decorativo.
- **Uso de itálico:** Aparece pontualmente em contextos premium/editorial como contraste expressivo com roman bold.

---

## 4. Spacing and Layout

### Spacing Scale (base 4pt)

| Token      | Valor | Uso                                      |
|------------|-------|------------------------------------------|
| `space-1`  | 4px   | Micro gaps, ícones                       |
| `space-2`  | 8px   | Padding interno mínimo                   |
| `space-3`  | 12px  | Gaps de lista, inline elements           |
| `space-4`  | 16px  | Padding de componente padrão             |
| `space-5`  | 24px  | Seção interna, entre grupos              |
| `space-6`  | 32px  | Padding de card, espaçamento médio       |
| `space-8`  | 48px  | Separação de blocos de conteúdo          |
| `space-10` | 64px  | Margens de seção                         |
| `space-12` | 80px  | Padding de seção hero                    |
| `space-16` | 96–120px | Espaçamento entre seções maiores     |

### Layout Density

**Balanceado com momentos de tensão.** A densidade varia intencionalmente:
- **Seções Hero:** Espaçosas — o vazio é dramático e intencional
- **Cards / Grids:** Compactos, densos, sem espaço desperdiçado
- **Seções de texto:** Generosas em entrelinha, respiro entre parágrafos

### Grid System

- **Grid base:** 8pt
- **Colunas:** 12 colunas em desktop, 4 em mobile
- **Gutter:** 24–32px
- **Max-width:** 1280–1440px
- **Margens laterais:** 40–80px (desktop), 16–24px (mobile)

### Lógica de composição

Elementos frequentemente **quebram a grid** intencionalmente — texto de display que sangra para fora do container, imagens que se sobrepõem a elementos de UI, estatísticas que flutuam sobre fotografias. O sistema tem regras, mas prevê violações calculadas como recurso expressivo.

---

## 5. Shapes and UI Language

### Border Radius

| Contexto    | Valor    | Uso                                          |
|-------------|----------|----------------------------------------------|
| **Sharp**   | `0px`    | Botões primários de impacto, cards editoriais|
| **Subtle**  | `4–6px`  | Cards padrão, inputs                         |
| **Rounded** | `8–12px` | Containers secundários, modais               |
| **Pill**    | `999px`  | Tags, badges, toggle buttons                 |

O sistema prioriza **arestas retas** como expressão de força e precisão. Bordas arredondadas aparecem em contextos secundários ou mais suaves.

### Stroke / Border Usage

- **Borders visíveis:** `1px solid` em `neutral-700` — sutis, estruturantes, não decorativos
- **Borders de destaque:** `1px solid red-500` — usados em cards ativos, itens selecionados
- **Borders como acento:** Linha fina `1px` na cor primária usada como detalhe gráfico (ex: linha lateral em cards de pricing)
- **Sem borders em heroes:** Fotografia e texto convivem sem contenção

### Component Style

- **Flat com camadas:** Componentes são flat por natureza mas ganham profundidade via gradiente de fundo ou sombra sutil
- **Fotografia como componente:** Imagens não são decoração — são estrutura. Elas definem o espaço onde a tipografia vive
- **Interatividade expressa:** Hover states com mudança de cor de fundo (surface → red-500) ou adição de border

---

## 6. Visual Details

### Shadows

| Nível      | Valor CSS                            | Uso                                         |
|------------|--------------------------------------|---------------------------------------------|
| **None**   | `none`                               | Elementos sobre dark bg — desnecessário     |
| **Subtle** | `0 2px 8px rgba(0,0,0,0.4)`          | Cards em dark, elevação leve                |
| **Medium** | `0 8px 24px rgba(0,0,0,0.6)`         | Modais, dropdowns                           |
| **Glow**   | `0 0 24px rgba(226,32,32,0.4)`       | Botões CTA em hover, elementos de destaque  |

### Borders

- Majoritariamente invisíveis ou muito sutis (`neutral-700`)
- Ganham vida apenas em estados de destaque ou seleção
- Linha decorativa `2–4px` em vermelho como elemento gráfico intencional (não estrutural)

### Decorações e Efeitos

| Efeito                  | Aplicação                                                                                   |
|-------------------------|---------------------------------------------------------------------------------------------|
| **Gradiente de calor**  | `linear-gradient(to bottom, #FF4500, #CC0000, transparent)` — overlay em fotografias       |
| **Rim light simulado**  | Glow laranja-vermelho nas bordas de elementos ou como overlay de imagem                     |
| **Noise / Grain**       | Textura sutil em backgrounds escuros para evitar o aspecto sintético                        |
| **Vignette**            | Escurecimento progressivo nas bordas de fotografias para fundir com o fundo                 |
| **Text overflow**       | Tipografia de display que extravasa o container — recurso gráfico intencional               |
| **Foto com bleed**      | Fotografias sem moldura que "cortam" na borda da viewport                                   |
| **Marquee / Ticker**    | Faixas horizontais animadas com termos e categorias — elemento de movimento contínuo        |
| **Diagonal cuts**       | Divisores de seção em ângulo (clip-path diagonal) como alternativa a linhas horizontais     |

### Lógica de Atmosfera

O sistema visual cria **profundidade cinematográfica** através da fotografia. O fundo preto não é uma ausência — é um espaço dramático onde a luz (vermelho-laranja) esculpe os sujeitos. Essa lógica de iluminação deve ser refletida na UI: elementos que "emergem" do escuro, gradientes que simulam calor, e brilhos que marcam pontos de atenção.

---

## 7. Contrast and Accessibility

### Nível de Contraste

**Alto contraste** como princípio dominante. O sistema é construído para impacto visual imediato.

| Par                                   | Ratio aproximado | Status                                    |
|---------------------------------------|------------------|-------------------------------------------|
| Branco sobre `neutral-900`            | ~15:1            | ✅ AAA                                     |
| Branco sobre `red-500`                | ~4.5:1           | ✅ AA                                      |
| `neutral-200` sobre `neutral-900`     | ~8:1             | ✅ AAA                                     |
| `red-500` sobre `neutral-900`         | ~3.5:1           | ⚠️ Apenas para display/decorativo          |
| Preto sobre `light-surface`           | ~16:1            | ✅ AAA                                     |

### Abordagem de Legibilidade

- **Nunca use vermelho para texto de corpo** — apenas para headlines de destaque e elementos UI interativos
- **Texto sobre fotografia:** Sempre com overlay escuro (`rgba(0,0,0,0.5+)`) ou com shadow de texto para garantir contraste
- **Hierarquia por cor:** Branco = primário, cinza claro = secundário, cinza médio = muted. Nunca inverter.
- **Modo light:** Quando utilizado, mantém exatamente as mesmas regras de contraste — apenas inverte o canvas

### Acessibilidade de Interação

- Estados de foco visíveis: outline `2px solid #E94040` com `outline-offset: 2px`
- Targets mínimos: 44×44px para elementos interativos
- Uso de cor nunca como único indicador — sempre acompanhado de forma ou texto
- Labels de ícones obrigatórios para leitores de tela

---

## 8. CSS Variables — Tokens de Referência Rápida

```css
:root {
  /* Backgrounds */
  --bg-void:        #0A0A0A;
  --bg-base:        #111111;
  --bg-surface:     #1A1A1A;
  --bg-elevated:    #222222;
  --bg-light:       #F0EFEB;

  /* Borders */
  --border-subtle:  #2E2E2E;
  --border-active:  #E02020;

  /* Text */
  --text-primary:   #FFFFFF;
  --text-secondary: #CCCCCC;
  --text-muted:     #888888;
  --text-dark:      #1A1A1A;

  /* Brand — Reds */
  --red-600:        #CC0000;
  --red-500:        #E02020;
  --red-400:        #E94040;
  --red-300:        #FF5050;

  /* Brand — Oranges */
  --orange-500:     #FF4500;
  --orange-400:     #FF6B2B;
  --orange-300:     #FF8C42;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-8:  48px;
  --space-10: 64px;
  --space-12: 80px;
  --space-16: 120px;

  /* Radius */
  --radius-none:   0px;
  --radius-sm:     4px;
  --radius-md:     8px;
  --radius-lg:     12px;
  --radius-pill:   999px;

  /* Typography Scale */
  --text-display: clamp(72px, 10vw, 120px);
  --text-h1:      clamp(40px, 6vw, 72px);
  --text-h2:      clamp(28px, 4vw, 48px);
  --text-h3:      clamp(20px, 2.5vw, 32px);
  --text-body-lg: 18px;
  --text-body:    16px;
  --text-sm:      14px;
  --text-caption: 12px;

  /* Shadows */
  --shadow-sm:   0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:   0 8px 24px rgba(0,0,0,0.6);
  --shadow-glow: 0 0 24px rgba(226,32,32,0.4);
}
```

---

## 9. Tailwind Classes — Quick Reference

Mapeamento das classes Tailwind mais usadas no projeto para garantir consistência:

```
Backgrounds:    bg-[#0A0A0A]  bg-[#111111]  bg-[#1A1A1A]  bg-[#222222]
Text:           text-white  text-[#CCCCCC]  text-[#888888]
Brand Red:      bg-[#E02020]  text-[#E02020]  border-[#E02020]
Hover Red:      hover:bg-[#E94040]  hover:text-[#E94040]
Border Subtle:  border-[#2E2E2E]
Glow:           shadow-[0_0_24px_rgba(226,32,32,0.4)]
Font:           font-['Nimbus_Sans',sans-serif]  uppercase  tracking-wider
Radius:         rounded-none  rounded  rounded-lg  rounded-full
```

---

## 10. Component Patterns

### Botão Primário (CTA)

```
bg-[#E02020] text-white uppercase tracking-wider px-8 py-4
hover:bg-[#E94040] hover:shadow-[0_0_24px_rgba(226,32,32,0.4)]
rounded-none (sharp) | transition-all duration-200
focus:outline-[#E94040] focus:outline-2 focus:outline-offset-2
```

### Botão Secundário (Ghost)

```
bg-transparent border border-[#2E2E2E] text-white uppercase tracking-wider px-8 py-4
hover:border-[#E02020] hover:text-[#E02020]
rounded-none | transition-all duration-200
```

### Card Padrão

```
bg-[#1A1A1A] border border-[#2E2E2E] p-6 rounded
hover:border-[#E02020] | transition-colors duration-200
```

### Card Ativo / Destaque

```
bg-[#222222] border border-[#E02020] p-6 rounded
shadow-[0_0_24px_rgba(226,32,32,0.2)]
```

### Input / Form Field

```
bg-[#1A1A1A] border border-[#2E2E2E] text-white px-4 py-3 rounded
focus:border-[#E02020] focus:outline-none
placeholder:text-[#888888]
```

### Badge / Tag

```
bg-[#E02020] text-white uppercase tracking-widest text-xs px-3 py-1 rounded-full
```

---

## 11. Animation Guidelines

- **Entrada de elementos:** `fadeInUp` — translate Y de 20px para 0, opacity 0→1, duration 0.6s ease-out
- **Hover transitions:** `duration-200` a `duration-300`, `ease-out`
- **Stagger em listas:** Delay de 0.1s entre itens sequenciais
- **Glow pulse:** Keyframe de opacidade 0.4→0.8→0.4 para efeitos de pulsação em CTAs
- **Marquee/Ticker:** Loop contínuo `animation: marquee 20s linear infinite`
- **Nunca usar:** Animações que causem layout shift ou perturbem leitura de conteúdo

---

## 12. Checklist de Consistência Visual

Antes de finalizar qualquer tela ou componente, verificar:

- [ ] Background é `#111111` ou derivado escuro?
- [ ] Texto principal está em branco `#FFFFFF`?
- [ ] Vermelho `#E02020` é usado apenas em ação/destaque, não em corpo de texto?
- [ ] Botão primário tem estilo sharp (sem border-radius)?
- [ ] Borders sutis usam `#2E2E2E`?
- [ ] Headlines estão em uppercase com `Barlow Condensed`?
- [ ] Imagens sobre texto têm overlay escuro suficiente?
- [ ] Targets interativos têm mínimo 44×44px?
- [ ] Estados de foco estão visíveis?
- [ ] Animações usam `motion/react` (não Framer Motion diretamente)?

---

*Design System — FORGEE Academy · dark-cinematic · high-contrast · Versão 1.0 · 2025–2026*  
*Documento de referência interno — não reproduzir sem autorização.*
