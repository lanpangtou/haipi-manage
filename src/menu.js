var menus = [
  {
    action: 'home',
    title: '首页',
    path: '/home',
    items: [
      {title: '控制台',path: '/control'}
    ]
  },
  {
    action: 'mdi-apps',
    title: '商品管理',
    active: true,
    path: '/goods',
    items: [
      { title: '商品分类',path: '/category'},
      { title: '商品列表',path: '/list'},
      { title: '品牌管理',path: '/brand'},
      { title: '规格参数',path: '/spec-parameters'},
    ],
  },
  {
    action: 'shopping_cart',
    title: '订单管理',
    path: '/order',
    items: [
      { title: '已付款',path: '/home'},
      { title: '已取消',path: '/home'}
    ],
  },
  {
    action: 'people',
    title: '用户管理',
    path: '/user',
    items: [
      { title: '用户列表',path: '/list'},
    ],
  }
]

export default menus;
