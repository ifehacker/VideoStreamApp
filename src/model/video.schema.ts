import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type VideoDocument = Video & Document;

@Schema()
export class Video {
  @Prop()
  title: string;

  @Prop()
  video: string;
  @Prop()
  coverImage: string;

  @Prop({ default: Date.now() })
  createDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  uploadBy: User;
}

export const videoSchema = SchemaFactory.createForClass(Video);
