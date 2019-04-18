import { baseUrl } from "../config/env";
import {api} from '../config/api'
/**
 * 登陆
 */
export const login=data => api.post('/signin', data);
/**
 * 退出
 */
// 商品列表
export const getProductList=data => api.get('/product/productList', data);
// 获取勾选的订单数据，验证
export const selectedOrderValide=data => api.get('/order/selectedOrderValide', data);
// 获取勾选的订单数据，进入发货页
export const getSelectedOrderList=data => api.get('/order/getSelectedOrderList', data);
// 创建发货单
export const postDelivery=data => api.post('/order/delivery', data);
// 订单中心--发货单列表
export const getOrderList=data => api.post('/order/orderList', data);
// 订单中心--退货单列表
export const getRefundOrderList=data => api.post('/refundOrder/orderList', data);
// 订单中心--退货单列表   报废
export const updateRefundStatus=data => api.post('/refundOrder/updateRefundStatus', data);
// 订单中心--退货单--导出表格
export const exportRefundExcel=data => api.post('/refundOrder/exportRefundExcel', data);
//上传图片
export const headImgUpload=data => api.post('/product/headImgUpload', data);
//添加单件商品
export const addOneProduct=data => api.post('/product/addProduct', data);
//添加商品之返回商品类目
export const getCategory=data => api.post('/product/category', data);
//获取商品品牌和商品属性
export const getBrandAndAttribute=data => api.post('/product/brandAndAttribute', data);
//更改订单列表供货码
export const updateBarCode=data => api.post('/order/updateBarCode', data);
//更改商品供货码
export const updateSkuMerForBarCode=data => api.post('/product/updateSkuMerForBarCode', data);
//更改商品供货价
export const updateSkuMerForSupplyPrice=data => api.post('/product/updateSkuMerForSupplyPrice', data);
//更改商品自有库存
export const updateSkuMerForSelfStock=data => api.post('/product/updateSkuMerForSelfStock', data);
//我的商品 库存详情查询
export const getStockDetailList=data => api.get('/product/stockDetailList', data);
//获取我的商品详情信息
export const getProductDetail=data => api.get('/product/productDetail', data);
//获取返回我的商品详情信息
export const updateSkuMerForStatus=data => api.post('/product/updateSkuMerForStatus', data);
//删除商品
export const deleteSkuMerForStatus=data => api.post('/product/delProducts', data);
// 下载批量导入商品模板
export const downloadTemplateSkuMer=data => api.get('/product/downloadTemplate', data);
// excel批量导入商品
export const addExcelProduct=data => api.post('/product/addExcelProduct', data);

//订单列表点击商品缺货
export const outOfStock=data => api.post('/order/outOfStock', data);
//发货单商品缺货
export const deliveryOutOfStock=data => api.post('/deliveryOrder/outOfStock', data);
//获取订单下的商品列表
export const getOrderGoodList=data => api.get('/order/getOrderGoodList', data);
//获取生成备货单勾选数据
export const getPrepareList=data => api.get('/product/prepareOrder',data);
//获取供应商信息
export const getMerchantInfo=data => api.get('/getMerchantInfo',data);
//生成备货单
export const createPrepareOrder=data => api.post('/product/createPrepareOrder',data);

//获取发货单列表
export const deliveryOrderList=data => api.get('/deliveryOrder/deliveryOrderList', data);
export const deliveryOrderDetail=data => api.get('/deliveryOrder/deliveryOrderDetail',data);
export const exportProducts=data => api.get('/product/exportProducts',data);
//批量导出发货单列表数据到Excel表格
export const exportDeliveryOrderExcel=data => api.get('/deliveryOrder/exportDeliveryOrderExcel', data);
//获取质检未通过（异常）状态的发货单商品列表
export const getDeliveryOrderLackList=data => api.get('/deliveryOrder/getDeliveryOrderLackList', data);
//创建补货单
export const postDeliveryRep=data => api.post('/deliveryOrder/deliveryRep', data);

//获取账单列表
export const billList=data => api.get('/bill/billList', data);

//获取首页订单数据
export const indexOrderData=data => api.get('/index/orderData', data);
//获取首页商品统计
export const indexGoodsData=data => api.get('/index/goodsData', data);
//获取首页账单统计
export const indexBillData=data => api.get('/index/billData', data);

//获取投标商品列表
export const bidProduceList=data => api.get('/product/bidProduceList', data);
//获取投标商品详情
export const spuProDetail=data => api.get('/product/spuProDetail', data);
//投标商品供货数据获取
export const askProduceSkuList=data => api.get('/product/askProduceSkuList', data);
//商品列表-点击供货-获取sku下所有兄弟姐妹sku接口
export const askProductSkuListForSup=data => api.get('/product/askProductSkuListForSup', data);
//投标商品供货~
export const bidGoods=data => api.post('/product/bidGoods', data);
//商品列表-点击供货-投标商品供货~
export const bidGoodsForSup=data => api.post('/product/bidGoodsForSup', data);
//修改公司信息
export const updateCompany=data => api.post('/updateCompany', data);
//修改经营信息
export const updateSaleInfo=data => api.post('/updateSaleInfo', data);
//修改联系方式
export const updateContactInfo=data => api.post('/updateContactInfo', data);
//修改银行方式
export const updateCardBank=data => api.post('/updateCardBank', data);
//编辑商品
export const updateProduct=data => api.post('/product/updateProduct', data);
//修改密码
export const modifyPassWord=data => api.post('/modifyPassWord', data);
//添加商品 --跟卖商品
export const existToSell=data => api.post('/product/existToSell', data);
//账单详情
export const getbillDetails=data => api.post('/bill/billDetails', data);
//供应商资料
export const getEnumList=data => api.get('/getEnumList', data);
