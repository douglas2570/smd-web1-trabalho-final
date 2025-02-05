import { Controller, Get, Render, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Response } from 'express';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly usuarioService: UsuarioService) {}
 
  @Get()
  @Render('cliente/mostrar')
  async mostrar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId) 
      return res.redirect('/auth/login');

    const usuario = await this.usuarioService.encontrarUm(session.usuarioId);
    console.log(usuario)
    return { usuario };
  }

}
