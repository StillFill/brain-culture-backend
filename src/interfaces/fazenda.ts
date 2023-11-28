export interface IFazenda {
  cidade: string;
  estado: string;
  nome: string;
  area_total: number;
  area_agricultavel: number;
  area_vegetacao: number;
  culturas?: ICultura[];
}

export interface ICultura {
  id: string;
  nome: string;
}
