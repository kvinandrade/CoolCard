import type { ChangeEvent, FormEvent } from 'react'
import { CURSOS, UNIVERSIDADES, type StudentData } from '../types'
import { formatMatricula, isValidMatricula, onlyDigits } from '../utils/cpf'
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
  const matriculaOk = isValidMatricula(data.cpf)
  const datesOk =
    Boolean(data.dataInicio) &&
    Boolean(data.dataTermino) &&
    data.dataTermino >= data.dataInicio

  const canSubmit =
    data.nome.trim().length >= 3 &&
    data.universidade.trim().length >= 2 &&
    matriculaOk &&
    Boolean(data.curso) &&
    datesOk &&
    Boolean(data.foto)

  const missingFields: string[] = []
  if (data.nome.trim().length < 3) missingFields.push('nome completo')
  if (data.universidade.trim().length < 2) missingFields.push('universidade')
  if (!matriculaOk) missingFields.push('CPF ou RA válido (8 a 14 dígitos)')
  if (!data.curso) missingFields.push('curso')
  if (!datesOk) missingFields.push('datas de início e término')
  if (!data.foto) missingFields.push('foto')

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
        <label htmlFor="universidade">Universidade / instituição</label>
        <input
          id="universidade"
          type="text"
          list="universidades-sugestoes"
          placeholder="Selecione ou digite o nome"
          value={data.universidade}
          onChange={(e) => update('universidade', e.target.value)}
          autoComplete="organization"
          required
        />
        <datalist id="universidades-sugestoes">
          {UNIVERSIDADES.map((uni) => (
            <option key={uni} value={uni} />
          ))}
        </datalist>
        <span className="field-hint">
          Escolha uma sugestão ou digite o nome da sua instituição.
        </span>
      </div>

      <div className="field">
        <label htmlFor="cpf">CPF ou RA (matrícula)</label>
        <input
          id="cpf"
          type="text"
          inputMode="numeric"
          placeholder="CPF ou número de matrícula"
          value={data.cpf}
          onChange={(e) => update('cpf', formatMatricula(e.target.value))}
          required
        />
        {cpfDigits.length > 0 && !matriculaOk && (
          <span className="field-hint error">
            Informe um CPF ou RA com 8 a 14 dígitos
          </span>
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

      {!canSubmit && missingFields.length > 0 && (
        <p className="field-hint form-checklist">
          Falta preencher: {missingFields.join(', ')}.
        </p>
      )}
    </form>
  )
}
