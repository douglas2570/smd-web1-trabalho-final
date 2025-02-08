import { Controller, Get, Post, Body, Param, Render, Res, Session, Query } from '@nestjs/common';
import {CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';
import { Response } from 'express';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}
 
  @Get()
  @Render('administrador/categoria/painel')
  async mostrar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.administrador) 
      return res.redirect('/autenticacao/login');

    const categorias = await this.categoriaService.encontrarTudo();    
    return { categorias };
  }
  
  @Get('pesquisar')
  @Render('administrador/categoria/painel')
  async mostrarPesquisa(
    @Session() session: Record<string, any>,
    @Query('conteudo') conteudo: string,
    @Res() res: Response
  ) {
    if (!session.administrador) return res.redirect('/autenticacao/login');

    let categorias = await this.categoriaService.encontrarTudo();
    
    if (conteudo) {
      categorias = categorias.filter((categoria) =>
        categoria.nome.toLowerCase().includes(conteudo.toLowerCase())
      );
    }

    return { categorias };
  }
  
  @Get('criar')
  @Render('administrador/categoria/criar')
  async mostrarCriar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.administrador) 
      return res.redirect('/autenticacao/login');
  } 
  
  
  @Post('criar')
  async criar(@Body() categoria: Categoria, @Res() res: Response) {
     
    await this.categoriaService.criar(categoria);

    return res.redirect(`/categoria`);
  }   
  
  @Get('editar/:id')
  @Render('administrador/categoria/editar') 
  async editar(@Param('id') id: number) {
    const categoria = await this.categoriaService.encontrarUm(id);
    return { categoria };
  }
  
  @Post('atualizar/:id')
  async atualizar(@Param('id') id: number, @Body() categoria: Categoria, @Res() res: Response) {
    await this.categoriaService.atualizar(id, categoria);
    return res.redirect('/categoria');
  }

  @Get('deletar/:id')
  async remover(@Param('id') id: number, @Res() res: Response) {
	  await this.categoriaService.remover(id);
	  return res.redirect('/categoria');
  }


}
