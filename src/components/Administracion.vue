<template>
  <div class="container-fluid" style="height: 100%;">
    <div class="row">
      <div class="col col-11 col-lg-7 infog order-lg-2 text-center">
        <h2 class="text-center mr-1 mb-3">Mis Productos</h2>
        <div class="field" id="searchform">
          <input
            type="text"
            id="searchterm"
            placeholder="¿Que es lo que estas buscando?"
            v-model="busqueda"
          />
          <button type="button" id="search" v-on:click="search">Buscar!</button>
        </div>
        <button
          type="button"
          class="btn button mb-1 ml-4 addP"
          v-on:click="agregarE"
        >
          <i
            class="bi bi-plus-square align-middle"
            style="font-size: 1.8rem;"
          ></i
          >&nbsp;
          <span class="align-middle">Agregar</span>
        </button>
        <div class="products">
          <div
            class="card row mx-3 mb-2 py-2 prod"
            v-for="producto in productos"
            :key="producto"
            style="background-color: var(--color-6)"
          >
            <div class="col col-12 col-md-6 align-self-center">
              <img
                :src="producto.imagen"
                alt=""
                style="width: 100%; border-radius: 20px;"
                v-if="producto.imagen != null"
              />
              <input
                style="font-size: 0.8rem"
                type="file"
                v-on:change="cargarImagen($event, producto)"
                accept="image/*"
              />
            </div>
            <div class="col col-12 col-md-6 text-left">
              <strong>Titulo: </strong>
              <input type="text" class="cantProd" v-model="producto.nombre" />
              <br />
              <strong>Descripcion: </strong>
              <br />
              <textarea
                rows="3"
                class="cantProd col-11"
                v-model="producto.descripcion"
              ></textarea>
              <br />
              <strong>Categoria: </strong>
              <input
                type="text"
                class="cantProd"
                v-model="producto.categoria"
              />
              <br />
              <strong>Marca: </strong>
              <input type="text" class="cantProd" v-model="producto.marca" />
              <br />
              <strong>Precio: </strong>
              <input type="text" class="cantProd" v-model="producto.precio" />
              <div
                class="d-flex justify-content-around align-items-center mt-3"
              >
                <button
                  type="submit"
                  class="btn button"
                  v-on:click="agregar(producto)"
                  v-if="producto.idProducto == null"
                >
                  <i
                    class="bi bi-plus-square align-middle"
                    style="font-size: 1rem;"
                  ></i>
                  Agregar
                </button>
                <button
                  id="modd"
                  type="submit"
                  class="btn button"
                  v-on:click="modificar(producto)"
                  v-if="producto.idProducto != null"
                >
                  <i class="bi bi-tools" style="font-size: 1rem;"></i>
                  Modificar
                </button>
                <button
                  id="boor"
                  type="submit"
                  class="btn button"
                  v-on:click="eliminar(producto)"
                  v-if="producto.idProducto != null"
                >
                  <i class="bi bi-trash-fill" style="font-size: 1rem;"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col col-11 col-lg-4 infog order-lg-1">
        <h2 class="text-center mr-1 mb-3">Informacion General</h2>
        <div class="card">
          <h4 class="card-title card-header text-center">Ubicaciones</h4>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Calle 25 #32-10, Bogota</li>
            <li class="list-group-item">Carrera 15 #21-02, Medellin</li>
            <li class="list-group-item">Calle 30 #25-92, Bucaramanga</li>
          </ul>
        </div>
        <div class="card mt-4">
          <h4 class="card-title card-header text-center">Horarios</h4>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Lunes a Viernes 8:00am - 10:00pm</li>
            <li class="list-group-item">Sabado, Domingo 9:00am - 8:00pm</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TokenService from "../services/TokenService";
import { getDownloadURL, ref, storage, uploadBytes } from "../utils/firebase";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  carpeta: ref(storage, "productos"),
});

const tokenService = new TokenService();

export default {
  name: "Administracion",

  components: {},

  data: function() {
    return {
      busqueda: "",
      productos: [],
      carpeta: "productos",
    };
  },

  methods: {
    search: async function() {
      var token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      axios
        .get("https://ferrotic.herokuapp.com/productos", {
          params: { search: this.busqueda },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => (this.productos = response.data))
        .catch((error) => {
          console.log(error);
          alert("Error al consultar los productos");
        });
    },

    agregarE: function() {
      this.productos.unshift({});
    },

    agregar: async function(producto) {
      var token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      axios
        .post("https://ferrotic.herokuapp.com/producto/create", producto, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          this.search();
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error al crear los productos");
        });
    },

    eliminar: async function(producto) {
      var opcion = confirm("¿Realmente deseas borrar el producto?");
      if (opcion != true) {
        return;
      }
      var token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      axios
        .delete(
          "https://ferrotic.herokuapp.com/producto/delete/" +
            producto.idProducto,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          alert(response.data.mensaje);
          this.search();
        })
        .catch((error) => {
          console.log(error);
          alert("Error al eliminar los productos");
        });
    },

    modificar: async function(producto) {
      var token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      axios
        .patch(
          "https://ferrotic.herokuapp.com/producto/update/" +
            producto.idProducto,
          producto,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          this.search();
        })
        .catch((error) => {
          console.log(error);
          alert("Error al modificar los productos");
        });
    },

    cargarImagen: async function(e, prod) {
      let imagen = e.target.files[0];
      const refer = ref(storage, this.carpeta + "/" + prod.idProducto);
      await uploadBytes(refer, imagen);
      let url = await getDownloadURL(refer);
      prod.imagen = url;
    },

    costCurrency: function(cost) {
      return formatter.format(cost);
    },
  },

  created: function() {
    var isAdmin = localStorage.getItem("admin");
    isAdmin = isAdmin === "true";
    if (isAdmin) {
      this.search();
      return;
    }
    this.$router.push("home");
  },
};
</script>

<style>
.infog {
  margin-inline: 20px;
  margin-top: 20px;
  padding: 20px;
  background-color: var(--color-3);
  border-radius: 20px;
}
.field {
  display: inline-flex;
  position: realtive;
  margin: 2vw auto;
  width: 70%;
  flex-direction: row;
  box-shadow: 1px 1px 0 var(--color-4), 2px 2px 0 var(--color-4),
    3px 3px 0 var(--color-4), 4px 4px 0 var(--color-4), 5px 5px 0 var(--color-4),
    6px 6px 0 var(--color-4), 7px 7px 0 var(--color-4);
}

.field > input[type="text"],
.field > button {
  display: block;
  font: 1.2em "Montserrat Alternates";
}

.field > input[type="text"] {
  flex: 1;
  padding: 0.6em;
  border: 0.2em solid var(--color-1);
}

.field #search {
  padding: 0.6em 0.8em;
  background-color: var(--color-1);
  color: black;
  border: none;
}

.field #search:active {
  background-color: var(--color-4);
}

.addP {
  box-shadow: 1px 1px 0 var(--color-5), 2px 2px 0 var(--color-5),
    3px 3px 0 var(--color-5), 4px 4px 0 var(--color-5), 5px 5px 0 var(--color-5),
    6px 6px 0 var(--color-5), 7px 7px 0 var(--color-5);
}

.products {
  overflow: auto;
  font-size: 1.1rem;
  /*height: 25vw;*/
}

.prod {
  border-radius: 10px;
  flex-direction: row;
}
</style>
