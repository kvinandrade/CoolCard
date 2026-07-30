export function buildValidationUrl(params: {
  cpf: string
  nome: string
  universidade: string
  curso: string
  validade: string
}): string {
  const search = new URLSearchParams({
    cpf: params.cpf,
    nome: params.nome,
    universidade: params.universidade,
    curso: params.curso,
    validade: params.validade,
  })
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://kvinandrade.github.io'
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${origin}${base}/validar?${search.toString()}`
}
