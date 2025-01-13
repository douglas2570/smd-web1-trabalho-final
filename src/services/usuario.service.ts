import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../models/usuario.model';
import { FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  findOne(id: number): Promise<Usuario> {
    return this.usuarioRepository.findOneBy({ id });
  }

  findOneByLogin(login: string): Promise<Usuario> { 
    return this.usuarioRepository.findOneBy({ login } as FindOptionsWhere<Usuario>); 
  }

  async create(usuario: Usuario): Promise<Usuario> {    

    const saltOrRounds = 10; 
    usuario.senha = await bcrypt.hash(usuario.senha, saltOrRounds);
    
    return this.usuarioRepository.save(usuario);
  }

  async update(id: number, usuario: Usuario): Promise<void> {
    if (!usuario.senha)
        delete usuario.senha
    else
      usuario.senha = await bcrypt.hash(usuario.senha, 10);   

    await this.usuarioRepository.update(id, usuario);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  
}
