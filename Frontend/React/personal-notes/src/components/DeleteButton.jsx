import React from "react";

export default function DeleteButton({ id, handleDelete }) {
  return (
    <button
      className="note-item__delete-button"
      onClick={() => handleDelete(id)}
    >
      Delete
    </button>
  );
}
