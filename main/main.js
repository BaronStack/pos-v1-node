var datbase = require('./datbase');
var loadAllItems = datbase.loadAllItems();
var dicount_obj = datbase.loadPromotions();
module.exports = function main(inputs) {
    let pre_result_of_first_form = caculateItemForm(inputs,dicount_obj);
    let pre_result_of_second_form = caculateSendItemForm(pre_result_of_first_form,dicount_obj);
    // console.log(pre_result_of_second_form);
    let result_string = getString(pre_result_of_first_form,pre_result_of_second_form);
    let sum = 0;
    for (let item of pre_result_of_first_form) {
        sum += item.sum;
    }
    let save = 0;
    for (let item of pre_result_of_second_form) {
        save += item.price;
    }
    result_string += '总计：'+ sum.toFixed(2) + '(元)\n' + '节省：' + save.toFixed(2) + '(元)\n' + '**********************';
    console.log(result_string);
    return result_string;
}

function caculateItemForm(inputs,dicount_obj) {
    let result = caculateCount(inputs);
    let newResult = [];
    // console.log(result);
    for (let item of result) {
        let newObj = item;
        newObj.sum = item.price * item.count;
        newResult.push(newObj);
        for(let term of dicount_obj[0].barcodes){
            if(term === item.barcode){
                newObj.sum = item.price * (item.count - 1);
            }
        }
    }
    return newResult;
}

function caculateCount(inputs) {
    let numList = [];
    let result = [];
    let flag = 0;
    for (let item of inputs) {
        for(let ObjItem of result){
            if(ObjItem.key === item){
                ObjItem.count ++;
                flag ++;
            }else {
                flag = 0;
            }
        }
        if(flag === 0){
            if(item.includes("-")){
                let arr = item.split("-");
                let obj = {key:arr[0], count : arr[1]};
                result.push(obj);
            }else{
                let obj = {key:item , count :　1};
                result.push(obj);
            }
        }
    }
    for(let item of loadAllItems){
        for(let objItem of result ){
            if(objItem.key === item.barcode){
                let  newobj = item;
                newobj.count = objItem.count;
                numList.push(newobj);
            }
        }

    }
    // console.log(ListItems);
    return numList;
}

function findBarcode(discount_obj,item) {
    for (let term of discount_obj[0].barcodes) {
        if (item.barcode === term) {
            return true;
            break;
        }
    }
    return false;
}
function caculateSendItemForm(pre_result_of_first_form,discount_obj) {
    let result = [];
    for (let item of pre_result_of_first_form) {
        if (findBarcode(discount_obj,item)) {
            if (item.count >= 2) {
                let newObj = item;
                item.num = 1;
                result.push(newObj);
            }
        }
    }
    return result;
}
function getString(pre_result_of_first_form,pre_result_of_second_form) {
    let str = '***<没钱赚商店>购物清单***\n';
    for (let item of pre_result_of_first_form) {
        str += '名称：' + item.name + '，数量：' + item.count+ item.unit + '，单价：' + (item.price).toFixed(2) + '(元)，小计：' + (item.sum).toFixed(2) + '(元)\n';
    }
    str += '----------------------\n' + '挥泪赠送商品：\n';
    // console.log(pre_result_of_second_form);
    for (let term of pre_result_of_second_form) {
        str += '名称：' + term.name + '，数量：' + term.num + term.unit + '\n';
    }
    str += '----------------------\n';
    return str;
}