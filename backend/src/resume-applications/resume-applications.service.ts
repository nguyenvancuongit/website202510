import { Injectable, BadRequestException, NotFoundException, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request, Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { CreateResumeApplicationDto } from './dto/create-resume-application.dto';
import { FindAllResumeApplicationsDto } from './dto/find-all-resume-applications.dto';
import { RecruitmentPostStatus, RecruitmentPostTypeStatus } from '@prisma/client';
import { getClientIp } from '../common/helpers/request.helper';

import * as path from 'path';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { formatDateTimeWithTZ } from 'src/utils';

@Injectable({ scope: Scope.REQUEST })
export class ResumeApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async submitApplication(
    createDto: CreateResumeApplicationDto,
    resumeFile: Express.Multer.File,
  ) {
    // Check if recruitment post exists and is published
    const recruitmentPost = await this.prisma.recruitmentPost.findFirst({
      where: {
        id: BigInt(createDto.recruitment_post_id),
        status: RecruitmentPostStatus.published,
        recruitmentPostType: {
          status: RecruitmentPostTypeStatus.enabled,
        },
      },
      include: {
        recruitmentPostType: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!recruitmentPost) {
      throw new NotFoundException('招聘职位不存在或未发布');
    }

    // Validate resume file
    this.validateResumeFile(resumeFile);

    // Get client IP address
    const ipAddress = getClientIp(this.request);

    // Create resume application record
    const application = await this.prisma.resumeApplication.create({
      data: {
        recruitmentPostId: BigInt(createDto.recruitment_post_id),
        resumeFilePath: resumeFile.path,
        resumeFileName: resumeFile.originalname,
        ipAddress: ipAddress || null,
      },
      include: {
        recruitmentPost: {
          select: {
            jobTitle: true,
            recruitmentPostType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      message: '简历提交成功',
      applicationId: application.id.toString(),
      jobTitle: application.recruitmentPost.jobTitle,
      jobType: application.recruitmentPost.recruitmentPostType.name,
    };
  }

  private validateResumeFile(file: Express.Multer.File) {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小不能超过5MB');
    }

    // Check file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed',
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.zip'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException('只支持PDF、Word文档和ZIP文件格式');
    }
  }

  async findAll(query: FindAllResumeApplicationsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      recruitment_post_id,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Map frontend sort field to Prisma field names
    const sortFieldMap: Record<string, string> = {
      'id': 'id',
      'recruitment_post_id': 'recruitmentPostId',
      'resume_file_name': 'resumeFileName',
      'created_at': 'createdAt',
    };

    const prismaField = sortFieldMap[sort_by] || 'createdAt';
    const orderBy = { [prismaField]: sort_order };

    // Build where condition
    const where: any = {};

    if (search) {
      where.OR = [
        {
          resumeFileName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          recruitmentPost: {
            jobTitle: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (recruitment_post_id) {
      where.recruitmentPostId = BigInt(recruitment_post_id);
    }

    const [applications, total] = await Promise.all([
      this.prisma.resumeApplication.findMany({
        where,
        include: {
          recruitmentPost: {
            select: {
              id: true,
              jobTitle: true,
              jobType: true,
              recruitmentPostType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.resumeApplication.count({ where }),
    ]);

    return {
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const application = await this.prisma.resumeApplication.findUnique({
      where: { id: BigInt(id) },
      include: {
        recruitmentPost: {
          include: {
            recruitmentPostType: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('简历申请不存在');
    }

    return application;
  }

  async downloadResume(id: string, res: Response) {
    const application = await this.prisma.resumeApplication.findUnique({
      where: { id: BigInt(id) },
      select: {
        resumeFilePath: true,
        resumeFileName: true,
      },
    });

    if (!application) {
      throw new NotFoundException('简历申请不存在');
    }

    if (!application.resumeFilePath || !fs.existsSync(application.resumeFilePath)) {
      throw new NotFoundException('简历文件不存在');
    }

    const fileStream = createReadStream(application.resumeFilePath);
    const filename = application.resumeFileName || 'resume.pdf';

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    });

    fileStream.pipe(res);
  }

  async exportApplications(ids: string[] | undefined, res: Response) {
    const where: any = {};
    if (ids && ids.length > 0) {
      where.id = {
        in: ids.map(id => BigInt(id)),
      };
    }

    const applications = await this.prisma.resumeApplication.findMany({
      where,
      include: {
        recruitmentPost: {
          include: {
            recruitmentPostType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Create CSV content
    const csvHeaders = [
      '投递时间',
      '职位ID',
      '投递职位',
      '职位类型',
      '简历文件名',
      'IP地址',
    ];

    const csvRows = applications.map(app => [
      app.createdAt.toISOString().split('T')[0] + ' ' + app.createdAt.toTimeString().split(' ')[0],
      app.recruitmentPost.id.toString(),
      app.recruitmentPost.jobTitle,
      app.recruitmentPost.recruitmentPostType.name,
      app.resumeFileName || '-',
      app.ipAddress || '-',
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(',')),
    ].join('\n');

    const filename = `resume-applications-${formatDateTimeWithTZ(new Date())}.csv`;

    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    // Add BOM for proper UTF-8 encoding in Excel
    res.write('\uFEFF');
    res.end(csvContent);
  }
}
