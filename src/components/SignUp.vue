<template>
  <div class="signUp_user">
    <div class="container_signUp_user col col-11 col-md-6">
      <h2>Registrarse</h2>
      <form v-on:submit.prevent="processSignUp">
        <div class="form-group text-left">
          <label for="">Correo Electronico</label>
          <input 
            type="email" 
            v-model="usuario.correo" 
            placeholder="Correo" 
          />
        </div>
        <div class="form-group text-left">
          <label for="">Contraseña</label>
          <input
            type="password"
            v-model="usuario.password"
            placeholder="Password"
          />
        </div>
      
        <div class="form-group text-left">
          <label for="">Tipo de Documento</label>
          <input
            type="text"
            v-model="usuario.tipoDocumento"
            placeholder="Tipo Documento"
          />
        </div>
        <div class="form-group text-left">
          <label for="">Numero de Documento</label>
          <input
            type="number"
            v-model="usuario.numeroDocumento"
            placeholder="numeroDocumento"
          />
        </div>
        <div class="form-group text-left">
          <label for="">Nombre de Usuario</label>
        <input 
        type="text" 
        v-model="usuario.nombre" 
        placeholder="Nombre" />
        </div>
        <div class="form-group text-left">
          <label for="">Fecha de Nacimiento</label>
          <input
            type="date"
            v-model="usuario.fechaNacimiento"
            placeholder="FechaNacimiento"
          />
        </div>
        <div class="form-group text-left">
          <label for="">Numero de Telefono</label>
        <input
          type="number"
          v-model="usuario.telefono"
          placeholder="Telefono"
        />
        </div>
        
        <button type="submit" class="btn button">Registrarse</button>
        <button type="button" class="btn button" v-on:click="backLogin">
          Volver
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Registrar",

  data: function() {
    return {
      usuario: {
        correo: "",
        password: "",
        tipoDocumento: "",
        numeroDocumento: "",
        nombre: "",
        fechaNacimiento: "",
        telefono: "",
        administrador: false,
      },
    };
  },

  methods: {
    backLogin: function() {
      this.$router.push("login");
    },
    processSignUp: function() {
      axios
        .post("https://ferrotic.herokuapp.com/registro", this.usuario)
        .then((result) => {
          let dataSignUp = {
            token_access: result.data.access,
            token_refresh: result.data.refresh,
          };

          this.$emit("completedSignUp", dataSignUp);
        })
        .catch((error) => {
          console.log(error);
          alert("ERROR: Fallo en el registro.");
        });
    },
  },
};
</script>

<style>
.signUp_user {
  margin: 2rem 0px;
  padding: 0%;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.container_signUp_user {
  border: 3px solid var(--color-6);

  border-radius: 10px;
  height: 60%;
  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;
}

.signUp_user form {
  width: 70%;
}
.signUp_user input {
  height: 40px;
  width: 100%;

  box-sizing: border-box;

  padding: 10px 20px;

  /*margin: 5px 0;*/
}
.signUp_user button {
  width: 100%;
  height: 40px;
  background: var(--color-2);

  border-radius: 5px;

  padding: 10px 25px;

  margin: 5px 0 25px 0;
}
</style>
