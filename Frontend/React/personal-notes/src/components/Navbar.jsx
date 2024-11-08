import React from "react";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      search: e.target.value,
    });

    this.props.onSearch(e.target.value);
  }

  render() {
    return (
      <header className="note-app__header">
        <h1>Ahmad Zidni Note</h1>
        <search className="note-search">
          <input
            value={this.state.search}
            onChange={this.handleChange}
            placeholder="Cari catatan.."
            type="text"
          />
        </search>
      </header>
    );
  }
}
