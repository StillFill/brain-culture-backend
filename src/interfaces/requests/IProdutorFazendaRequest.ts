export interface IProdutorFazendaRequest {
  documento_produtor: string;
  nome: string;
  cidade: string;
  estado: string;
  nome_fazenda: string;
  area_total_fazenda: number;
  area_agricultavel_fazenda: number;
  area_vegetacao_fazenda: number;
  culturas: number[];
}

export interface ICultura {
  id_cultura: string;
  nome_cultura: string;
}
