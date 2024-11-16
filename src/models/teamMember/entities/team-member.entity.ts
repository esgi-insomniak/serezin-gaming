import { Member } from 'src/models/member/entities/member.entity';
import { Team } from 'src/models/team/entities/team.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['team', 'member'])
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, (team) => team.teamMembers)
  team: Team;

  @ManyToOne(() => Member, (member) => member.teamMembers)
  member: Member;
}
