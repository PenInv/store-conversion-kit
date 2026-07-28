# Store Conversion Kit

Biblioteca de Custom Liquid Scripts para Shopify. Site estático em Next.js
(`output: 'export'`), publicado no Netlify.

## Rodar local

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # gera out/
```

## Como os scripts sao organizados

O codigo Liquid **nao** fica dentro do TSX. Cada script e um arquivo real:

```
liquids/<slug>.liquid          codigo (fonte da verdade)
src/data/registry.ts           metadados: titulo, categoria, tags
public/previews/<slug>.png     screenshot (opcional, ver abaixo)
```

`src/data/scripts.ts` junta as duas partes em build time. Se um slug do
registry nao tiver `.liquid` correspondente, o build falha com erro explicito
em vez de publicar um card vazio.

## Adicionar um script

1. Salve o codigo em `liquids/meu-script.liquid`
2. Adicione a entrada em `src/data/registry.ts`:

```ts
{
  slug: "meu-script",            // igual ao nome do arquivo
  title: "Nome do Script",
  shortDescription: "O que ele faz, em uma linha.",
  category: "urgency",           // ver categorias abaixo
  tags: ["tag1", "tag2"],
  compatibilityNotes: "O que editar antes de usar.",
},
```

3. `npm run build`

Categorias validas: `social-proof`, `urgency`, `payment`, `size`, `product`,
`offer`, `shipping`, `banner`.

## Preview: iframe ou screenshot

Por padrao o card renderiza o snippet ao vivo num `<iframe sandbox>`, isolado
para o CSS de um script nao vazar para o site. `src/lib/liquid-preview.ts`
resolve o Liquid que da para resolver sem uma loja (`assign`, `for`, `case`,
`if`, filtro `default`).

Scripts que dependem de dados da loja (Storefront API, `section.blocks`,
`cart`) nao renderizam fora do Shopify. Nesses casos, coloque um screenshot em
`public/previews/<slug>.png` — o componente detecta o arquivo e troca o iframe
pela imagem, marcando o card como "Screenshot · requer loja".

Hoje usam screenshot: `bundle-crocs` (Storefront API) e
`sculpiflex-real-stories` (section com `{% schema %}`).

## Deploy

`netlify.toml` ja aponta `command = npm run build` e `publish = out`.
