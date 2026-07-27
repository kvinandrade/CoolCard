import type { ChangeEvent, FormEvent } from 'react'
import { CURSOS, type StudentData } from '../types'
import { formatCpf, isValidCpf, onlyDigits } from '../utils/cpf'
import { formatValidity } from '../utils/validity'

interface StudentFormProps {
  data: StudentData
  onChange: (data: StudentData) => void
  onSubmit: () => void
  generated: boolean
}

export function StudentForm({
  data,
  onChange,
  onSubmit,
  generated,
}: StudentFormProps) {
  const cpfDigits = onlyDigits(data.cpf)
  const cpfOk = cpfDigits.length === 11 && isValidCpf(data.cpf)
  const datesOk =
    Boolean(data.dataInicio) &&
    Boolean(data.dataTermino) &&
    data.dataTermino >= data.dataInicio

  const canSubmit =
    data.nome.trim().length >= 3 &&
    cpfOk &&
    Boolean(data.curso) &&
    datesOk &&
    Boolean(data.foto)

  function update<K extends keyof StudentData>(key: K, value: StudentData[K]) {
    onChange({ ...data, [key]: value })
  }

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      update('foto', typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit()
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          type="text"
          placeholder="Como aparece no documento"
          value={data.nome}
          onChange={(e) => update('nome', e.target.value)}
          autoComplete="name"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="cpf">CPF (número de matrícula / RA)</label>
        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={data.cpf}
          onChange={(e) => update('cpf', formatCpf(e.target.value))}
          required
        />
        {cpfDigits.length === 11 && !cpfOk && (
          <span className="field-hint error">CPF inválido</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="curso">Curso</label>
        <select
          id="curso"
          value={data.curso}
          onChange={(e) => update('curso', e.target.value)}
          required
        >
          <option value="">Selecione o curso</option>
          {CURSOS.map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="inicio">Início do curso</label>
          <input
            id="inicio"
            type="date"
            value={data.dataInicio}
            onChange={(e) => update('dataInicio', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="termino">Término do curso</label>
          <input
            id="termino"
            type="date"
            value={data.dataTermino}
            min={data.dataInicio || undefined}
            onChange={(e) => update('dataTermino', e.target.value)}
            required
          />
        </div>
      </div>

      {datesOk && (
        <p className="validity-preview">
          Validade da carteirinha: <strong>{formatValidity(data.dataTermino)}</strong>
        </p>
      )}

      <div className="field">
        <label htmlFor="foto">Foto 3x4</label>
        <div className="photo-upload">
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            required={!data.foto}
          />
          {data.foto && (
            <img src={data.foto} alt="Prévia da foto" className="photo-preview" />
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
        {generated ? 'Atualizar carteirinha' : 'Gerar carteirinha'}
      </button>
    </form>
  )
}
