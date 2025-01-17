import { Controller, Get, Post, Body, Param, Render, Res, Session } from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Response } from 'express';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get('create')
  @Render('usuario/create')
  showCreate() {
    return;
  }

  @Get(':id')
  @Render('usuario/profile')
  async findOne(@Param('id') id: number, @Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.usuarioId) {
      return res.redirect('/auth/login');
    }
    const usuario = await this.usuarioService.findOne(id);
    return usuario;
  }

  @Post()
  async create(@Body() usuario: Usuario, @Res() res: Response) {
    
    usuario.administrador = usuario.administrador == 'on' ? true : false;
     
    await this.usuarioService.create(usuario);

    return res.redirect('/auth/login');
  }

  
  @Post('update/:id')
  async update(@Param('id') id: number, @Body() usuario: Usuario, @Res() res: Response) {
    await this.usuarioService.update(id, usuario);
    res.redirect(`/usuarios/${id}`);
  }
  
 
  @Post('delete/:id')
  async remove(@Session() session: Record<string, any>, @Param('id') id: number, @Res() res: Response) {
    await this.usuarioService.remove(id);
    session.usuarioId = null;
    res.redirect('/auth/login');
  }
}
