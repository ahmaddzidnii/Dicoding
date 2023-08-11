import { useEffect, useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import Select from "react-select";
import data from "../data.json";
import FooterComponent from "../Components/FooterComponent";

const options = data.data.map((e) => {
  return {
    value: e.endpoint,
    label: e.name,
    hasZoneId: e.hasZoneId,
  };
});

function CheckId() {
  const [validated, setValidated] = useState(false);
  const [selectGame, setSelectGame] = useState("");
  const [namaGame, setNamaGame] = useState("");
  const [path, setPath] = useState("");
  const [id, setId] = useState("");
  const [server, setServer] = useState("");
  const [Api, setApi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [handleNotFound, setHandleNotFound] = useState(false);
  console.log(path);

  const link = `${path}?id=${id}&zone=${server}`;
    console.log(link)

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    // console.log(form);
    if (form.checkValidity() === true) {
      setLoading(true);
      setHandleNotFound(false)
    }

    setValidated(true);
  };

  const handleSelect = (e) => {
    setSelectGame(e.hasZoneId);
    setPath(e.value);
    setNamaGame(e.label);

    setId("");
    setServer("");
  };

  const fetchData = () => {
    fetch(`https://api-cek-id-game.vercel.app${link}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          setLoading(false);
          setApi(data.data);
          setHandleNotFound(false);
        } else if (data.status === false ) {
          setHandleNotFound(true);
          setLoading(false);
          setApi(null);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [loading]);

  return (
    <div className="page-game">
      <div className="container space-navbar min-vh-100">
        <div className="row  align-items-center d-flex">
          <div className="col-lg-6 text-white">
            <div className="h1">Check Username Game Anda.</div>
            <p>tersedia 150++ game online, silahkan pilih sendiri mau check username game apa. <a className="text-decoration-none text-white fw-bold" href="https://tools.bagusok.com/">Terimakasih kepada bagusok.com atas APInya.</a></p>
          </div>
          <div className="col-lg-6">
            <div>
              <div className="row">
                <label className="text-white my-2">Pilih Game</label>
                <Select
                  options={options}
                  onChange={handleSelect}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary50: "cyan",
                      primary75: "cyan",
                    },
                  })}
                />
                <Form validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="validationCustom03">
                    <Form.Label className="text-white mt-2">ID Game</Form.Label>
                    <Form.Control type="number" placeholder="Masukkan ID" required value={id} onChange={(e) => setId(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Id harus diisi.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className={selectGame ? "" : "d-none"} controlId="validationCustom04">
                    <Form.Label className="text-white mt-2">Server</Form.Label>
                    <Form.Control type="number" placeholder="Masukkan Server" defaultValue={null} value={server} onChange={(e) => setServer(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Server harus diisi.</Form.Control.Feedback>
                  </Form.Group>
                  <Button className="mt-3 w-100" type="submit">
                    Cari ID
                  </Button>
                </Form>

                <div className="mt-5 text-white">
                  <div className="card pb-5">
                    <div className="card-body">
                    <h3 className="mt-3">Result :</h3>
                    <div>
                      <div>
                        {handleNotFound && (
                          <div className="alert alert-danger text-center" role="alert">
                            ID tidak ditemukan! Pastikan menginputnya dengan benar.
                          </div>
                        )}
                        {loading ? (
                          <div>
                            <div className="d-flex justify-content-center mt-5">
                              <div className="spinner-grow text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          Api !== null && (
                            <div>
                              <ListGroup as="ol">
                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                  <div className="ms-2 me-auto">
                                    <div className="fw-bold">Username:</div>
                                  </div>
                                  <span bg="primary">{Api.username}</span>
                                </ListGroup.Item>
                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                  <div className="ms-2 me-auto">
                                    <div className="fw-bold">Id:</div>
                                  </div>
                                  <span>{Api.user_id}</span>
                                </ListGroup.Item>
                                <div className={Api.zone === null ? "d-none" : ""}>
                                  <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                      <div className="fw-bold">Server:</div>
                                    </div>
                                    <span>{Api.zone}</span>
                                  </ListGroup.Item>
                                </div>
                                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                                  <div className="ms-2 me-auto">
                                    <div className="fw-bold">Nama game:</div>
                                  </div>
                                  <span>{namaGame}</span>
                                </ListGroup.Item>
                              </ListGroup>
                              {/* <div className="table-resposive">
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td colSpan={2}>Username</td>
                                      <td>{Api.username}</td>
                                    </tr>
                                    <tr>
                                      <td colSpan={2}>ID</td>
                                      <td>{Api.user_id}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div> */}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent/>
    </div>
  );
}

export default CheckId;
