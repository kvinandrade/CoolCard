import { useRef, useState } from 'react'
import { Logo } from '../components/Logo'
import { StudentCard } from '../components/StudentCard'
import { StudentForm } from '../components/StudentForm'
import type { StudentData } from '../types'
import { buildValidationUrl } from '../config'
import { onlyDigits } from '../utils/cpf'
import {
  downloadAsImage,
  downloadAsPdf,
  downloadAsPrintPdf,
} from '../utils/download'

const emptyData: StudentData = {
  nome: '',
  universidade: '',
  cpf: '',
  curso: '',
  dataInicio: '',
  dataTermino: '',
  foto: null,
}

export function Home() {
  const [data, setData] = useState<StudentData>(emptyData)
  const [generated, setGenerated] = useState(false)
  const [busy, setBusy] = useState<'img' | 'pdf' | 'print' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  const validationUrl = buildValidationUrl({
    cpf: onlyDigits(data.cpf),
    nome: data.nome.trim(),
    universidade: data.universidade.trim(),
    curso: data.curso,
    validade: data.dataTermino,
  })

  async function handleDownload(kind: 'img' | 'pdf' | 'print') {
    if (!frontRef.current || !backRef.current) return
    setBusy(kind)
    setError(null)
    const base = `coolcard-${onlyDigits(data.cpf) || 'estudante'}`
    try {
      if (kind === 'img') {
        await downloadAsImage(frontRef.current, backRef.current, base)
      } else if (kind === 'print') {
        await downloadAsPrintPdf(frontRef.current, backRef.current, base)
      } else {
        await downloadAsPdf(frontRef.current, backRef.current, base)
      }
    } catch {
      setError('Não foi possível gerar o arquivo. Tente novamente.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="page">
      <header className="site-header">
        <Logo size="lg" />
        <p className="tagline">
          Gere sua carteirinha estudantil vertical em poucos minutos.
        </p>
      </header>

      <main className="layout">
        <section className="panel">
          <h1>Dados do estudante</h1>
          <p className="panel-sub">
            Preencha os campos abaixo. A validade é calculada automaticamente pela
            data de término do curso.
          </p>
          <StudentForm
            data={data}
            onChange={(next) => {
              setData(next)
              setGenerated(false)
            }}
            onSubmit={() => setGenerated(true)}
            generated={generated}
          />
        </section>

        <section className="panel preview-panel">
          <h2>Prévia da carteirinha</h2>
          <p className="panel-sub">
            Formato vertical inspirado no estilo institucional moderno.
          </p>

          <StudentCard
            data={data}
            frontRef={frontRef}
            backRef={backRef}
            validationUrl={validationUrl}
          />

          {generated && (
            <div className="download-actions">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy !== null}
                onClick={() => handleDownload('img')}
              >
                {busy === 'img' ? 'Gerando…' : 'Baixar imagem'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy !== null}
                onClick={() => handleDownload('pdf')}
              >
                {busy === 'pdf' ? 'Gerando…' : 'Baixar PDF'}
              </button>
              <button
                type="button"
                className="btn btn-primary download-print"
                disabled={busy !== null}
                onClick={() => handleDownload('print')}
              >
                {busy === 'print' ? 'Gerando…' : 'Baixar para imprimir (A4)'}
              </button>
              <p className="download-print-hint">
                Folha A4 com frente e verso em tamanho real (54×86 mm) para cortar e
                plastificar.
              </p>
            </div>
          )}

          {!generated && (
            <p className="preview-hint">
              Complete o formulário e clique em <strong>Gerar carteirinha</strong>{' '}
              para liberar o download.
            </p>
          )}

          {error && <p className="field-hint error">{error}</p>}
        </section>
      </main>

      <footer className="site-footer">
        <Logo size="sm" />
        <span>CoolCard — carteirinha estudantil digital gratuita</span>
      </footer>
    </div>
  )
}

