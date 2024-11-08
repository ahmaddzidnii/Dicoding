import React from "react";

const MAX_TITLE_LENGTH = 50;

export default class NoteInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      body: "",
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTitleChange(e) {
    if (e.target.value.length > MAX_TITLE_LENGTH) {
      return;
    }

    this.setState(() => ({ title: e.target.value }));
  }

  handleBodyChange(e) {
    this.setState(() => ({ body: e.target.value }));
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.title.trim() || !this.state.body.trim()) {
      return;
    }

    this.props.onAddNotes(this.state);
    this.setState(() => ({ title: "", body: "" }));
  }

  render() {
    return (
      <div className="note-input">
        <h2>Buat Catatan</h2>
        <form onSubmit={this.handleSubmit}>
          <p className="note-input__title__char-limit">
            Sisa Karakter: {MAX_TITLE_LENGTH - this.state.title.length}
          </p>
          <input
            value={this.state.title}
            className="note-input__title"
            type="text"
            onChange={this.handleTitleChange}
            placeholder="Judul catatan..."
          />
          <textarea
            className="note-input__body"
            placeholder="Isi catatan..."
            value={this.state.body}
            onChange={this.handleBodyChange}
          />
          <button type="submit">Buat</button>
        </form>
      </div>
    );
  }
}
