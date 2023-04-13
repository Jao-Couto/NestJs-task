import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
