import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/activity.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll() {
    return this.tasks.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasks.remove(id);
  }

  /* Subtasks */
  @Post(':id/subtasks')
  addSubtask(@Param('id') id: string, @Body() dto: CreateSubtaskDto) {
    return this.tasks.addSubtask(id, dto);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.tasks.updateSubtask(id, subtaskId, dto);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.tasks.removeSubtask(id, subtaskId);
  }

  /* Comments */
  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.tasks.addComment(id, dto);
  }

  /* Activity */
  @Post(':id/activity')
  addActivity(@Param('id') id: string, @Body() dto: CreateActivityDto) {
    return this.tasks.addActivity(id, dto);
  }
}
