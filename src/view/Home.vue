<template>
  <v-app id="inspire">
    <!--    侧边戴航栏-->
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list>
        <v-list-group
          v-for="item in sidenav"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <!--       一级导航-->
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-divider></v-divider>
          <!--      二级导航-->
          <v-list-item
            v-for="subItem in item.items"
            :key="subItem.title"
            @click=""
            :to="item.path + subItem.path"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <!--顶部应用导航栏-->
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="#4FC3F7"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">嗨皮商城后台管理</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>

    </v-app-bar>
    <!--    conten区域-->
    <v-main>
      <v-container fluid>
         <div>
           <router-view/>
         </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import menu from '../menu'
  export default {
    props: {
      source: String,
    },
    data: () => ({
      dialog: false,
      drawer: null,
      sidenav: []
    }),
    computed: {

    },
    methods: {

    },
    created () {
      this.sidenav = menu;
    }
  }
</script>

<style lang="less" scoped>

</style>
