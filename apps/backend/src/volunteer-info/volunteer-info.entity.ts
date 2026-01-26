import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Represents the desired columns for the database table in the repository for the system's volunteer info.
 */
@Entity('volunteer_info')
export class VolunteerInfo {
  /**
   * The id corresponding to the application this information belongs to
   */
  @PrimaryColumn()
  appId!: number;

  // TODO: clarify what format this string is in, and why it's not an array
  // if people can hold multiple licenses in real life
  @Column({ type: 'varchar' })
  license!: string;
}
