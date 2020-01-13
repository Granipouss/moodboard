import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Constant {
  @PrimaryColumn()
  public name!: string;

  @Column()
  public value!: string;
}
