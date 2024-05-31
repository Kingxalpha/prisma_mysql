import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  // async createPost(data: { title: string; content: string; description: string; authorId: number }): Promise<Post> {
  //   return this.prismaService.post.create({
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       content: data.content,
  //       authorId: data.authorId,
  //       published: false,
  //       images: {
  //         create: [{ url: data.imageUrl }],
  //       },
  //     },
  //   });
  // }
  // async createPost(data: CreatePostDto & { authorId: number }): Promise<Post> {
  //   return this.prismaService.post.create({
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       content: data.content,
  //       authorId: data.authorId,
  //       published: false,
  //       images: {
  //         create: { url: data.imageUrl },
  //       },
  //     },
  //   });
  // }
  async createPost(data: CreatePostDto & { authorId: number; imageUrl: string }): Promise<Post> {
    return this.prismaService.post.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        authorId: data.authorId,
        published: false,
        images: {
          create: { url: data.imageUrl },
        },
      },
      include:{
        images:true
      }
    });
  }

  async getPosts(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async getPostById(id: number): Promise<Post> {
    return this.prismaService.post.findUnique({
      where: { id },
    });
  }

  async updatePost(id: number, data: { title?: string; content?: string, description?: string }): Promise<Post> {
    return this.prismaService.post.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: number): Promise<Post> {
    return this.prismaService.post.delete({
      where: { id },
    });
  }
}
