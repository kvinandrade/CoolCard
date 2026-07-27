export interface StudentData {
  nome: string
  cpf: string
  curso: string
  dataInicio: string
  dataTermino: string
  foto: string | null
}

export const CURSOS = [
  'Análise e Desenvolvimento de Sistemas',
  'Administração',
  'Arquitetura e Urbanismo',
  'Biomedicina',
  'Ciência da Computação',
  'Ciências Contábeis',
  'Direito',
  'Educação Física',
  'Enfermagem',
  'Engenharia Civil',
  'Engenharia de Software',
  'Farmácia',
  'Fisioterapia',
  'Gestão de Recursos Humanos',
  'Marketing',
  'Medicina',
  'Nutrição',
  'Odontologia',
  'Pedagogia',
  'Psicologia',
  'Publicidade e Propaganda',
] as const
