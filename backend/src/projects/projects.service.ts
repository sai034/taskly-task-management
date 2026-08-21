import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(dto: CreateProjectDto) {
    const agg = await this.prisma.project.aggregate({ _max: { order: true } });
    return this.prisma.project.create({
      data: {
        name: dto.name,
        priority: dto.priority ?? 'none',
        leadId: dto.leadId ?? null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        order: dto.order ?? (agg._max.order ?? -1) + 1,
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    const data: Prisma.ProjectUncheckedUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.leadId !== undefined) data.leadId = dto.leadId;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.dueDate !== undefined)
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Detach tasks from the project rather than deleting them.
    await this.prisma.task.updateMany({
      where: { projectId: id },
      data: { projectId: null },
    });
    await this.prisma.project.delete({ where: { id } });
    return { id, deleted: true };
  }
}
