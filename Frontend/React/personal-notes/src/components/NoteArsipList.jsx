import React from "react";

import DeleteButton from "./DeleteButton";
import ArchiveButton from "./ArchiveButton";
import { showFormattedDate } from "../utils";

export default function NoteArsipList({ notes, handleArchive, handleDelete }) {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div
          key={note.id}
          className="note-item"
        >
          <div className="note-item__content">
            <h3 className="note-item__title">{note.title}</h3>
            <p className="note-item__date">{showFormattedDate(note.createdAt)}</p>
            <p className="note-item__body">{note.body}</p>
          </div>
          <div className="note-item__action">
            <DeleteButton
              id={note.id}
              handleDelete={handleDelete}
            />
            <ArchiveButton
              id={note.id}
              handleArchive={handleArchive}
              isArchived={note.archived}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
