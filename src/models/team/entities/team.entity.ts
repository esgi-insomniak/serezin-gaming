import { Match } from 'src/models/match/entities/match.entity';
import { TeamMember } from 'src/models/teamMember/entities/team-member.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  isRed: boolean;

  @ManyToOne(() => Match, (match) => match.teams)
  match: Match;

  @OneToMany(() => TeamMember, (teamMembers) => teamMembers.team)
  teamMembers: TeamMember[];
}
