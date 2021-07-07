import { Document, Model, model, Types, Schema, Query } from "mongoose";

// Schema
const timerSchema = new Schema<TimerBaseDocument, TimerModel>({
  ipAdress: String,
  addedTimeInSeconds: {
    type: Number,
    default: 0
  },
  totalAcum: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export interface Timer {
  _id: Types.ObjectId | Record<string, unknown>;
  addedTimeInSeconds: number;
  totalAcum: number;
}

export interface TimerBaseDocument extends Timer, Document {
  _id: Types.ObjectId | Record<string, unknown>;
}


export interface TimerModel extends Model<TimerBaseDocument> {
  findCurrentTotal(): Promise<TimerBaseDocument>;
}

timerSchema.statics.findCurrentTotal = async function(
  this: Model<TimerBaseDocument>
) {
  try {
    return await this.findOne({}).sort({createdAt: -1}).exec();
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default model<TimerBaseDocument, TimerModel>("Timer", timerSchema);
