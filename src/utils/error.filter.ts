import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.error(exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] };

    if (typeof err !== 'string') {
      // class-validator에서 발생한 에러 처리
      if (err.statusCode === 400) {
        const [errorDetails] = err.message;
        return res.status(status).json({
          message: '요청한 데이터 형식을 확인해주세요.',
          errorDetails,
        });
      }
      // JWT 인증 실패 에러 처리
      if (err.statusCode === 401) {
        return res.status(status).json({
          message: '로그인 후 사용 가능합니다.',
        });
      }
      // 기타 에러를 처리합니다.
      if (err.statusCode === 500) {
        return res.status(status).json({
          message: '예상치 못한 오류가 발생했습니다. 관리자에게 문의해주세요.',
        });
      }
    }
    // 일부 코드에서 직접 throw로 new Httpexception을 보내줄 때 처리
    return res.status(status).json({ errorMsg: exception.message });
  }
}
