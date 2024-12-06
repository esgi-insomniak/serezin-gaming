import { TeamMember } from 'src/models/teamMember/entities/team-member.entity';
import { Tier } from 'src/models/tier/entities/tier.entity';
import { Tournament } from 'src/models/tournament/entities/tournament.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRolesEnum } from '../enum/roles.enum';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MemberRolesEnum,
    default: MemberRolesEnum.MEMBER,
  })
  role: MemberRolesEnum;

  @ManyToOne(() => Tier, (tier) => tier.members)
  tier: Tier;

  @OneToOne(() => Tournament, (tournament) => tournament.owner, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ownTournament?: Tournament;

  @ManyToOne(() => Tournament, (tournament) => tournament.members, {
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.member)
  teamMembers: TeamMember[];
}
