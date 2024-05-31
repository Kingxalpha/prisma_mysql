import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { Request } from 'express'
import { CreatePostDto } from './dto/create-post.dto';
import { AuthenticatedRequest } from 'src/types/express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(RolesGuard)
  @Post('create-post')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    const imageUrl = `/uploads/${file.filename}`;
    return this.postService.createPost({ ...createPostDto, authorId: userId, imageUrl });
  }

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(Number(id));
  }

  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() body: { title?: string; content?: string, description?: string }) {
    return this.postService.updatePost(Number(id), body);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(Number(id));
  }
}
