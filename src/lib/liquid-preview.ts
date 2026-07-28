/**
 * Converte um snippet Liquid em HTML exibivel no preview do navegador.
 *
 * Nao e um interpretador Liquid completo: cobre o subconjunto que os snippets
 * da biblioteca usam (assign, for, case/when, if, filtro default). O arquivo
 * .liquid original vai intacto para o clipboard — isto afeta apenas a previa.
 */

type Escopo = Record<string, string>;

/** Resolve o lado direito de um assign: literal entre aspas ou outra variavel. */
function valorDe(bruto: string, escopo: Escopo): string {
  const t = bruto.trim();
  const literal = t.match(/^(['"])([\s\S]*?)\1$/);
  if (literal) return literal[2];
  if (Object.prototype.hasOwnProperty.call(escopo, t)) return escopo[t];
  return '';
}

/** Casa uma tag de abertura com seu fechamento, respeitando aninhamento. */
function acharFim(s: string, aberturaFim: number, tag: string): number {
  const re = new RegExp(`\\{%-?\\s*(${tag}|end${tag})\\b[\\s\\S]*?-?%\\}`, 'g');
  re.lastIndex = aberturaFim;
  let nivel = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    nivel += m[1] === tag ? 1 : -1;
    if (nivel === 0) return m.index;
  }
  return -1;
}

function render(tpl: string, escopo: Escopo): string {
  let saida = '';
  let i = 0;

  while (i < tpl.length) {
    const abre = tpl.indexOf('{%', i);
    if (abre === -1) {
      saida += interpolar(tpl.slice(i), escopo);
      break;
    }
    saida += interpolar(tpl.slice(i, abre), escopo);

    const fecha = tpl.indexOf('%}', abre);
    if (fecha === -1) break;
    const corpoTag = tpl.slice(abre + 2, fecha).replace(/^-|-$/g, '').trim();
    const depois = fecha + 2;

    // {% comment %} / {% schema %} — descarta o bloco inteiro
    const mIgnora = corpoTag.match(/^(comment|schema|javascript|stylesheet)$/);
    if (mIgnora) {
      const fim = acharFim(tpl, depois, mIgnora[1]);
      i = fim === -1 ? depois : tpl.indexOf('%}', fim) + 2;
      continue;
    }

    // {% assign nome = valor %}
    const mAssign = corpoTag.match(/^assign\s+([\w.]+)\s*=\s*([\s\S]+)$/);
    if (mAssign) {
      escopo[mAssign[1]] = valorDe(mAssign[2].split('|')[0], escopo);
      i = depois;
      continue;
    }

    // {% for n in (a..b) %} — unica forma de laco usada nos snippets
    const mFor = corpoTag.match(/^for\s+(\w+)\s+in\s+\((\d+)\.\.(\d+)\)$/);
    if (mFor) {
      const fim = acharFim(tpl, depois, 'for');
      if (fim === -1) { i = depois; continue; }
      const corpo = tpl.slice(depois, fim);
      const [, nome, ini, lim] = mFor;
      for (let n = Number(ini); n <= Number(lim); n++) {
        saida += render(corpo, { ...escopo, [nome]: String(n) });
      }
      i = tpl.indexOf('%}', fim) + 2;
      continue;
    }

    // {% case var %}{% when x %}...{% endcase %}
    const mCase = corpoTag.match(/^case\s+([\w.]+)$/);
    if (mCase) {
      const fim = acharFim(tpl, depois, 'case');
      if (fim === -1) { i = depois; continue; }
      const corpo = tpl.slice(depois, fim);
      const alvo = escopo[mCase[1]] ?? '';
      const ramos = corpo.split(/\{%-?\s*when\s+([\s\S]*?)-?%\}/);
      // ramos: [antes, cond1, bloco1, cond2, bloco2, ...]
      for (let k = 1; k < ramos.length; k += 2) {
        if (valorDe(ramos[k], escopo) === alvo || ramos[k].trim() === alvo) {
          saida += render(ramos[k + 1] ?? '', escopo);
          break;
        }
      }
      i = tpl.indexOf('%}', fim) + 2;
      continue;
    }

    // {% if a != blank %} / {% if a == "x" %} — heuristica simples
    const mIf = corpoTag.match(/^if\s+([\w.]+)\s*(==|!=)\s*([\s\S]+)$/);
    const mIfSo = corpoTag.match(/^if\s+([\w.]+)$/);
    if (mIf || mIfSo) {
      const fim = acharFim(tpl, depois, 'if');
      if (fim === -1) { i = depois; continue; }
      const corpo = tpl.slice(depois, fim);
      const [entao, senao = ''] = corpo.split(/\{%-?\s*else\s*-?%\}/);
      let ok: boolean;
      if (mIfSo) {
        ok = Boolean(escopo[mIfSo[1]]);
      } else {
        const esq = escopo[mIf![1]] ?? '';
        const dir = mIf![3].trim() === 'blank' || mIf![3].trim() === 'empty'
          ? ''
          : valorDe(mIf![3], escopo);
        ok = mIf![2] === '==' ? esq === dir : esq !== dir;
      }
      saida += render(ok ? entao : senao, escopo);
      i = tpl.indexOf('%}', fim) + 2;
      continue;
    }

    // Tag nao suportada: descarta so a tag, preserva o conteudo ao redor
    i = depois;
  }

  return saida;
}

/** Resolve {{ ... }} em um trecho sem tags de controle. */
function interpolar(txt: string, escopo: Escopo): string {
  return txt.replace(/\{\{-?\s*([\s\S]*?)-?\}\}/g, (_m, expr: string) => {
    const partes = String(expr).split('|');
    const base = partes[0].trim();
    let v = valorDe(base, escopo);
    // | default: "x"
    for (const f of partes.slice(1)) {
      const d = f.match(/^\s*default:\s*(['"])([\s\S]*?)\1/);
      if (d && !v) v = d[2];
    }
    return v;
  });
}

export function liquidParaHtml(code: string): string {
  try {
    // BOM atrapalha o casamento das tags no inicio do arquivo
    return render(code.replace(/^﻿/, ''), {});
  } catch {
    return code;
  }
}
