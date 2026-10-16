# Laboratório de Trigonometria e Geometria Generativa em JavaScript & Node.js

Este projeto demonstra na prática como utilizar **JavaScript** e **Node.js** para resolver problemas matemáticos, explorar relações trigonométricas e gerar formas geométricas visuais (vetoriais SVG e interativas via Canvas).

---

## 📌 Relações Trigonométricas Abordadas

### 1. Conversão de Coordenadas Polares em Cartesianas
Na tela do computador ou plano cartesiano, os pontos são determinados por $(x, y)$. Muitas formas geométricas naturais são descritas em coordenadas polares $(r, \theta)$, onde $r$ é a distância da origem e $\theta$ é o ângulo:
$$x = \text{centro}_x + r \cdot \cos(\theta)$$
$$y = \text{centro}_y - r \cdot \sin(\theta)$$
*(Nota: nos eixos de telas e SVGs, o eixo $Y$ cresce para baixo, por isso subtraímos o seno para ângulos positivos subirem).*

### 2. Círculo Trigonométrico & Teorema de Pitágoras
* Projeção horizontal: $\cos(\theta)$
* Projeção vertical: $\sin(\theta)$
* Reta tangente: $\tan(\theta) = \frac{\sin(\theta)}{\cos(\theta)}$
* Relação fundamental: $\cos^2(\theta) + \sin^2(\theta) = 1$

### 3. Rosas Polares de Rhodonea
Curvas descobertas pelo matemático Guido Grandi (1728):
$$r(\theta) = R \cdot \cos(k \cdot \theta) \quad \text{onde } k = \frac{n}{d}$$
* Se $k$ for inteiro ímpar: a rosa tem $k$ pétalas.
* Se $k$ for inteiro par: a rosa tem $2k$ pétalas.

### 4. Curvas de Lissajous (Figuras Harmônicas)
Resultado da superposição de dois movimentos harmônicos simples perpendiculares:
$$x(t) = A \cdot \sin(a \cdot t + \delta)$$
$$y(t) = B \cdot \sin(b \cdot t)$$
Onde a razão $\frac{a}{b}$ e a defasagem $\delta$ geram figuras geométricas fechadas e intrincadas.

---

## 🚀 Como Executar

### Opção A: Gerar Arquivos SVG via Node.js (Linha de Comando)
Execute o gerador em Node.js:
```bash
npm run generate
# ou:
node gerador_formas.js
```

Os arquivos vetoriais `.svg` serão gerados na pasta `output_svg/`:
* `output_svg/circulo_trigonometrico.svg` — Visualização com vetores de seno, cosseno e tangente.
* `output_svg/poligono_estrela.svg` — Estrela regular de 6 pontas calculada via trigonometria.
* `output_svg/rosa_polar.svg` — Rosa matemática de 5 pétalas.
* `output_svg/lissajous.svg` — Curva harmônica com razão 3:4.

Você pode abrir qualquer um desses arquivos SVG diretamente no seu navegador ou em softwares como Figma, Inkscape e Illustrator.

---

### Opção B: Visualizador Interativo no Navegador
Para testar a interface com sliders, animações e desenho em tempo real no Canvas:

1. Inicie o servidor local nativo:
```bash
npm start
# ou:
node server.js
```
2. Abra seu navegador em: **[http://localhost:3000](http://localhost:3000)**

*(Alternativamente, você também pode simplesmente dar duplo-clique no arquivo `index.html` para abrir diretamente no navegador sem precisar de servidor).*

---

## 📂 Estrutura de Arquivos

```text
├── gerador_formas.js      # Script Node.js que calcula e gera os arquivos SVG
├── output_svg/            # Pasta onde os SVGs gerados são salvos
│   ├── circulo_trigonometrico.svg
│   ├── poligono_estrela.svg
│   ├── rosa_polar.svg
│   └── lissajous.svg
├── index.html             # Interface visual com controles e abas
├── style.css              # Estilização moderna em tema escuro
├── app.js                 # Lógica Canvas 2D, animações e exportador SVG
├── server.js              # Servidor HTTP simples e nativo em Node.js
├── package.json           # Scripts npm configurados
└── README.md              # Documentação explicativa
```
