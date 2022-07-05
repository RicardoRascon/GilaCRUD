import React, { useState, useEffect } from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function Atributo() {
  const baseUrl = "https://localhost:44350/api/";
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [atributoSeleccionado, setAtributoSeleccionado] = useState({
    id: "",
    descripcion: "",
    categoriaId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtributoSeleccionado({
      ...atributoSeleccionado,
      [name]: value,
    });
    console.log(atributoSeleccionado);
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
      .get(baseUrl + "atributos")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const categoriasGet = async () => {
    await axios
      .get(baseUrl + "categoria")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error('kevin', error);
      });
  };

  const peticionPost = async () => {
    delete atributoSeleccionado.id;
    atributoSeleccionado.categoriaId=parseInt(atributoSeleccionado.categoriaId);
    await axios
      .post(baseUrl + "atributos", atributoSeleccionado)
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
        baseUrl + "atributo" + "/" + atributoSeleccionado.id,
        atributoSeleccionado
      )
      .then((response) => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map((atributo) => {
          if (atributo.id === atributoSeleccionado.id) {
            atributo.descripcion = respuesta.descripcion;
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
      .delete(baseUrl + "atributo" + "/" + atributoSeleccionado.id)
      .then((response) => {
        setData(data.filter((atributo) => atributo.id !== response.data));
        abrirCerrarModalEliminar();
        peticionGet();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarAtributo = (atributo, caso) => {
    setAtributoSeleccionado(atributo);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
    categoriasGet();
  }, []);

  return (
    <div className="App">
      <br />
      <br />
      <button
        onClick={() => abrirCerrarModalInsertar()}
        className="btn btn-success"
      >
        Insertar Nuevo Atributo
      </button>
      <br />
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>DESCRIPCION</th>
            <th>CATEGORIA</th>

          </tr>
        </thead>
        <tbody>
          {data.map((atributo) => (
            <tr key={atributo.id}>
              <td>{atributo.id}</td>
              <td>{atributo.descripcion}</td>
              <td>{atributo.categoriaId}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => seleccionarAtributo(atributo, "Editar")}
                >
                  Editar
                </button>{" "}
                {"   "}
                <button
                  className="btn btn-danger"
                  onClick={() => seleccionarAtributo(atributo, "Eliminar")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Atributo</ModalHeader>
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
          <label>Categoria: </label>
            <br />
          <select className='form-control' name='categoriaId' onChange={handleChange}>
          <option value={''} selected>Seleccione Una Categoria</option>
            {categorias &&
              categorias.length > 0 &&
              categorias.map(categoria => {
                return <option key={categoria} value={categoria.id}>{categoria.descripcion}</option>;
              })}
          </select>

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
        <ModalHeader>Editar Atributo</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <br />
            <input
              type="text"
              className="form-control"
              readOnly
              value={atributoSeleccionado && atributoSeleccionado.id}
            />
            <br />
            <label>Descripcion: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="descripcion"
              onChange={handleChange}
              value={atributoSeleccionado && atributoSeleccionado.descripcion}
            />
            
          </div>
          <div className="form-group">
          <label>Categoria: </label>
            <br />
          <select className='form-control' name='categoriaId' onChange={handleChange}>
          <option value={''} selected>Seleccione Una Categoria</option>
            {categorias &&
              categorias.length > 0 &&
              categorias.map(categoria => {
                return <option key={categoria} value={categoria.id}>{categoria.descripcion}</option>;
              })}
          </select>

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
          ¿Estás seguro que deseas eliminar el atributo {" "}
          {atributoSeleccionado && atributoSeleccionado.descripcion}?
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

export default Atributo;