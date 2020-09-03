<template>
  <div>
    <v-breadcrumbs :items="breadItems"></v-breadcrumbs>
    <v-card>
      <v-row>
        <v-col cols="2">
          <v-btn color="#5c9edf" class="white--text" @click="dialog = true">新增商品</v-btn>
        </v-col>
        <v-spacer/>
        <v-col>
          <v-btn-toggle mandatory>
            <v-btn >全部</v-btn>
            <v-btn >上架</v-btn>
            <v-btn >下架</v-btn>
          </v-btn-toggle>
        </v-col>
        <v-spacer/>
        <v-col cols="3">
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
        <!--删除编辑按钮-->
        <template v-slot:item.actions="{ item }">
          <v-icon color="blue" small lass="mr-2" @click="editItem(item.id)">mdi-pencil</v-icon>
          <v-icon color="error" small @click="deleteItem(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" width="800">
        <v-card>
          <v-card-title class="dialogColor white--text">
            <v-row>
              新增商品
              <v-spacer/>
              <v-btn icon class="white--text" @click="dialog=false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-row>
          </v-card-title>
<!--            步骤条-->
              <v-stepper v-model="e1">
                <v-stepper-header>
                  <v-stepper-step :complete="e1 > 1" step="1">基本信息</v-stepper-step>
                  <v-divider/>
                  <v-stepper-step :complete="e1 > 2" step="2">商品描述</v-stepper-step>
                  <v-divider/>
                  <v-stepper-step :complete="e1 > 3" step="3">规格参数</v-stepper-step>
                  <v-divider/>
                  <v-stepper-step step="4">SKU属性</v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <!--基本信息     -->
                  <v-stepper-content step="1">
                    <v-card>
                      <v-card-text>
                      <v-row>
                        <v-col>
                          <el-cascader
                                  :props="cprops"
                                  clearable
                                  placeholder="选择分类"
                                  ref="cascader"
                                  filterable
                                  v-model="goods.categories"
                                  :rules="{required: true, message: '分类不能为空'}"
                                  style="width: 100%">
                          </el-cascader>
                        </v-col>
                      </v-row>
                      <v-row>
                          <v-col>
                            <v-combobox label="所属品牌"
                                      v-model="goods.brandId"
                                      :items="brandTtems"
                                      item-text="name"
                                      item-value="id"
                                      :rules="[v => !!v || '品牌不能为空']" required>
                            </v-combobox>
                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                                  :counter="200"
                                  label="商品名称"
                                  required
                                  v-model="goods.name"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                                  :counter="200"
                                  label="商品卖点"
                                  required
                                  v-model="goods.subTitle"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-textarea
                                  dense
                                  rows="3"
                                  :counter="1000"
                                  label="包装清单"
                                  v-model="goods.spuDetail.packingList"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-textarea
                                  dense
                                  rows="3"
                                  :counter="1000"
                                  label="售后服务"
                                  v-model="goods.spuDetail.afterService"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn color="primary" @click="e1 = 2">
                          下一步
                        </v-btn>
                        <v-spacer/>
                      </v-card-actions>
                    </v-card>


                  </v-stepper-content>
              <!--  商品介绍，描述   -->
                  <v-stepper-content step="2">
                    <v-card>
                      <v-card-text>
                        <el-upload
                                action="http://api.haipi.com/api/upload/image/"
                                list-type="picture-card"
                                :auto-upload="true"
                                :on-success="successHandle"
                        >
                          <i slot="default" id="quill-upload" class="el-icon-plus"></i>
                        </el-upload>
                        <quill-editor
                                v-model="goods.spuDetail.description"
                                :options="editorOption"
                                ref="myEditor"
                        >
                        </quill-editor>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn color="primary" @click="e1 = 1">上一步</v-btn>
                        <v-btn color="primary" @click="e1 = 3">下一步</v-btn>
                        <v-spacer/>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
              <!--  规格参数   -->
                  <v-stepper-content step="3">
                    <v-card>
                      <v-card-text>

                        <v-flex class="xs10 mx-auto px-3">
                          <!--遍历整个规格参数-->
                          <v-card class="my-2">
                            <v-container grid-list-md fluid>
                              <v-layout wrap row justify-space-between class="px-5">
                                <v-flex xs12 sm5 v-for="param in specs" :key="param.name">
                                  <v-text-field :label="param.name" v-model="param.v" :suffix="param.unit || ''"
                                  />
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </v-card>
                        </v-flex>

                      </v-card-text>
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn color="primary" @click="e1 = 2">上一步</v-btn>
                        <v-btn color="primary" @click="e1 = 4">下一步</v-btn>
                        <v-spacer/>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
              <!--  sku属性   -->
                  <v-stepper-content step="4">
                    <v-card>
                      <v-card-text>
                        <v-flex class="mx-auto">
                          <!--遍历特有规格参数-->
                          <v-card flat v-for="spec in specialSpecs" :key="spec.name">
                            <!--特有参数的标题-->
                            <div class="subheading">{{spec.name}}:</div>
                            <!--特有参数的待选项，需要判断是否有options，如果没有，展示文本框，让用户自己输入-->
                            <v-card-text class="px-5">
                              <div v-for="i in spec.options.length+1" :key="i" class="layout row px-5">
                                <v-text-field :placeholder="'新的' + spec.name + ':'" class="flex xs10" auto-grow
                                              v-model="spec.options[i-1]" v-bind:value="i" single-line hide-details/>

                                <v-btn @click="spec.options.splice(i-1,1)" v-if="i <= spec.options.length" icon>
                                  <i class="el-icon-delete"/>
                                </v-btn>
                              </div>
                            </v-card-text>
                          </v-card>
                          <v-card class="elevation-0">
                            <!--标题-->
                            <div class="subheading py-3">SKU列表:</div>
                            <v-divider/>
                            <!--SKU表格，hide-actions因此分页等工具条-->
                            <v-data-table :items="skus" :headers="headersSku" item-key="indexes" class="elevation-0">
                              <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                  <!--价格和库存展示为文本框-->
                                  <td v-for="(v,k) in props.item" :key="k" v-if="['price', 'stock'].includes(k)"
                                      class="text-xs-center">
                                    <v-text-field single-line v-model="props.item[k]" @click.stop=""/>
                                  </td>
                                  <!--enable展示为checkbox-->
                                  <td class="text-xs-center" v-else-if="k === 'enable'">
                                    <v-checkbox v-model="props.item[k]"/>
                                  </td>
                                  <!--indexes和images不展示，其它展示为普通文本-->
                                  <td class="text-xs-center" v-else-if="k !== 'images' && k !== 'indexes'">{{v.v}}</td>
                                </tr>
                              </template>
                              <!--点击表格后展开-->
                              <template slot="expand" slot-scope="props">
                                <v-card class="elevation-2 flex xs11 mx-auto my-2">
                                  <!--图片上传组件-->
                                  <v-upload v-model="props.item.images" url="/upload/image"/>
                                </v-card>
                              </template>
                            </v-data-table>
                          </v-card>
                        </v-flex>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn color="primary" @click="e1 = 3">上一步</v-btn>
                        <v-btn color="primary">新增</v-btn>
                        <v-spacer/>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>

                </v-stepper-items>
              </v-stepper>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
  const toolBarOptions = [
    ['bold', 'italic',],
    ['link', 'image',],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }],
    [{ 'align': [] }]
  ];
  export default {
    props: {
      oldGoods: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      step: {
        type: Number,
        default: 1
      }
    },
    data: function () {
      let that = this;
      return {
        breadItems: [
          { text: '商品管理', disabled: false, href: '#', },
          { text: '商品列表', disabled: true, href: '#', }
        ],
        key: '',//搜索
        totalItems: 0, //总条数
        items: [],// 表格数据
        loading: false, //是否显示进度条
        options: {},// 分页信息
        saleable: true,//上下架
        headers: [//表头
          { text: 'id', align: 'start', value: 'id', sortable: false,},
          { text: '名称', value: 'title',sortable: false, },
          { text: '商品分类', value: 'cname',sortable: false, },
          { text: '品牌', value: 'brandName',sortable: false, },
          { text: '操作', value: 'actions', sortable: false,},
        ],
        dialog: false,//对话框
        e1: 1,//步骤条
        cprops: {//分类
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

        valid:false,
        brandTtems: [],//品牌选项
        goods: {
          categories: [], // 商品分类信息
          brandId: 0, // 品牌id信息
          title: "", // 标题
          subTitle: "", // 子标题
          spuDetail: {
            packingList: "", // 包装列表
            afterService: "", // 售后服务
            description: "" // 商品描述
          }
        },
        specs: [], // 规格参数的模板
        specialSpecs: [], // 特有规格参数模板

        content: "",//编辑器内容
        editorOption: {//编辑器
          //提示
          placeholder: "请输入...",
          //工具栏
          modules: {
            toolbar: {
              container: toolBarOptions,//工具栏
              handlers: {
                // 重写点击组件上的图片按钮
                'image': function (val) {
                    if (val){
                      document.getElementById("quill-upload").click();
                    }else {
                      alert("as")
                    }
                }
              }
            }

          }
        },

        val: "",
      }
    },
    created() {
      this.getGoodsData();
    },
    watch: {

      key: {
        handler() {
          this.getGoodsData();
          deep: true;
        }
      },
      options: {
        handler() {
          this.getGoodsData();
          deep: true;
        }
      },
      saleable: {
        handle() {
          this.getGoodsData();
        }
      },
      "goods.categories": {
        deep: true,
        handler(val) {
          //获取品牌
          this.$http.get("/item/brand/list?cid=" + this.goods.categories[2])
            .then(res => {
              this.brandTtems = res.data;
          })

          // 根据分类查询规格参数
          this.$http
                  .get("/item/spec/param?cid=" + this.goods.categories[2])
                  .then(({ data }) => {
                    let specs = [];
                    let template = [];
                    if (this.isEdit){
                      specs = JSON.parse(this.goods.spuDetail.genericSpec);
                      template = JSON.parse(this.goods.spuDetail.specialSpec);
                    }
                    // 对特有规格进行筛选
                    const arr1 = [];
                    const arr2 = [];
                    data.forEach(({id, name,generic, numeric, unit }) => {
                      if(generic){
                        const o = { id, name, numeric, unit};
                        if(this.isEdit){
                          o.v = specs[id];
                        }
                        arr1.push(o)
                      }else{
                        const o = {id, name, options:[]};
                        if(this.isEdit){
                          o.options = template[id];
                        }
                        arr2.push(o)
                      }
                    });
                    this.specs = arr1;// 通用规格
                    this.specialSpecs = arr2;// 特有规格
                  });
         }
      },

      oldGoods: {
        deep: true,
        handler(val) {
          if (!this.isEdit) {
            Object.assign(this.goods, {
              categories: null, // 商品分类信息
              brandId: 0, // 品牌id信息
              title: "", // 标题
              subTitle: "", // 子标题
              spuDetail: {
                packingList: "", // 包装列表
                afterService: "", // 售后服务
                description: "" // 商品描述
              }
            });
            this.specs = [];
            this.specialSpecs = [];
          } else {
            this.goods = Object.deepCopy(val);

            // 先得到分类名称
            const names = val.cname.split("/");
            // 组织商品分类数据
            this.goods.categories = [
              { id: val.cid1, name: names[0] },
              { id: val.cid2, name: names[1] },
              { id: val.cid3, name: names[2] }
            ];

            // 将skus处理成map
            const skuMap = new Map();
            this.goods.skus.forEach(s => {
              skuMap.set(s.indexes, s);
            });
            this.goods.skus = skuMap;
          }
        }
      },

    },
    methods: {
      successHandle(res,file,fileList) {
        console.log(res);
        let quill = this.$refs.myEditor.quill;
        // 获取光标所在位置
        const pos=quill.selection.savedRange.index;
        console.log(pos);
        // 插入图片到光标位置
        quill.insertEmbed(pos,'image',res.data[0].url);
        // 调整光标到最后
        quill.setSelection(length + 1);
        // loading动画消失
        this.quillUpdateImg = false;
      },
      editItem (id) {

      },

      deleteItem (id) {

      },
      async getGoodsData() {
        this.loading = true;
        const {data: res} = await this.$http.get("/item/goods/page",{
            params: {
              key: this.key,
              page: this.options.page,
              rows: this.options.itemsPerPage,
              saleable: this.saleable,
            }
          })
          this.items = res.items;
          this.totalItems = res.total;
          this.loading = false;
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

      submit() {
        // 表单校验。
        if(!this.$refs.basic.validate){
          this.$message.error("请先完成表单内容！");
        }
        // 先处理goods，用结构表达式接收,除了categories外，都接收到goodsParams中
        const {
          categories: [{ id: cid1 }, { id: cid2 }, { id: cid3 }],
          ...goodsParams
        } = this.goods;
        // 处理规格参数
        const specs = {};
        this.specs.forEach(({ id,v }) => {
          specs[id] = v;
        });
        // 处理特有规格参数模板
        const specTemplate = {};
        this.specialSpecs.forEach(({ id, options }) => {
          specTemplate[id] = options;
        });
        // 处理sku
        const skus = this.skus
                .filter(s => s.enable)
                .map(({ price, stock, enable, images, indexes, ...rest }) => {
                  // 标题，在spu的title基础上，拼接特有规格属性值
                  const title = goodsParams.title + " " + Object.values(rest).map(v => v.v).join(" ");
                  const obj = {};
                  Object.values(rest).forEach(v => {
                    obj[v.id] = v.v;
                  });
                  return {
                    price: this.$format(price), // 价格需要格式化
                    stock,
                    indexes,
                    enable,
                    title, // 基本属性
                    images: images ? images.join(",") : '', // 图片
                    ownSpec: JSON.stringify(obj) // 特有规格参数
                  };
                });
        Object.assign(goodsParams, {
          cid1,
          cid2,
          cid3, // 商品分类
          skus // sku列表
        });
        goodsParams.spuDetail.genericSpec = JSON.stringify(specs);
        goodsParams.spuDetail.specialSpec = JSON.stringify(specTemplate);

        this.$http({
          method: this.isEdit ? "put" : "post",
          url: "/item/goods",
          data: goodsParams
        })
                .then(() => {
                  // 成功，关闭窗口
                  this.$emit("close");
                  // 提示成功
                  this.$message.success("保存成功了");
                })
                .catch(() => {
                  this.$message.error("保存失败！");
                });
      }



    },

    computed: {
      skus() {
        // 过滤掉用户没有填写数据的规格参数
        const arr = this.specialSpecs.filter(s => s.options.length > 0);
        // 通过reduce进行累加笛卡尔积
        return arr.reduce(
                (last, spec, index) => {
                  const result = [];
                  last.forEach(o => {
                    spec.options.forEach((option, i) => {
                      const obj = JSON.parse(JSON.stringify(o));
                      obj[spec.name] = {v:option, id:spec.id};
                      obj.indexes = (obj.indexes || '') + '_' +  i
                      if (index === arr.length - 1) {
                        obj.indexes = obj.indexes.substring(1);
                        // 如果发现是最后一组，则添加价格、库存等字段
                        Object.assign(obj, {
                          price: 0,
                          stock: 0,
                          enable: false,
                          images: []
                        });
                        if (this.isEdit) {
                          // 如果是编辑，则回填sku信息
                          const sku = this.goods.skus.get(obj.indexes);
                          if (sku != null) {
                            const { price, stock, enable, images } = sku;
                            Object.assign(obj, {
                              price: this.$format(price),
                              stock,
                              enable,
                              images: images ? images.split(",") : [],
                            });
                          }
                        }
                      }
                      result.push(obj);
                    });
                  });
                  return result;
                },
                [{}]
        );
      },
      headersSku() {
        if (this.skus.length <= 0) {
          return [];
        }
        const headersSku = [];
        Object.keys(this.skus[0]).forEach(k => {
          let value = k;
          if (k === "price") {
            // enable，表头要翻译成“价格”
            k = "价格";
          } else if (k === "stock") {
            // enable，表头要翻译成“库存”
            k = "库存";
          } else if (k === "enable") {
            // enable，表头要翻译成“是否启用”
            k = "是否启用";
          } else if (k === "images" || k === 'indexes') {
            // 图片和索引不在表格中展示
            return;
          }
          headersSku.push({
            text: k,
            align: "center",
            sortable: false,
            value
          });
        });
        return headersSku;
      }
    }

  }
</script>

<style lang="less" scoped>

</style>
