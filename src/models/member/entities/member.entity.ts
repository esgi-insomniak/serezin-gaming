import { TeamMember } from 'src/models/teamMember/entities/team-member.entity';
import { Tier } from 'src/models/tier/entities/tier.entity';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';
import { TournamentRole } from 'src/models/tournamentRole/entities/tournament-role.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TournamentRole, (role) => role.members)
  role: TournamentRole;

  @ManyToOne(() => Tier, (tier) => tier.members)
  tier: Tier;

  @OneToOne(() => Tournament, (tournament) => tournament.owner, {
    nullable: true,
  })
  @JoinColumn()
  ownTournament?: Tournament;

  @ManyToOne(() => Tournament, (tournament) => tournament.members)
  tournament: Tournament;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.member)
  teamMembers: TeamMember[];
}
