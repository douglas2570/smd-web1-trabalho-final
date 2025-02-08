import { Controller, Post, Body, Session, Get, Render, Res } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('login')
  @Render('autenticacao/login')
  mostrarLogin(@Session() session: Record<string, any>, @Res() res: Response) {
    if (session.usuarioId) {
      return res.redirect(`/usuarios/${session.usuarioId}`);
    }
    
    return;
  }

  @Post('login')
async login(
  @Body() { login, senha }: { login: string; senha: string },
  @Session() session: Record<string, any>,
  @Res() res: Response
) {
  const usuario = await this.usuarioService.encontrarUmPorLogin(login);

  if (!usuario || !(await this.validarSenha(senha, usuario.senha))) {
    return res.send('Credenciais inválidas');
  }

  session.usuarioId = usuario.id;
  session.administrador = usuario.administrador;

  if (usuario.administrador) {
    return res.redirect(`/administrador`); // Retorna para evitar outro redirect
  }

  return res.redirect(`/cliente`);
}
  
  private async validarSenha(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.usuarioId = null;
    res.redirect('/autenticacao/login');
  }

  @Get('session')
  session(@Session() session: Record<string, any>): string {
    if (session.usuarioId) {
      return `Usuário logado com ID: ${session.usuarioId}`;
    }
    return 'Nenhum usuário logado';
  }
}
