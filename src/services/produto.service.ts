import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from '../models/Produto.model';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  encontrarTudo(): Promise<Produto[]> {
    return this.produtoRepository.find();
  }  
  
  async encontrarUm(id: number): Promise<Produto> {
  return this.produtoRepository.findOne({
    where: { id }, // especifica a condição de busca
    relations: ['categoria'], // carrega a relação com a categoria
  });
}

  encontrarUmPorNome(name: string): Promise<Produto> { 
    return this.produtoRepository.findOneBy({ name } as FindOptionsWhere<Produto>); 
  }

  async criar(produto: Produto): Promise<Produto> {    
    
    return this.produtoRepository.save(produto);
  }

  async atualizar(id: number, produto: Produto): Promise<void> {
   
    await this.produtoRepository.update(id, produto);
  }

  async remover(id: number): Promise<void> {
    await this.produtoRepository.delete(id);
  }

  
}
