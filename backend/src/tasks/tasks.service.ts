import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GroupKey, statusForGroup } from '../common/constants';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/activity.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const TASK_INCLUDE = {
  subtasks: { orderBy: { order: 'asc' } },
  comments: { orderBy: { createdAt: 'asc' } },
  activity: { orderBy: { createdAt: 'desc' } },
} satisfies Prisma.TaskInclude;

const DEFAULT_USER = 'u-dexter';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({
      include: TASK_INCLUDE,
      orderBy: [{ group: 'asc' }, { order: 'asc' }],
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE,
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(dto: CreateTaskDto) {
    const group = dto.group ?? 'todo';
    const order = dto.order ?? (await this.nextOrder(group));
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        group,
        status: dto.status ?? statusForGroup(group as GroupKey),
        priority: dto.priority ?? 'none',
        labels: dto.labels ?? [],
        teams: dto.teams ?? [],
        memberIds: dto.memberIds ?? [],
        reporterId: dto.reporterId ?? DEFAULT_USER,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        projectId: dto.projectId ?? null,
        order,
      },
      include: TASK_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.ensureTask(id);
    const data: Prisma.TaskUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.group !== undefined) data.group = dto.group;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.labels !== undefined) data.labels = dto.labels;
    if (dto.teams !== undefined) data.teams = dto.teams;
    if (dto.memberIds !== undefined) data.memberIds = dto.memberIds;
    if (dto.reporterId !== undefined) data.reporterId = dto.reporterId;
    if (dto.projectId !== undefined) data.projectId = dto.projectId;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.dueDate !== undefined)
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.startDate !== undefined)
      data.startDate = dto.startDate ? new Date(dto.startDate) : null;

    return this.prisma.task.update({
      where: { id },
      data,
      include: TASK_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.ensureTask(id);
    await this.prisma.task.delete({ where: { id } });
    return { id, deleted: true };
  }

  /* ---- Subtasks ---- */

  async addSubtask(taskId: string, dto: CreateSubtaskDto) {
    await this.ensureTask(taskId);
    const agg = await this.prisma.subtask.aggregate({
      where: { taskId },
      _max: { order: true },
    });
    await this.prisma.subtask.create({
      data: {
        taskId,
        title: dto.title,
        priority: dto.priority ?? 'none',
        memberIds: dto.memberIds ?? [],
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        done: dto.done ?? false,
        order: (agg._max.order ?? -1) + 1,
      },
    });
    return this.findOne(taskId);
  }

  async updateSubtask(taskId: string, subtaskId: string, dto: UpdateSubtaskDto) {
    await this.ensureSubtask(taskId, subtaskId);
    const data: Prisma.SubtaskUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.memberIds !== undefined) data.memberIds = dto.memberIds;
    if (dto.done !== undefined) data.done = dto.done;
    if (dto.dueDate !== undefined)
      data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    await this.prisma.subtask.update({ where: { id: subtaskId }, data });
    return this.findOne(taskId);
  }

  async removeSubtask(taskId: string, subtaskId: string) {
    await this.ensureSubtask(taskId, subtaskId);
    await this.prisma.subtask.delete({ where: { id: subtaskId } });
    return this.findOne(taskId);
  }

  /* ---- Comments ---- */

  async addComment(taskId: string, dto: CreateCommentDto) {
    await this.ensureTask(taskId);
    await this.prisma.comment.create({
      data: {
        taskId,
        authorId: dto.authorId ?? DEFAULT_USER,
        body: dto.body,
      },
    });
    return this.findOne(taskId);
  }

  /* ---- Activity ---- */

  async addActivity(taskId: string, dto: CreateActivityDto) {
    await this.ensureTask(taskId);
    await this.prisma.activity.create({
      data: {
        taskId,
        authorId: dto.authorId ?? DEFAULT_USER,
        kind: dto.kind,
        field: dto.field,
        from: dto.from,
        to: dto.to,
        note: dto.note,
      },
    });
    return this.findOne(taskId);
  }

  /* ---- helpers ---- */

  private async nextOrder(group: string) {
    const agg = await this.prisma.task.aggregate({
      where: { group },
      _max: { order: true },
    });
    return (agg._max.order ?? -1) + 1;
  }

  private async ensureTask(id: string) {
    const exists = await this.prisma.task.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Task ${id} not found`);
  }

  private async ensureSubtask(taskId: string, subtaskId: string) {
    const st = await this.prisma.subtask.findFirst({
      where: { id: subtaskId, taskId },
    });
    if (!st)
      throw new NotFoundException(
        `Subtask ${subtaskId} not found on task ${taskId}`,
      );
  }
}
