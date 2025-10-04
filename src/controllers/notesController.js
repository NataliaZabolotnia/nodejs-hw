import { Note } from '../models/note.js';
import createHttpError from 'http-errors';
// import { Joi, Segments } from "celebrate";

export const getAllNotes = async (req, res) => {
  const { tag, search, page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;
  let notesQuery = Note.find();
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.or([
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]);
  }
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);
  const totalPage = Math.ceil(totalNotes / perPage);
  // const notes = await notesQuery;

  res.status(200).json({ page, perPage, totalNotes, totalPage, notes });
};
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(noteId, req.body, {
    new: true,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
