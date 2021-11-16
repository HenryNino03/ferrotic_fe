<template>
  <loading v-model:active="cargar" />
  <div class="container-fluid">
    <h1 class="text-center my-3">Carrito de Compras</h1>
    <div class="row justify-content-center">
      <div class="col col-12 col-md-8 order-2 order-md-1 px-5 text-center">
        <h2 class="col-12">Productos</h2>
        <table class="table table-sm col-12 col-sm-10">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in pedido.productos" :key="producto">
              <td class="align-middle">{{ producto.producto.nombre }}</td>
              <td class="align-middle">
                <input
                  class="cantProd col-12 col-sm-6 text-center"
                  type="number"
                  min="1"
                  :max="producto.producto.cantidadDisponible"
                  v-on:change="actualizarProducto(producto)"
                  v-model="producto.cantidad"
                />
              </td>
              <td class="align-middle">
                {{ costCurrency(calcTotProd(producto)) }}
              </td>
              <td class="align-middle">
                <a
                  style="font-size: 2rem"
                  v-on:click="eliminarProducto(producto)"
                  ><i class="bi bi-dash-square-dotted"></i
                ></a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2" scope="row" class="text-center">Total</th>
              <td>{{ costCurrency(calcularTotal()) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="col order-1 order-md-2 col-12 col-md-4 ">
        <h2>Información de Envio</h2>
        <div class="form-group col-10">
          <label for="">Telefono</label>
          <input type="text" class="form-control" v-model="pedido.telefono" />
        </div>
        <div class="form-group col-10">
          <label for="">Ciudad</label>
          <input type="text" class="form-control" v-model="pedido.ciudad" />
        </div>
        <div class="form-group col-10">
          <label for="">Direccion</label>
          <input type="text" class="form-control" v-model="pedido.direccion" />
        </div>
        <div class="form-group col-10">
          <label for="">Nombre Receptor</label>
          <input
            type="text"
            class="form-control"
            v-model="pedido.nombreReceptor"
          />
        </div>
        <div class="form-group col-10">
          <label for="">Numero articulos</label>
          <input
            type="text"
            readonly
            class="form-control"
            :value="numeroArticulos()"
          />
        </div>
        <div class="form-group col-10">
          <label for="">Observaciones</label>
          <input
            type="text"
            class="form-control"
            v-model="pedido.observaciones"
          />
        </div>
        <div class="col-10 text-center">
          <button type="submit" class="btn button" v-on:click="comprar">
            <i class="bi bi-cash-coin"></i>
            Comprar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import TokenService from "../services/TokenService";
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const tokenService = new TokenService();

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default {
  name: "Carrito",

  data: function() {
    return {
      pedido: {},
      isLoading: true,
    };
  },

  components: {
    Loading,
  },

  methods: {
    getData: async function() {
      this.isLoading = true;
      let token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      let idUsuario = jwt_decode(token).user_id.toString();
      axios
        .get(`https://ferrotic.herokuapp.com/pedido/detalle/` + idUsuario, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.pedido = result.data;
          this.isLoading = false;
        })
        .catch((error) => {
          alert("Se ha presentado un error");

          this.isLoading = false;
          if (error.response.status == 401) this.$emit("logout");
        });
    },

    costCurrency: function(cost) {
      return formatter.format(cost);
    },

    calcularTotal: function() {
      let total = 0;
      this.pedido.productos.forEach((item) => (total += item.valor));
      this.pedido.total = total;
      return total;
    },

    calcTotProd: function(producto) {
      let valor = producto.cantidad * producto.producto.precio;
      producto.valor = valor;
      return valor;
    },

    eliminarProducto: async function(prod) {
      this.isLoading = true;
      let token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      axios
        .delete(
          `https://ferrotic.herokuapp.com/pedido/producto/` +
            prod.idProductoPedido,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((result) => {
          this.isLoading = false;
          this.getData();
        })
        .catch((error) => {
          alert("Se ha presentado un error");
          this.isLoading = false;
          if (error.response.status == 401) this.$emit("logout");
        });
    },

    actualizarProducto: async function(prod) {
      this.isLoading = true;
      let token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      prod.idProducto = prod.producto.idProducto;
      prod.idPedido = this.pedido.idPedido;
      axios
        .put(
          `https://ferrotic.herokuapp.com/pedido/producto/` +
            prod.idProductoPedido,
          prod,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((result) => {
          this.isLoading = false;
          prod = result.data;
        })
        .catch((error) => {
          console.log(error.response.data);
          alert("Se ha presentado un error");
          this.isLoading = false;
          if (error.response.status == 401) this.$emit("logout");
        });
    },

    numeroArticulos: function() {
      let total = 0;
      this.pedido.productos.forEach((item) => (total += item.cantidad));
      this.pedido.numeroArticulos = total;
      return total;
    },

    comprar: async function() {
      this.isLoading = true;
      let token = await tokenService.getToken();
      if (token === null) {
        this.$emit("logout");
        return;
      }
      let Penv = JSON.parse(JSON.stringify(this.pedido));
      delete Penv.productos;
      axios
        .patch(
          `https://ferrotic.herokuapp.com/pedido/update/` +
            this.pedido.idPedido,
          Penv,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((result) => {
          this.isLoading = false;
          axios
            .get(
              `https://ferrotic.herokuapp.com/comprar/` + this.pedido.idPedido,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((result) => {
              this.isLoading = false;
              localStorage.setItem("carrito", result.data.pedido);
              this.$router.push({ name: "home" });
            })
            .catch((error) => {
              alert("Se ha presentado un error");
              this.isLoading = false;
              if (error.response.status == 401) this.$emit("logout");
            });
        })
        .catch((error) => {
          alert("Se ha presentado un error");
          this.isLoading = false;
          if (error.response.status == 401) this.$emit("logout");
        });
    },
  },

  created: function() {
    this.getData();
  },
};
</script>

<style>
.cantProd:focus {
  border-bottom: 1px solid black;
}
.cantProd {
  border: 0;
  outline: 0;
  background: transparent;
}
</style>
