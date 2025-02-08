import { Controller, Get, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Response } from 'express';

@Controller('administrador')
export class AdministradorController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async mostrar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId || !session.administrador) {
      return res.redirect('/autenticacao/login');
    }

    const usuario = await this.usuarioService.encontrarUm(session.usuarioId);

    // Usando res.render() para evitar conflito com res.redirect()
    return res.render('administrador/painel', { usuario });
  }
}
