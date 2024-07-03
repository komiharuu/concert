// aws.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      // @nestjs/config 로 .env 사용
      accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>(
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
      region: 'ap-northeast-2',
    });
  }

  // S3에 파일 업로드
  async uploadFileS3(file: Express.Multer.File) {
    const data = {
      Bucket: 'okaberin',
      Key: `${file.originalname}`,
      Body: file.buffer,
    };

    const result = await this.s3.upload(data).promise();

    // s3 파일 접근 url
    return result.Location;
  }
}
