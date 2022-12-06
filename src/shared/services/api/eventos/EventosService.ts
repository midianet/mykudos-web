import { Environment } from '../../../environment';
import { Api } from '../axios-config';

import {v4 as uid} from 'uuid';

export interface IListagemEvento{
    id: number;
    nome: string;
}

export interface IDetalheEvento{
  id: number;
  nome: string;
  token?: string;
  integrantes?: Array<string>;
}

type TEventoComTotalCount = {
    data: IListagemEvento[];
    totalCount: number;
}

const newId = uid();

const getUrl = (token?: string): string => {
  return `${window.location.origin}/kudo/${token}`;
};

const getAll = async (page = 1, filter = ''): Promise<TEventoComTotalCount | Error> => {
  try{
    const url = `/eventos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
    const { data, headers } = await Api.get(url);
    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }
    return new Error('Erro ao listar os registros');
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao listar os registros');
  }
};

const getById = async (id: number): Promise<IDetalheEvento | Error> => {
  try{
    const { data } = await Api.get(`/eventos/${id}`);
    if (data) {
      return data;
    }
    return new Error('Erro ao obter registro');
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao obter registro');
  }
};

const create = async (dados: Omit<IDetalheEvento,'id'>): Promise<number | Error> => {
  dados.token= newId;
  try{
    const { data } = await Api.post<IDetalheEvento>('/eventos', dados);
    if (data) {
      return data.id;
    }
    return new Error('Erro ao criar registro');
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao criar registro');
  }   
};

const updateById = async (id: number, dados: IDetalheEvento): Promise<void | Error> => {
  try{
    await Api.put<IDetalheEvento>(`/eventos/${id}`, dados);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao alterar registro');
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try{
    await Api.delete(`/eventos/${id}`);
  }catch (error) {
    console.error(error);
    return new Error((error as {message: string}).message || 'Erro ao deletar registro');
  }
};

export const EventosService = {
  getUrl,
  getAll,
  create,
  getById,
  updateById,
  deleteById
};