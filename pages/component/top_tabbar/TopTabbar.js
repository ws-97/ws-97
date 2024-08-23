// const { default: Color } = require("XrFrame/math/color");

// pages/component/top_tabbar/TopTabbar.js
var App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabList:Object,
    // tabTextColor:COlor.BLACK,
    // tabBackgroundColor:Color.WHITE
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      // 获取索引
      const {index} = e.currentTarget.dataset;
      this.properties.tabList[index].isActive=true
      this.setData()
      console.log('index',index,"e:",e,"this.properties.tabList:",this.properties.tabList)
      // 触发 父组件的事件
      this.triggerEvent("tabsItemChange",{index})
    }
  }
})
