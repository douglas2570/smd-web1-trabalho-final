import { Controller, Get, Render, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Response } from 'express';

@Controller('administrador')
export class AdministradorController {
  constructor(private readonly usuarioService: UsuarioService) {}
 
  @Get()
  @Render('administrador/painel')
  async mostrar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId || !session.administrador) 
      return res.redirect('/autenticacao/login');

    const usuario = await this.usuarioService.encontrarUm(session.usuarioId);    
    return { usuario };
  }

}
