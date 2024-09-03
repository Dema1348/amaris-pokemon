import { ObjectId } from 'mongodb';
import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toObject: {
      getters: true,
      virtuals: false,
    },
  },
})
export class Pokemon {
  _id: ObjectId;

  @prop({ required: true, unique: true })
  externalId: number;

  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  weight: number;

  @prop({ required: true })
  order: number;

  @prop({ required: true })
  baseExperience: number;
}
