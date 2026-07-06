export class CreateTaskDto {
  title!: string;
  description?: string;
  deadline?: Date;
  priority?: string;
  assignedTo?: string;
  position?: number;
}
