<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-main>
          <v-container
            class="fill-height"
            fluid
          >
            <v-row
              align="center"
              justify="center"
            >
              <v-col
                cols="12"
                sm="8"
                md="4"
              >
                <v-card class="elevation-12">
                  <v-toolbar
                    color="primary"
                    dark
                    flat
                  >
                    <v-toolbar-title>嗨皮商城后台管理登录</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          :href="source"
                          icon
                          large
                          target="_blank"
                          v-on="on"
                        >
                          <v-icon>mdi-code-tags</v-icon>
                        </v-btn>
                      </template>
                      <span>Source</span>
                    </v-tooltip>
                  </v-toolbar>
                  <v-card-text>
                    <v-form ref="loginform">
                      <v-text-field
                        label="Login"
                        :counter="10"
                        :rules="nameRules"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="loginform.username"
                      ></v-text-field>

                      <v-text-field
                        id="password"
                        label="Password"
                        prepend-icon="mdi-lock"
                        type="password"
                        :counter="10"
                        :rules="passwordRules"
                        v-model="loginform.password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="login">Login</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-app>
    </v-app>
  </div>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: function(){
      return {
        loginform: {
          username: "zhangsan",
          password: "1234",
        },
        valid: true,
        name: '',
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        passwordRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
      }
    },
    methods: {
      login() {
        this.$http.post("user/login",this.loginform).then(function (res) {
            console.log(res.data)
        })

      }
    }
  }
</script>

<style>

</style>
