import { QRCodeCanvas } from 'qrcode.react'
import type { StudentData } from '../types'
import { displayMatricula } from '../utils/cpf'
import { formatPeriod, formatValidity } from '../utils/validity'
import { Logo } from './Logo'

interface StudentCardProps {
  data: StudentData
  frontRef?: React.RefObject<HTMLDivElement | null>
  backRef?: React.RefObject<HTMLDivElement | null>
  validationUrl: string
}

export function StudentCard({
  data,
  frontRef,
  backRef,
  validationUrl,
}: StudentCardProps) {
  const nome = data.nome.trim().toUpperCase() || 'SEU NOME AQUI'
  const universidade =
    data.universidade.trim().toUpperCase() || 'SUA UNIVERSIDADE'
  const curso = data.curso.trim().toUpperCase() || 'SEU CURSO'
  const ra = displayMatricula(data.cpf) || '00000000'
  const validade = formatValidity(data.dataTermino)
  const periodo = formatPeriod(data.dataInicio, data.dataTermino)

  return (
    <div className="card-pair">
      <div className="card-side-label">Frente</div>
      <div className="id-card id-card-front" ref={frontRef}>
        <div className="id-card-bg" aria-hidden>
          <span className="pill pill-1" />
          <span className="pill pill-2" />
          <span className="pill pill-3" />
          <span className="corner-mark" />
        </div>

        <div className="id-card-content">
          <div className="id-card-header">
            <Logo variant="light" size="sm" />
            <span className="id-badge">Estudante</span>
          </div>

          <div className="id-photo-wrap">
            {data.foto ? (
              <img src={data.foto} alt="Foto do estudante" className="id-photo" />
            ) : (
              <div className="id-photo id-photo-placeholder">
                <span>Foto</span>
              </div>
            )}
          </div>

          <div className="id-fields">
            <Field label="Nome" value={nome} />
            <Field label="Instituição" value={universidade} />
            <Field label="Curso" value={curso} />
            <Field label="RA" value={ra} />
            <div className="id-fields-row">
              <Field label="Período" value={periodo} />
              <Field label="Validade" value={validade} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-side-label">Verso</div>
      <div className="id-card id-card-back" ref={backRef}>
        <div className="id-card-bg" aria-hidden>
          <span className="pill pill-1" />
          <span className="pill pill-2" />
          <span className="corner-mark" />
        </div>

        <div className="id-card-content id-card-back-content">
          <Logo variant="light" size="sm" />

          <div className="back-copy">
            <p className="back-title">Validação digital</p>
            <p className="back-text">
              Escaneie o QR Code para confirmar a autenticidade desta carteirinha.
            </p>
          </div>

          <div className="qr-wrap">
            <QRCodeCanvas
              value={validationUrl}
              size={118}
              level="M"
              bgColor="#ffffff"
              fgColor="#0B3D3D"
              marginSize={1}
            />
          </div>

          <div className="back-meta">
            <span>{universidade}</span>
            <span>RA: {ra}</span>
            <span>Validade: {validade}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="id-field">
      <span className="id-field-label">{label}:</span>
      <span className="id-field-value">{value}</span>
    </div>
  )
}
