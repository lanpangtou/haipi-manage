<template>
  <div>
    <v-breadcrumbs :items="breadItems"></v-breadcrumbs>

    <v-card>
      <el-tree
              :props="props"
              :load="loadNode"
              lazy
              accordion
              show-checkbox>
          <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => append(data)">
            添加
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>

      </el-tree>
    </v-card>
  </div>
</template>

<script>
  export default {
    data: () => ({
      breadItems: [
        { text: '商品管理', disabled: false, href: '#', },
        { text: '商品分类', disabled: true, href: '#', }
      ],
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },

    }),
    methods: {
      //加载分类列表
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.getCategoryData(0).then(res=> {
            const data = res.map(item=>({
              id: item.id,//记录节点id
              name: item.name,
            }))
            return resolve(data);
          })
        }
        //如果节点大于2置为空
        if (node.level > 2) return resolve([]);
        if (node.level >= 1) {
          this.getCategoryData(node.data.id).then(res=> {
            const data = res.map(item=>({
              id: item.id,
              name: item.name,
            }))
            resolve(data);
          })
        }

      },
      //获取category数据
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

      append(data) {
        console.log(data);
        // const newChild = { id: id++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }
        // data.children.push(newChild);
      },

      remove(node, data) {
        console.log(node);
        console.log(data);
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
      },

    }
}
</script>

<style lang="less" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
