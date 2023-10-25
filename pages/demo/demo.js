// pages/order/order.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        navbar: ['全部', '已支付', '已完成','待支付','已取消'],
        currentTab: 0,
    },
    // 改变顶部导航
    changeNavBar: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.tab_index
        })
    }
})
