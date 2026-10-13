export interface Categoria {
  id?: string | number;
  nome: string;
}

export interface CriarCategoriaRequest {
  nome: string;
}

export interface AtualizarCategoriaRequest {
  nome: string;
}