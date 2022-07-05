import React, { useState, useEffect } from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function Producto() {
  const baseUrl = "https://localhost:44350/api/";
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [atributosCategorias, setAtributosCategorias] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    id: "-1",
    nombre: "",
    sku: "",
    marca: "",
    costo: "",
    categoriaId: "-1",
    productosAtributos: [],
  });

  const [productoAtributos, setAtributoSeleccionado] = useState([
    // {
    //   id: "",
    //   productoId: "",
    //   atributoId: "",
    //   valor: "",
    // },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoSeleccionado({
      ...productoSeleccionado,
      [name]: value,
    });

    console.log(productoSeleccionado);
  };

  const handleAtributoChange = (e) => {
    const { name, value } = e.target;
    const atributoId = e.target.getAttribute("data-atributoid");

    for (const ac of atributosCategorias) {
      if (
        ac.atributoId == atributoId &&
        ac.productoId == productoSeleccionado.id
      ) {
        ac.valor = value;
        break;
      }
    }

    console.log(atributosCategorias);
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
      .get(baseUrl + "producto")
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
        console.log(error);
      });
  };

  const atributosCategoriasGet = () => {
    const categoriaId =
      productoSeleccionado.categoriaId == ""
        ? "-1"
        : productoSeleccionado.categoriaId;
    const productoId =
      productoSeleccionado.id == "" ? "-1" : productoSeleccionado.id;

    if (productoId == undefined) return;

    return axios
      .get(
        baseUrl +
          `atributos/GetAtributosCategorias/${categoriaId}/${productoId}`
      )

      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = async () => {
    delete productoSeleccionado.id;
    productoSeleccionado.sku = parseInt(productoSeleccionado.sku);
    productoSeleccionado.categoriaId = parseInt(
      productoSeleccionado.categoriaId
    );
    productoSeleccionado.costo = parseFloat(productoSeleccionado.costo);
    productoSeleccionado.productosAtributos = atributosCategorias;

    await axios
      .post(baseUrl + "producto", productoSeleccionado)
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
    productoSeleccionado.sku = parseInt(productoSeleccionado.sku);
    productoSeleccionado.costo = parseFloat(productoSeleccionado.costo);

    await axios
      .put(
        baseUrl + "producto" + "/" + productoSeleccionado.id,
        productoSeleccionado
      )
      .then((response) => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map((producto) => {
          if (producto.id === productoSeleccionado.id) {
            producto.nombre = respuesta.nombre;
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
      .delete(baseUrl + "producto" + "/" + productoSeleccionado.id)
      .then((response) => {
        setData(data.filter((producto) => producto.id !== response.data));
        abrirCerrarModalEliminar();
        peticionGet();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarProducto = (producto, caso) => {
    setProductoSeleccionado(producto);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
    categoriasGet();
  }, []);

  useEffect(() => {
    /*if (name == 'categoriaId' && value != ''){
    }*/
    async function llamada() {
      const response = await atributosCategoriasGet();
      setAtributosCategorias(response.data);
      // if(response){
      //   setAtributosCategorias(response.data);
      // }else{
      //   setAtributosCategorias([]);
      // }
      console.log(response);
    }
    llamada();
  }, [productoSeleccionado.categoriaId, productoSeleccionado.id]);

  return (
    <div className="App">
      <br />
      <br />

      <button
        onClick={() => abrirCerrarModalInsertar()}
        className="btn btn-success"
      >
        Insertar Nuevo Producto
      </button>

      <br />
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>SKU</th>
            <th>MARCA</th>
            <th>COSTO</th>
          </tr>
        </thead>
        <tbody>
          {data.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.sku}</td>
              <td>{producto.marca}</td>
              <td>{producto.costo}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => seleccionarProducto(producto, "Editar")}
                >
                  Editar
                </button>{" "}
                {"   "}
                <button
                  className="btn btn-danger"
                  onClick={() => seleccionarProducto(producto, "Eliminar")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Producto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>SKU: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="sku"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Marca: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="marca"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Costo: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="costo"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Categoria: </label>
            <br />
            <select
              className="form-control"
              name="categoriaId"
              onChange={handleChange}
            >
              <option value="">Seleccione Una Categoria</option>
              {categorias &&
                categorias.length > 0 &&
                categorias.map((categoria) => {
                  return (
                    <option value={categoria.id}>
                      {categoria.descripcion}
                    </option>
                  );
                })}
            </select>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ATRIBUTO</th>
                <th>VALOR</th>
              </tr>
            </thead>
            <tbody>
              {atributosCategorias &&
                atributosCategorias.map((atributo) => (
                  <tr key={atributo.atributoId}>
                    <td>{atributo.atributoDesc}</td>
                    <td>
                      {
                        <input
                          name={atributo.atributoId}
                          data-atributoid={atributo.atributoId}
                          defaultValue={atributo.valor}
                          onBlur={handleAtributoChange}
                        />
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <br />
            <input
              type="text"
              className="form-control"
              readOnly
              value={productoSeleccionado && productoSeleccionado.id}
            />
            <br />
            <label>Nombre: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
              value={productoSeleccionado && productoSeleccionado.nombre}
            />
            <label>SKU: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="sku"
              onChange={handleChange}
              value={productoSeleccionado && productoSeleccionado.sku}
            />
            <label>Marca: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="marca"
              onChange={handleChange}
              value={productoSeleccionado && productoSeleccionado.marca}
            />
            <label>Costo: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="costo"
              onChange={handleChange}
              value={productoSeleccionado && productoSeleccionado.costo}
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
          ¿Estás seguro que deseas eliminar el producto{" "}
          {productoSeleccionado && productoSeleccionado.nombre}?
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

export default Producto;
