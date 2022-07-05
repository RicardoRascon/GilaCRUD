import React, { useState, useEffect } from "react";
import axios from "axios";
import Categoria from "./Categoria";


function Inicio(){

    const baseUrl = "https://localhost:44350/api/";
    const [data, setData] = useState([]);

    const peticionGet = async () => {
        await axios
          .get(baseUrl + "producto/Dashboard")
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      useEffect(() => {
        peticionGet();
      }, []);
        return (
            <div className="App">
            Proyecto CRUD GilaSoftware
          <br />
          <br />
          <br />
          <br />
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Marca</th>
                <th>Costo</th>
                <th>Categoria</th>
                <th>Atributos</th>
                <th>Margen de Utilidad</th>
                <th>Precio de Venta</th>
              </tr>
            </thead>
            <tbody>
              {data.map((producto) => (
                  <tr key={producto.productoId}>
                  <td>{producto.productoId}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.sku}</td>
                  <td>{producto.marca}</td>
                  <td>${producto.costo}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.atributosproductos}</td>
                  <td>{producto.margenUtilidad}%</td>
                  <td>${producto.precioVenta}</td>
                  <td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
  )
}


export default Inicio