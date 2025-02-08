import { Controller, Get, Post, Body, Param, Render, Res, Session, Query } from '@nestjs/common';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../models/produto.model';
import { CategoriaService } from '../services/categoria.service';
import { Response } from 'express';

@Controller('produto')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly categoriaService: CategoriaService
  ) {}
    
  @Get()
  async mostrar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.administrador) {
      return res.redirect('/autenticacao/login'); 
    }	
	
    const produtos = await this.produtoService.encontrarTudo();   
	
    return res.render('administrador/produto/painel', { produtos });
  }

  @Get('pesquisar')
  @Render('administrador/produto/painel')
  async mostrarPesquisa(
    @Session() session: Record<string, any>,
    @Query('conteudo') conteudo: string,
    @Res() res: Response
  ) {
    if (!session.administrador) return res.redirect('/autenticacao/login');

    let produtos = await this.produtoService.encontrarTudo();
    
    if (conteudo) {
      produtos = produtos.filter((produto) =>
        produto.descricao.toLowerCase().includes(conteudo.toLowerCase())
      );
    }

    return { produtos };
  }

  @Get('criar')
  @Render('administrador/produto/criar')
  async mostrarCriar(@Session() session: Record<string, any>, @Res() res: Response) {
    if (!session.administrador) 
      return res.redirect('/autenticacao/login');

    const categorias = await this.categoriaService.encontrarTudo();
    return { categorias };
  }

  @Post('criar')
  async criar(@Body() produto: Produto, @Res() res: Response) {
    await this.produtoService.criar(produto);
    return res.redirect('/produto');
  }
	
	
@Get('editar/:id')
async editar(@Param('id') id: number, @Res() res: Response) {
  try {
    const produto = await this.produtoService.encontrarUm(id);
    const categorias = await this.categoriaService.encontrarTudo();
    
    const categoriasComSelecao = categorias.map(categoria => ({
      ...categoria,
      isSelected: categoria.id === produto.categoria.id, 
    }));

    return res.render('administrador/produto/editar', { 
      produto,
      categorias: categoriasComSelecao,
    });
  } catch (error) {
    console.error('Erro ao carregar a página de edição:', error);
    return res.status(500).send('Erro interno do servidor');
  }
}

  @Post('atualizar/:id')
  async atualizar(@Param('id') id: number, @Body() produto: Produto, @Res() res: Response) {
    await this.produtoService.atualizar(id, produto);
    return res.redirect('/produto');
  }

  @Get('deletar/:id')
  async remover(@Param('id') id: number, @Res() res: Response) {
    await this.produtoService.remover(id);
    return res.redirect('/produto');
  }
}
