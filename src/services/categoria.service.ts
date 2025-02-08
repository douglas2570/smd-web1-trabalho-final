import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../models/categoria.model';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  encontrarTudo(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  encontrarUm(id: number): Promise<Categoria> {
    return this.categoriaRepository.findOneBy({ id });
  }

  encontrarUmPorNome(name: string): Promise<Categoria> { 
    return this.categoriaRepository.findOneBy({ name } as FindOptionsWhere<Categoria>); 
  }

  async criar(categoria: Categoria): Promise<Categoria> {    
    
    return this.categoriaRepository.save(categoria);
  }

  async atualizar(id: number, categoria: Categoria): Promise<void> {
   
    await this.categoriaRepository.update(id, categoria);
  }

  async remover(id: number): Promise<void> {
    await this.categoriaRepository.delete(id);
  }

  
}
