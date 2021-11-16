<template>
  <loading v-model:active="isLoadding" />
  <div class="container" style="min-height: 74vh">
    <div class="row justify-content-center mt-4 ">
      <div class="col col-12 col-md-8 text-center ">
        <form v-on:submit.prevent="login">
          <h2 class="text-center mt-4 mb-5">
            Bienvenid@, Ingresa con tus datos
          </h2>
          <div class="form-group text-left">
            <label for="">Correo Electronico</label>
            <input
              type="email"
              class="form-control"
              v-model="user.correo"
              aria-describedby="emailHelpId"
              placeholder="Ingresa tu correo electronico"
            />
          </div>
          <div class="form-group text-left">
            <label for="">Contraseña</label>
            <input
              type="password"
              class="form-control"
              placeholder="Ingresa tu contraseña"
              v-model="user.password"
            />
          </div>
          <button type="submit" class="btn button">
            <i class="bi bi-box-arrow-in-right"></i>
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
    <div class="row justify-content-center alig-self-center mt-3">
      <div class="col col-12 col-md-8 text-center">
        <span>¿Eres cliente nuevo?</span>&nbsp;&nbsp;
        <button type="button" class="btn button" v-on:click="registro">
          Registrate
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Login",

  data: function() {
    return {
      user: {
        correo: "",
        password: "",
      },
      isLoadding: false,
    };
  },

  components: {
    Loading,
  },

  methods: {
    registro: function() {
      this.$router.push("registro");
    },

    login: function() {
      this.isLoadding = true;
      axios
        .post("https://ferrotic.herokuapp.com/login", this.user)
        .then((result) => {
          let dataLogin = {
            token_access: result.data.access,
            token_refresh: result.data.refresh,
            admin: result.data.isAdmin,
            carrito: result.data.pedido,
          };
          this.isLoadding = false;
          this.$emit("login", dataLogin);
        })
        .catch((error) => {
          console.log(error);
          this.isLoadding = false;
          if (error.response.status == "401")
            alert("ERROR 401: Credenciales Incorrectas.");
        });
    },
  },

  created: function() {},
};
</script>
<style></style>
