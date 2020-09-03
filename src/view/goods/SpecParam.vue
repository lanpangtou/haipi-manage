<template>
    <div>
        <v-breadcrumbs :items="breadItems"></v-breadcrumbs>
        <v-card>
           <v-card-text>
               <v-row>
                   <v-col cols="3">
                       <v-treeview
                               :active.sync="active"
                               :open.sync="open"
                               :items="categoryList"
                               :load-children="getChildren"
                               open-on-click
                               return-object
                               activatable
                               @update:active="getSpecGroup"
                               transition
                               dense
                       >
                       </v-treeview>
                   </v-col>
                   <v-divider vertical></v-divider>
<!--                 规格组-->
                   <v-col cols="8.9" v-show="showGroup">
                       <v-row>
                           <v-spacer></v-spacer>
                           <v-btn @click="groupDialog=true"  color="#4fc3f7"class="white--text">新增规格</v-btn>
                       </v-row>
                       <v-data-table
                               :headers="groupHeaders"
                               :items="groupItems"
                               @click:row="getSpecParam"
                               v-show="showGroup"
                               class="elevation-1"
                               loading-text="loadding..."
                               no-data-text="暂时没有分组信息"
                       >
                       </v-data-table>
                   </v-col>
<!--                   规格参数表格-->
                   <v-col cols="8.9" v-show="showParam">
                       <v-row>
                           <v-spacer></v-spacer>
                           <v-btn color="#4fc3f7" style="color:white;">新增参数</v-btn>
                       </v-row>
                       <v-data-table
                               :headers="paramHeaders"
                               :items="paramItems"
                               class="elevation-1"
                               loading-text="loadding..."
                               no-data-text="暂时没有参数信息"
                       >
                       </v-data-table>
                   </v-col>
               </v-row>
           </v-card-text>
        </v-card>
<!--        新增规格对话框-->
        <v-dialog v-model="groupDialog" max-width="300px">
            <v-card>
                <v-card-title  class="blue-grey white--text">
                    <span>新增规格组</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="specGroup.name" hide-details label="规格组" required single-line></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue white--text" @click="addSpecGroup">新增</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--        新增规格对话框-->
        <v-dialog v-model="groupDialog" max-width="300px">
            <v-card>
                <v-card-title  class="blue-grey white--text">
                    <span>新增规格参数</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="specGroup.name" hide-details label="规格组" required single-line></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue white--text" @click="addSpecGroup">新增</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                breadItems: [
                    { text: '商品管理', disabled: false, href: '#', },
                    { text: '规格参数', disabled: true, href: '#', }
                ],
                groupHeaders: [//规格组表头
                    {text: 'id', align: 'center',  value: 'id'},
                    {text: '规格组', align: 'center', sortable: false, value: 'name'},
                ],
                paramHeaders: [//规格参数表头
                    {text: 'id', align: 'center',  value: 'id'},
                    {text: '规格参数', align: 'center', sortable: false, value: 'name'},
                    {text: '数值类型', align: 'center', sortable: false, value: 'numeric'},
                    {text: '单位', align: 'center', sortable: false, value: 'unit'},
                    {text: 'sku通用属性', align: 'center', sortable: false, value: 'generic'},
                ],
                groupItems: [],//规格组项
                paramItems: [],//规格参数项
                showGroup: false,
                showParam: false,
                open: [],
                active: [],
                categoryList: [],//
                groupDialog: false,//是否显示新增规格组对话框
                specGroup: {
                    cid: 0,
                    name: "",
                }
            };
        },

        created() {
            this.getCategoryData(0);
        },
        watch: {
        },
        methods: {
            // 获取分类列表
            getCategoryData(pid) {
                this.$http.get("/item/category/clist", {
                        params: {
                            pid: pid
                        }
                    })
                    .then(resp => {
                        if (resp.status != 200) {
                            this.$message.error("获取分类列表失败");
                        }
                        resp.data.forEach(el => {
                            el._name = el.name;
                            if (el.isParent) {
                                el.children = [];
                            }
                        });
                        this.categoryList = resp.data;
                    });
            },
            // 子分类懒加载
            getChildren(item) {
                return this.$http.get("/item/category/clist", {
                        params: {
                            pid: item.id
                        }
                    })
                    .then(resp => {
                        if (resp.status != 200) {
                            this.$message.error("获取分类列表失败");
                        }
                        resp.data.forEach(el => {
                            el._name = item._name + "," + el.name;
                            if (el.isParent) {
                                el.children = [];
                            }
                        });
                        item.children.push(...resp.data);
                    });
            },
            //获取规格组
            getSpecGroup(val) {
                this.showParam = false;
                this.showGroup = true;
                this.specGroup.cid = val[0].id;
                this.$http.get("/item/spec/page/"+ this.specGroup.cid )
                .then(res => {
                    this.groupItems = res.data;
                })
                .catch(()=> {
                    this.groupItems = [];
                })
            },
            //获取规格组参数
            getSpecParam(val) {
                this.showGroup = false;
                this.showParam = true;
                this.$http.get("/item/spec/param?gid="+ val.id)
                    .then(res => {
                        if (res.data == null) {
                            this.paramItems = [];
                        }
                        this.paramItems = res.data;
                    })
                    .catch(()=> {
                        this.paramItems = [];
                    })
            },
            //新增规格组
            addSpecGroup() {
                this.$http.post("/item/spec/addSpecGroup",this.$qs.stringify(this.specGroup))
                .then(res=> {
                    this.$message.success("新增成功");
                    this.groupName = "";
                })
                .catch(()=> {
                    this.$message.error("新增失败");
                })
            }
        }
    }
</script>

