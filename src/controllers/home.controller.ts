import { Controller, Get, Render, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Response } from 'express';

@Controller('home')
export class HomeController {
  constructor(private readonly usuarioService: UsuarioService) {}
 
  @Get()
  @Render('home/show')
  async showHome(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId) 
      return res.redirect('/auth/login');

    const usuario = await this.usuarioService.findOne(session.usuarioId);
    console.log(usuario)
    return { usuario };
  }

}
