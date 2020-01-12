import {
  createConnection,
  ConnectionOptions,
  Entity,
  PrimaryColumn,
  Column,
} from 'typeorm';

@Entity()
export class Constant {
  @PrimaryColumn()
  public name!: string;

  @Column()
  public value!: string;
}

const options: ConnectionOptions = {
  type: 'sqlite',
  database: `./db.sqlite`,
  entities: [Constant],
  synchronize: true,
  logging: true,
};

createConnection(options).then(connection => {
  const repo = connection.getRepository(Constant);
  repo.find().then(constants => window.alert(JSON.stringify({ constants })));
});
