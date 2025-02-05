import { Controller, Get, Render, Res, Session } from '@nestjs/common';
import {ProdutoService } from '../services/produto.service';
import { Response } from 'express';

@Controller('Produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}
 
  @Get()
  @Render('produto/panel')
  async mostrar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.administrador) 
      return res.redirect('/autenticacao/login');

    const Produtos = await this.produtoService.encontrarUm(session.ProdutoId);    
    return { Produtos };
  }

}
