import React from "react";

export default function ArchiveButton({ id, handleArchive, isArchived }) {
  return (
    <button
      className="note-item__archive-button"
      onClick={() => handleArchive(id)}
    >
      {isArchived ? "Pindahkan" : "Arsipkan"}
    </button>
  );
}
