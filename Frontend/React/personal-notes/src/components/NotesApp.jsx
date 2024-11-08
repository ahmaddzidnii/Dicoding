import React from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";
import NoteList from "./NoteList";
import NoteInput from "./NoteInput";
import { getInitialData } from "../utils";
import NoteArsipList from "./NoteArsipList";

export default class NotesApp extends React.Component {
  constructor(props) {
    super(props);

    const initialNotes = getInitialData();

    this.state = {
      notes: initialNotes,
      filteredNotes: initialNotes,
    };

    this.handleAddNote = this.handleAddNote.bind(this);
    this.handleArchiveNote = this.handleArchiveNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleSearchNotes = this.handleSearchNotes.bind(this);
  }

  handleAddNote({ title, body }) {
    const newNote = {
      id: +new Date(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    this.setState((prevState) => {
      const updatedNotes = [...prevState.notes, newNote];
      return {
        notes: updatedNotes,
        filteredNotes: updatedNotes,
      };
    });
  }

  handleArchiveNote(id) {
    this.setState((prevState) => {
      const updatedNotes = prevState.notes.map((n) =>
        n.id === id ? { ...n, archived: !n.archived } : n
      );

      const filteredNotes = prevState.filteredNotes.map((n) =>
        n.id === id ? { ...n, archived: !n.archived } : n
      );

      return {
        notes: updatedNotes,
        filteredNotes: filteredNotes,
      };
    });
  }

  handleDeleteNote(id) {
    this.setState((prevState) => {
      const updatedNotes = prevState.notes.filter((n) => n.id !== id);
      const filteredNotes = prevState.filteredNotes.filter((n) => n.id !== id);

      return {
        notes: updatedNotes,
        filteredNotes: filteredNotes,
      };
    });
  }

  handleSearchNotes(q) {
    const { notes } = this.state;

    if (q === "") {
      this.setState({ filteredNotes: notes });
      return;
    }

    const filtered = notes.filter((n) => n.title.toLowerCase().includes(q.toLowerCase()));

    this.setState({ filteredNotes: filtered });
  }

  render() {
    const activeNotes = this.state.filteredNotes.filter((n) => !n.archived);
    const archivedNotes = this.state.filteredNotes.filter((n) => n.archived);

    return (
      <>
        <Navbar onSearch={this.handleSearchNotes} />
        <main className="note-app__body">
          <NoteInput onAddNotes={this.handleAddNote} />

          <h2>Catatan Aktif</h2>
          {activeNotes.length > 0 ? (
            <NoteList
              notes={activeNotes}
              handleArchive={this.handleArchiveNote}
              handleDelete={this.handleDeleteNote}
            />
          ) : (
            <p className="notes-list__empty-message">Belum ada catatan</p>
          )}

          <h2>Arsip Catatan</h2>
          {archivedNotes.length > 0 ? (
            <NoteArsipList
              notes={archivedNotes}
              handleArchive={this.handleArchiveNote}
              handleDelete={this.handleDeleteNote}
            />
          ) : (
            <p className="notes-list__empty-message">Belum ada catatan di arsip</p>
          )}
        </main>
        <Footer />
      </>
    );
  }
}
