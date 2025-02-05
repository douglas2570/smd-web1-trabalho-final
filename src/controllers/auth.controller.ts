import { Controller, Post, Body, Session, Get, Render, Res } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('login')
  @Render('auth/login')
  showLogin(@Session() session: Record<string, any>, @Res() res: Response) {
    if (session.usuarioId) {
      return res.redirect(`/usuarios/${session.usuarioId}`);
    }
    return;
  }

  @Post('login')
  async login(@Body() { login, senha }: { login: string, senha: string }, @Session() session: Record<string, any>, @Res() res: Response) {
    const usuario = await this.usuarioService.findOneByLogin(login); 
       
    if (await this.validatePassword(senha, usuario.senha)) {
      session.usuarioId = usuario.id;
      res.redirect(`/customer`);
    } else {
      res.send('Credenciais inválidas');
    }
  }
  
  private async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.usuarioId = null;
    res.redirect('/auth/login');
  }

  @Get('session')
  session(@Session() session: Record<string, any>): string {
    if (session.usuarioId) {
      return `Usuário logado com ID: ${session.usuarioId}`;
    }
    return 'Nenhum usuário logado';
  }
}
