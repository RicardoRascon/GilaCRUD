import React, { useState, useEffect } from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function Categoria() {
  const baseUrl = "https://localhost:44350/api/";
  const [data, setData] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({
    id: "",
    descripcion: "",
    margenUtilidad: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaSeleccionada({
      ...categoriaSeleccionada,
      [name]: value,
    });
    console.log(categoriaSeleccionada);
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };
  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const peticionGet = async () => {
    await axios
      .get(baseUrl + "categoria")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = async () => {
    delete categoriaSeleccionada.id;
    await axios
      .post(baseUrl + "categoria", categoriaSeleccionada)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
        peticionGet();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const peticionPut = async () => {
    await axios
      .put(
        baseUrl + "categoria" + "/" + categoriaSeleccionada.id,
        categoriaSeleccionada
      )
      .then((response) => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map((categoria) => {
          if (categoria.id === categoriaSeleccionada.id) {
            categoria.descripcion = respuesta.descripcion;
            categoria.margenUtilidad = respuesta.margenUtilidad;
          }
        });
        abrirCerrarModalEditar();
        peticionGet();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const peticionDelete = async () => {
    await axios
      .delete(baseUrl + "categoria" + "/" + categoriaSeleccionada.id)
      .then((response) => {
        setData(data.filter((categoria) => categoria.id !== response.data));
        abrirCerrarModalEliminar();
        peticionGet();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarCategoria = (categoria, caso) => {
    setCategoriaSeleccionada(categoria);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="App">
      <br />
      <br />
      <button
        onClick={() => abrirCerrarModalInsertar()}
        className="btn btn-success"
      >
        Insertar Nueva Categoria
      </button>
      <br />
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>DESCRIPCION</th>
            <th>MARGEN DE UTILIDAD</th>
            <th>ACCIONES</th>

          </tr>
        </thead>
        <tbody>
          {data.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.descripcion}</td>
              <td>{categoria.margenUtilidad}%</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => seleccionarCategoria(categoria, "Editar")}
                >
                  Editar
                </button>{" "}
                {"   "}
                <button
                  className="btn btn-danger"
                  onClick={() => seleccionarCategoria(categoria, "Eliminar")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Categoria</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Descripcion: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="descripcion"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Margen de Utilidad: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="margenUtilidad"
              onChange={handleChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>
            Insertar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Categoria</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <br />
            <input
              type="text"
              className="form-control"
              readOnly
              value={categoriaSeleccionada && categoriaSeleccionada.id}
            />
            <br />
            <label>Descripcion: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="descripcion"
              onChange={handleChange}
              value={categoriaSeleccionada && categoriaSeleccionada.descripcion}
            />
          </div>
          <div className="form-group">
            <label>Margen de Utilidad: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="margenUtilidad"
              onChange={handleChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>
            Editar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar la Categoria{" "}
          {categoriaSeleccionada && categoriaSeleccionada.descripcion}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>
            Si
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirCerrarModalEditar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Categoria;
