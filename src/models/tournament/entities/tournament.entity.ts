import { Member } from 'src/models/member/entities/member.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Member, (member) => member.ownTournament, {
    cascade: true,
  })
  owner: Member;

  @OneToMany(() => Member, (member) => member.tournament)
  members: Member[];

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;
}
