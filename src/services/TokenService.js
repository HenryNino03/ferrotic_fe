import axios from "axios";
import jwt_decode from "jwt-decode";

export default class TokenServices {
  async getToken() {
    if (
      localStorage.getItem("token_access") === null ||
      localStorage.getItem("token_refresh") === null
    ) {
      return null;
    }
    await this.verifyToken();
    return localStorage.getItem("token_access");
  }

  verifyToken() {
    console.log(localStorage.getItem("token_refresh"));
    return axios
      .post("https://ferrotic.herokuapp.com/refresh", {
        refresh: localStorage.getItem("token_refresh"),
      })
      .then((result) => {
        localStorage.setItem("token_access", result.data.access);
      })
      .catch(() => {});
  }
}
