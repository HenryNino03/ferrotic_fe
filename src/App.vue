<template>
  <header>
    <div
      class="d-flex flex-row justify-content-between mx-5 px-5 align-items-center"
    >
      <h1
        class="main-title flex-grow-1"
        v-bind:class="{ 'text-center': !is_auth }"
      >
        FerroTIC
      </h1>
      <ul class="nav">
        <li class="nav-item">
          <a
            class="nav-link fs-1"
            v-if="is_admin && is_auth"
            v-on:click="administracion"
            title="Administracion"
          >
            <i class="bi bi-gear-wide"></i>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link fs-1"
            v-if="!is_admin && is_auth"
            v-on:click="loadCarrito"
            title="Carrito"
          >
            <i class="bi bi-cart"></i>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link fs-1"
            v-if="is_auth"
            v-on:click="home"
            title="Home"
          >
            <i class="bi bi-house-door-fill "></i>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link" v-if="is_auth" v-on:click="logout" title="Logout">
            <i class="bi bi-box-arrow-right"></i>
          </a>
        </li>
      </ul>
    </div>
  </header>
  <router-view
    v-on:login="login"
    v-on:logout="logout"
    v-on:completedSignUp="completedSignUp"
  >
  </router-view>
</template>
<script>
export default {
  name: "App",

  data: function() {
    return {
      is_auth: false,
      is_admin: false,
    };
  },

  components: {},

  methods: {
    verifyAuth: function() {
      this.is_auth = localStorage.getItem("auth") == "true" || false;
      this.is_admin = localStorage.getItem("admin") == "true" || false;
      console.log(this.is_admin);
      console.log(this.is_auth);
      if (this.is_auth == false) this.$router.push({ name: "login" });
      else if (this.is_auth == true && this.is_admin == true)
        this.$router.push({ name: "administracion" });
      else this.$router.push({ name: "home" });
    },

    login: function(data) {
      localStorage.setItem("auth", true);
      localStorage.setItem("carrito", data.carrito);
      localStorage.setItem("admin", data.admin);
      localStorage.setItem("token_access", data.token_access);
      localStorage.setItem("token_refresh", data.token_refresh);
      this.verifyAuth();
    },

    completedSignUp: function(data) {
      alert("Registro Exitoso");
      this.login(data);
    },

    logout: function() {
      localStorage.clear();
      this.verifyAuth();
    },

    loadCarrito: function() {
      this.$router.push({ name: "carrito" });
    },

    administracion: function() {
      this.$router.push({ name: "administracion" });
    },
    home: function() {
      this.$router.push({ name: "home" });
    },
  },

  created: function() {
    this.verifyAuth();
  },
};
</script>
<style>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.6.1/font/bootstrap-icons.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css");
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap");
@import url(http://fonts.googleapis.com/css?family=Montserrat+Alternates);

:root {
  --color-1: #00ffc4;
  --color-2: #c05a7c;
  --color-3: #13a7cc;
  --color-4: #1abc9c;
  --color-5: #be7a91;
  --color-6: #d4efff;
}

.main-title {
  font-family: "Roboto Condensed", sans-serif;
  font-size: 4rem;
}
html,
body {
  min-height: 100%;
  min-width: 100%;
  background: var(--color-1);
  background: linear-gradient(10deg, var(--color-1) 0%, #ffffff 110%);
  margin: 0;
}
header {
  background-color: var(--color-2);
  padding-block: 2vw;
  border-end-end-radius: 40vw;
  border-end-start-radius: 40vw;
}

.button {
  background-color: var(--color-2);
  color: white;
}

.card-header {
  background: #f7f1db;
}

.nav-link {
  font-size: 3rem;
  color: black;
}
</style>
