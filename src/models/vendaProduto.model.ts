import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Venda } from './venda.model';
import { Produto } from './produto.model';

@Entity()
export class VendaProduto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @ManyToOne(() => Venda, venda => venda.id)
  venda: Venda;

  @ManyToOne(() => Produto, produto => produto.id)
  produto: Produto;

  @CreateDateColumn()
  criadoEm: Date;
}
