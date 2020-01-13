import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Image {
  @PrimaryColumn({ type: 'varchar' })
  public id!: string;

  @Column()
  public url!: string;

  @Column()
  public height!: number;

  @Column()
  public width!: number;

  @Column()
  public link!: string;

  @Column()
  public source!: string;
}
