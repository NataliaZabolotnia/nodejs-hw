import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  try{
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
  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
}catch(error){
  console.log(error.message);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
}
};
export const getNoteById = async (req, res, next) => {
  try{
    const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
  }catch(error){
    console.log(error.message);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }

};
export const createNote = async (req, res) => {
 try{
   const note = await Note.create(req.body);
  res.status(201).json(note);
 }catch(error){
   console.log(error.message);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
 }
};
export const deleteNote = async (req, res, next) => {
 try{
   const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
 }catch(error){
   console.log(error.message);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
 }
};
export const updateNote = async (req, res, next) => {
 try{
   const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate(noteId, req.body, {
    new: true,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
 }catch(error){
   console.log(error.message);
  res.status(500).json({ message: 'Внутрішня помилка сервера' });
 }
};
