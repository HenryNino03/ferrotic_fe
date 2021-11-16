<template>
  <div class="col col-11 col-lg-9  infog order-lg-2 text-center mx-auto">
    <div class="field" id="searchform">
      <input
        type="text"
        id="searchterm"
        placeholder="¿Que es lo que estas buscando?"
        v-model="busqueda"
      />
      <button type="button" id="search" v-on:click="search">Buscar!</button>
    </div>
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
        </div>
        <div class="col col-12 col-md-6" style="font-size: 1.4rem">
          <h2>{{ producto.nombre }}</h2>
          <textarea
            class="col-12 text-left px-0"
            style="border: 0; background-color: transparent"
            rows="4"
            v-model="producto.descripcion"
          ></textarea>
          <p class="text-left">
            <strong>Categoria: </strong> {{ producto.categoria }}
          </p>
          <div class="d-flex justify-content-between align-items-center">
            <p class="text-left">
              <strong>Marca: </strong> {{ producto.marca }}
            </p>
            <p style="font-size: 1.8rem; color: var(--color-2);">
              {{ costCurrency(producto.precio) }}
            </p>
          </div>
          <div class="d-flex justify-content-around align-items-center">
            <button
              type="submit"
              class="btn button"
              v-on:click="agregar(producto)"
            >
              <i
                class="bi bi-cart-plus align-middle"
                style="font-size: 1.5rem;"
              ></i>
              &nbsp;&nbsp; Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TokenService from "../services/TokenService";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const tokenService = new TokenService();

export default {
  name: "Home",

  data: function() {
    return {
      busqueda: "",
      productos: [],
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

    agregar: async function(producto) {
      var token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      axios
        .post(
          "https://ferrotic.herokuapp.com/pedido/producto/create",
          {
            idPedido: localStorage.getItem("carrito"),
            idProducto: producto.idProducto,
            cantidad: 1,
            valor: producto.precio,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => alert("Producto agregado exitosamente"))
        .catch((error) => {
          console.log(error);
          alert("Error al consultar los productos");
        });
    },

    costCurrency: function(cost) {
      return formatter.format(cost);
    },
  },

  created: function() {
    this.search();
  },
};
</script>

<style></style>
