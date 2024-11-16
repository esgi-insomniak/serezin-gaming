import { Team } from 'src/models/team/entities/team.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Team, (team) => team.match)
  teams: Team[];

  @Column({ type: 'timestamptz' })
  start: Date;

  @Column({ type: 'timestamptz' })
  end: Date;
}
