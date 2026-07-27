import { Link, useSearchParams } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { formatCpf, isValidCpf, onlyDigits } from '../utils/cpf'
import { formatValidity, isCardCurrentlyValid } from '../utils/validity'

export function Validate() {
  const [params] = useSearchParams()
  const cpf = onlyDigits(params.get('cpf') ?? '')
  const nome = (params.get('nome') ?? '').trim()
  const universidade = (params.get('universidade') ?? '').trim()
  const curso = (params.get('curso') ?? '').trim()
  const validade = params.get('validade') ?? ''

  const hasData = cpf.length === 11 && isValidCpf(cpf) && Boolean(validade)
  const stillValid = hasData && isCardCurrentlyValid(validade)

  return (
    <div className="page validate-page">
      <header className="site-header">
        <Logo size="lg" />
      </header>

      <main className="validate-card">
        {stillValid ? (
          <>
            <div className="status-icon ok" aria-hidden>
              ✓
            </div>
            <h1>Carteirinha válida</h1>
            <p className="validate-lead">
              Esta CoolCard foi verificada com sucesso e está dentro do período de
              validade.
            </p>
          </>
        ) : hasData ? (
          <>
            <div className="status-icon warn" aria-hidden>
              !
            </div>
            <h1>Carteirinha expirada</h1>
            <p className="validate-lead">
              Os dados foram encontrados, mas a validade informada já encerrou.
            </p>
          </>
        ) : (
          <>
            <div className="status-icon warn" aria-hidden>
              ?
            </div>
            <h1>Não foi possível validar</h1>
            <p className="validate-lead">
              Escaneie o QR Code impresso no verso da sua CoolCard para conferir a
              autenticidade.
            </p>
          </>
        )}

        {hasData && (
          <dl className="validate-details">
            {nome && (
              <>
                <dt>Nome</dt>
                <dd>{nome.toUpperCase()}</dd>
              </>
            )}
            {universidade && (
              <>
                <dt>Instituição</dt>
                <dd>{universidade}</dd>
              </>
            )}
            {curso && (
              <>
                <dt>Curso</dt>
                <dd>{curso}</dd>
              </>
            )}
            <dt>RA / CPF</dt>
            <dd>{formatCpf(cpf)}</dd>
            <dt>Validade</dt>
            <dd>{formatValidity(validade)}</dd>
          </dl>
        )}

        <Link to="/" className="btn btn-primary">
          Gerar nova carteirinha
        </Link>
      </main>
    </div>
  )
}
