import { Schema } from 'mongoose';
import { model } from 'mongoose';

const noteSchema = new Schema(
  {
    title: String,
    require: true,
  },
  {
    content: String,
    default: '',
    require: false,
  },
  {
    tag: String,
    enum: [
      'Work',
      'Personal',
      'Meeting',
      'Shopping',
      'Ideas',
      'Travel',
      'Finance',
      'Health',
      'Important',
      'Todo',
    ],
    require: false,
    default: 'Todo',
  },
  {
    timestamps: true,
  },
);

export const Note = model('Note', noteSchema);
