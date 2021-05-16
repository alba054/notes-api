// import third-part first
const { nanoid } = require('nanoid');

// import local modules
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, createdAt, updatedAt, id,
  };

  const isExist = notes.some((note) => note.id === id);
  if (!isExist) {
    notes.push(newNote);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);

  return response;
};

const getNotesHandler = (request, h) => {
  const results = {
    status: 'success',
    data: {
      notes,
    },
  };

  const response = h.response(results);
  response.code(200);

  return response;
};

const getNoteHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.find((n) => n.id === id);

  if (note) {
    const result = {
      status: 'success',
      data: {
        note,
      },
    };

    const response = h.response(result);
    response.code(200);

    return response;
  }

  const response = h.response({ status: 'fail', message: 'Catatan tidak ditemukan' });
  response.code(404);

  return response;
};

const editNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const { id } = request.params;
  const note = notes.find((n) => n.id === id);
  if (note) {
    note.title = title;
    note.tags = tags;
    note.body = body;
    note.updatedAt = new Date().toISOString();

    const response = h.response({ status: 'success', message: 'Catatan berhasil diperbaharui' });
    response.code(200);

    return response;
  }

  const response = h.response({ status: 'fail', message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan' });
  response.code(404);

  return response;
};

const deleteNoteHandler = (request, h) => {
  const { id } = request.params;
  // let isExist = false;
  const noteIndex = notes.findIndex((note) => note.id === id);
  // for (let i = 0; i < notes.length; i++) {
  //   if (id === notes[i].id) {
  //     notes.splice(i, 1);
  //     isExist = true;
  //     break;
  //   }
  // }

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    const response = h.response({ status: 'success', message: 'Catatan berhasil dihapus' });
    response.code(200);

    return response;
  }

  const response = h.response({ status: 'fail', message: 'Catatan gagal dihapus. Id catatan tidak ditemukan' });
  response.code(404);

  return response;
};

module.exports = {
  addNoteHandler,
  getNotesHandler,
  getNoteHandler,
  editNoteHandler,
  deleteNoteHandler,
};
