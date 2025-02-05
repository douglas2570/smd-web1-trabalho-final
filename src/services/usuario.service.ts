import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/models/usuario.model';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  encontrarTudo(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  encontrarUm(id: number): Promise<Usuario> {
    return this.usuarioRepository.findOneBy({ id });
  }

  encontrarUmPorLogin(login: string): Promise<Usuario> { 
    return this.usuarioRepository.findOneBy({ login } as FindOptionsWhere<Usuario>); 
  }

  async criar(usuario: Usuario): Promise<Usuario> {    

    const saltOrRounds = 10; 
    usuario.senha = await bcrypt.hash(usuario.senha, saltOrRounds);
    
    return this.usuarioRepository.save(usuario);
  }

  async atualizar(id: number, usuario: Usuario): Promise<void> {
    if (!usuario.senha)
        delete usuario.senha
    else
      usuario.senha = await bcrypt.hash(usuario.senha, 10);   

    await this.usuarioRepository.update(id, usuario);
  }

  async remover(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  
}
