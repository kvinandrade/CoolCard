export interface StudentData {
  nome: string
  universidade: string
  cpf: string
  curso: string
  dataInicio: string
  dataTermino: string
  foto: string | null
}

export const UNIVERSIDADES = [
  'UniFECAF',
  'USP — Universidade de São Paulo',
  'UNICAMP — Universidade Estadual de Campinas',
  'UNESP — Universidade Estadual Paulista',
  'UNIFESP — Universidade Federal de São Paulo',
  'UFRJ — Universidade Federal do Rio de Janeiro',
  'UFMG — Universidade Federal de Minas Gerais',
  'UFSC — Universidade Federal de Santa Catarina',
  'UFRGS — Universidade Federal do Rio Grande do Sul',
  'UnB — Universidade de Brasília',
  'PUC-SP — Pontifícia Universidade Católica de São Paulo',
  'Mackenzie — Universidade Presbiteriana Mackenzie',
  'UNIP — Universidade Paulista',
  'UNINOVE — Universidade Nove de Julho',
  'Anhanguera',
  'Estácio',
  'FMU — Centro Universitário das Faculdades Metropolitanas Unidas',
  'Anhembi Morumbi',
  'FIAP',
  'Fatec',
] as const

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
