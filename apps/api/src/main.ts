import 'reflect-metadata';
import {ValidationPipe,VersioningType} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder,SwaggerModule} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {ProblemFilter} from './common/problem.filter';
import {CorrelationInterceptor} from './common/correlation.interceptor';
async function bootstrap(){const app=await NestFactory.create(AppModule,{bufferLogs:true});app.setGlobalPrefix('api',{exclude:['health/live','health/ready','metrics']});app.enableVersioning({type:VersioningType.URI,defaultVersion:'1'});app.use(cookieParser());app.use(helmet({contentSecurityPolicy:false}));app.enableCors({origin:(process.env.ALLOWED_ORIGINS??'http://localhost:5173').split(','),credentials:true,allowedHeaders:['content-type','x-csrf-token','x-correlation-id','idempotency-key','if-match']});app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));app.useGlobalFilters(new ProblemFilter());app.useGlobalInterceptors(new CorrelationInterceptor());const config=new DocumentBuilder().setTitle('CSER Workspace V3 API').setDescription('Independent candidate API using fictional cloud-security data.').setVersion('3.0.0').addCookieAuth('cser_session').build();const document=SwaggerModule.createDocument(app,config);SwaggerModule.setup('api/docs',app,document);await app.listen(Number(process.env.PORT??4000),'0.0.0.0')}
void bootstrap();
