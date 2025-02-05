import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Usuario } from './models/usuario.model';
import { Venda } from './models/venda.model';
import { Categoria } from './models/categoria.model';
import { Produto } from './models/produto.model';
import { VendaProduto } from './models/vendaProduto.model';
import { UsuarioService } from './services/usuario.service';
import { ProdutoService } from './services/produto.service';
import { CategoriaService } from './services/categoria.service';
import { UsuarioController } from './controllers/usuario.controller';
import { AutenticacaoController } from './controllers/autenticacao.controller';
import * as session from 'express-session';
import { AdministradorController } from './controllers/administrador.controller';
import { ClienteController } from './controllers/cliente.controller';

//http://localhost:3000/

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'ufc123',
      database: 'ecommerce',
      entities: [Usuario, Venda, Categoria, Produto, VendaProduto],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, Venda, Categoria, Produto, VendaProduto]),
  ],
  controllers: [AppController, UsuarioController, AutenticacaoController, ClienteController, AdministradorController],
  providers: [UsuarioService, ProdutoService, CategoriaService],
})


export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(session({
        secret: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
        resave: false,
        saveUninitialized: false,
      }))
      .forRoutes('*');
  }
}
