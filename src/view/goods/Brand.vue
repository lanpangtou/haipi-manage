<template>
  <div>
    <v-breadcrumbs :items="breadItems"></v-breadcrumbs>
    <v-card>
      <v-row>
        <v-col cols="2">
          <v-btn color="#5c9edf" style="color: white" @click="showDialong">新增品牌</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4">
          <v-text-field
                  v-model="key"
                  :counter="10"
                  label="搜索"
                  append-icon="search"
                  hide-details
                  single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
              :headers="headers"
              :items="items"
              :server-items-length="totalItems"
              :loading="loading"
              :options.sync="options"
              class="elevation-1"
              loading-text="loadding..."
      >
<!--        自定应列 展示logo-->
        <template v-slot:item.image="{ item }">
          <img v-if="!!item.image" :src="item.image" width="102px" height="36"/>
        </template>
<!--         删除编辑按钮-->
        <template v-slot:item.actions="{ item }">
          <v-icon color="blue" small lass="mr-2" @click="editItem(item.id)">mdi-pencil</v-icon>
          <v-icon color="error" small @click="deleteItem(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
<!--        对话框-->
      <v-dialog v-model="dialong" max-width="600" scrollable v-if="dialong">
        <v-card>
          <v-toolbar class="blue-grey white--text">
            <v-toolbar-title>{{isEdit ? '修改品牌' : '新增品牌'}}</v-toolbar-title>
            <v-spacer/>
            <v-btn icon @click="dialong = false">
              <v-icon class="white--text">close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="px-5 py-2">
              <v-form ref="form">
                  <v-text-field
                          v-model="brand.name"
                          label="品牌名称"
                          :rules="[v => !!v || '品牌名称不能为空']"
                          :counter="20"
                          single-line
                          required
                  ></v-text-field>
                  <v-text-field
                          v-model="brand.letter"
                          label="letter"
                          :rules="[v => !!v || '首字母不能为空', v => v.length === 1 || '长度只能是1位']"
                          single-line
                          required
                  ></v-text-field>
              </v-form>
              <v-row>
                  <v-col>
                      <el-cascader
                          :props="props"
                          clearable
                          placeholder="选择分类 多选"
                          ref="cascader"
                          filterable
                          v-model="categories"
                          :rules="{required: true, message: '请选择分类'}"
                          style="width: 100%">
                      </el-cascader>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col>
                      选择LOGO：
                      <el-upload
                              action="http://api.haipi.com/api/upload/image/"
                              list-type="picture-card"
                              :auto-upload="false"
                              ref="upload"
                              :on-success="handleSuccessImge"
                              :on-preview="handlePictureCardPreview"
                              :on-remove="handleRemove"
                          >
                          <i slot="default" class="el-icon-plus"></i>
                      </el-upload>
                      <el-dialog :visible.sync="dialogVisible">
                          <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                  </v-col>
              </v-row>
          </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="addBrand">新增</v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card>
  </div>
</template>

<script>
    export default {
      data: function (){
        let that = this;
        return {
            breadItems: [  //面包屑导航
                { text: '商品管理', disabled: false, href: '#', },
                { text: '品牌管理', disabled: true, href: '#', }
            ],
            dialogImageUrl: '',
            dialogVisible: false,
            dialong: false,//图片放大对话框
            key: "", //搜索
            totalItems: 0, //总条数
            items: [],// 表格数据
            loading: false,  //是否显示进度条
            options: {},// 分页信息
            headers: [//表头
                {text: 'id', align: 'center',  value: 'id'},
                {text: '品牌名', align: 'center', sortable: false, value: 'name'},
                {text: 'LOGO', align: 'center', sortable: false, value: 'image'},
                {text: 'letter', align: 'center', sortable: true, value: 'letter'},
                {text: '操作', align: 'center', sortable: false,value: "actions"}
            ],
            isEdit: false, // 判断是编辑还是新增
            categories: [],//分类id
            brand: {
                name: "",
                image: "",
                letter: "",
                cids: []
            },
            props: {
                multiple: true,
                checkStrictly: true,
                lazy: true,
                async lazyLoad(node,resolve){
                    const { level,value,leaf } = node;
                    //如果节点大于2置为空，防止继续加载
                    if (level > 2) return resolve([]);
                    that.getCategoryData(value || 0).then(res=>{
                        const nodes = res.map(item=>({
                            value: item.id,
                            label: item.name,
                            leaf: level >= 2
                        }))
                        resolve(nodes);
                    })
                }
            },
        }
      },
    mounted() {
        this.getBrandData();
    },
    watch: {
      key: {
        handler() {
          this.getBrandData();
          deep: true;
        }
      },
      options: {
        handler() {
          this.getBrandData();
          deep: true;
        }
      }

    },
    methods: {
      //初始化brand列表
    async getBrandData() {
        this.loading = true;
          const {data: res} = await this.$http.get ("/item/brand/page",{
          params: {
            key: this.key,
            page: this.options.page,
            rows: this.options.itemsPerPage,
            sortBy: this.options.sortBy[0],
            desc: this.options.sortDesc[0],
          }
        })
          this.items = res.items;
          this.totalItems = res.total;
          this.loading = false;
      },
      showDialong() {
          this.dialong = true;
          this.isEdge = true;
      },
      editItem(id) {
      },
      deleteItem(id) {
      },
      handleRemove(file) {
        console.log(file.fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
        //获取category分类
      getCategoryData(pid){
        return new Promise((resolve)=> {
            this.$http.get("item/category/clist",{
                params: {
                    pid: pid
                }
            }).then(res=> {
                resolve(res.data)
            })
        })
      },
        //新增品牌
      addBrand() {
          if (this.$refs.form.validate() &&  this.categories.length != 0) {
              let ids = [];
              for (let i = 0; i < this.categories.length; i++) {
                  let id = this.categories[i][2];
                  ids.push(id);
              }
              this.brand.cids = ids;
              //上传图片
              this.$refs.upload.submit();
              this.$http.post("/item/brand/addBrand",this.$qs.stringify(this.brand,{indices: false}))
                  .then(res=> {
                  this.$message.success("新增成功");
                  this.dialong = false;
              }).catch(()=>{
                  this.$message.error("新增失败");
              })
          }
      },
        //图片上传成功
      handleSuccessImge(value) {
          this.brand.image = value;
      }
    }
  }
</script>

<style lang="less" scoped>


</style>
