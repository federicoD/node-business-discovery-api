import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("businesses")
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal")
  latitude: number;

  @Column("decimal")
  longitude: number;

  @Column()
  type: "restaurant" | "coffee";
}
