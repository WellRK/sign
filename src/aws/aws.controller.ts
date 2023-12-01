import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwsService } from './aws.service';
import { CreateAwDto } from './dto/create-aw.dto';
import { UpdateAwDto } from './dto/update-aw.dto';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  create(@Body() createAwDto: CreateAwDto) {
    return this.create(createAwDto);
  }

  @Get()
  findAll() {
    return this.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAwDto: UpdateAwDto) {
    return this.update(id, updateAwDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remove(id);
  }
}
