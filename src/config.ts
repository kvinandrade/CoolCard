/** Domínio público da CoolCard (QR Code e validação). */
export const SITE_ORIGIN = 'https://coolcard.is-a.dev'

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
  return `${SITE_ORIGIN}/validar?${search.toString()}`
}
