import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async imageUploadToS3(
    fileName: string, // 업로드될 파일의 이름
    file: Express.Multer.File, // 업로드할 파일
    ext: string, // 파일 확장자
  ) {
    // AWS S3에 이미지 업로드 명령을 생성한다.
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
      Key: fileName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command);

    // 이미지 URL
    return `https://s3.ap-northeast-2.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`;
  }
}
