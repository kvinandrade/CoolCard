export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/** Aceita CPF (11 dígitos) ou RA institucional (8–14 dígitos). */
export function formatMatricula(value: string): string {
  const digits = onlyDigits(value).slice(0, 14)
  if (digits.length <= 11) return formatCpf(digits)
  return digits
}

export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  const calc = (base: string, factor: number) => {
    let total = 0
    for (let i = 0; i < base.length; i += 1) {
      total += Number(base[i]) * (factor - i)
    }
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const d1 = calc(cpf.slice(0, 9), 10)
  const d2 = calc(cpf.slice(0, 10), 11)
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10])
}

export function isValidMatricula(value: string): boolean {
  const digits = onlyDigits(value)
  return digits.length >= 8 && digits.length <= 14
}

export function displayMatricula(value: string): string {
  const digits = onlyDigits(value)
  if (digits.length === 11) return formatCpf(digits)
  return digits
}
