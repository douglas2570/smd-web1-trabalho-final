import { Controller, Get, Post, Body, Param, Render, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Response } from 'express';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  encontrarTodos(): Promise<Usuario[]> {
    return this.usuarioService.encontrarTudo();
  }

  @Get('criar')
  @Render('usuario/criar')
  mostrarCriar() {
    return;
  }

  @Get(':id')
  @Render('usuario/perfil')
  async encontrarUm(@Param('id') id: number, @Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId) {
      return res.redirect('/autenticacao/login');
    }
    const usuario = await this.usuarioService.encontrarUm(id);
    return usuario;
  }

  @Post()
  async criar(@Body() usuario: Usuario, @Res() res: Response) {
    
    usuario.administrador = usuario.administrador == 'on' ? true : false;
     
    await this.usuarioService.criar(usuario);

    return res.redirect('/autenticacao/login');
  }
  
  @Post('atualizar/:id')
  async atualizar(@Param('id') id: number, @Body() usuario: Usuario, @Res() res: Response) {
    await this.usuarioService.atualizar(id, usuario);
    res.redirect(`/usuarios/${id}`);
  }
   
  @Post('deletar/:id')
  async remover(@Session() session: Record<string, any>, @Param('id') id: number, @Res() res: Response) {
    await this.usuarioService.remover(id);
    session.usuarioId = null;
    res.redirect('/autenticacao/login');
  }
}
