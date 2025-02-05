import { Controller, Get, Render, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Response } from 'express';

@Controller('administrator')
export class AdministratorController {
  constructor(private readonly usuarioService: UsuarioService) {}
 
  @Get()
  @Render('administrator/panel')
  async show(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId || !session.administrador) 
      return res.redirect('/auth/login');

    const usuario = await this.usuarioService.findOne(session.usuarioId);    
    return { usuario };
  }

}
