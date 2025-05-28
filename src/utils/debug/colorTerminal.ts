/**
 * Função para colorir os textos (ANSI codes)
 *
 * Códigos de cores ANSI usados:
 * - 31: Vermelho (para erros críticos)
 * - 32: Verde (para arquivos e detalhes importantes do app)
 * - 33: Amarelo (para avisos e mensagens)
 * - 34: Azul (para o JS Engine)
 * - 35: Roxo (para Android e iOS)
 * - 36: Ciano (para métodos e arquivos relevantes)
 * - 90: Cinza (para detalhes menores de arquivos em outras partes do código)
 *
 * Exemplos de cores:
 * 31 -> Vermelho: Usado para erros críticos (ex: mensagem de erro)
 * 32 -> Verde: Usado para mensagens de sucesso ou detalhes do app (ex: nome do arquivo)
 * 33 -> Amarelo: Usado para avisos importantes (ex: título da mensagem de erro)
 * 34 -> Azul: Usado para identificar o tipo de engine (ex: "💎 JS Engine" ou "🔥 Hermes")
 * 35 -> Roxo: Usado para identificar a plataforma (ex: "🤖 Android" ou "🍎 iOS")
 * 36 -> Ciano: Usado para destacar informações de métodos e linhas de código
 * 90 -> Cinza: Usado para detalhes menores, como números de linha e coluna
 */
export function colorTerminal(text: string, colorCode: number) {
  return `\x1b[${colorCode}m${text}\x1b[0m`
}
