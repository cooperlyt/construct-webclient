import { FormControl, ValidationErrors, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class IdentityNumberParentMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return ((control.parent.invalid && control.parent.getError('identity')) || control.invalid ) && control.touched;
    }
}

export function identityNoValidator(input: FormControl): ValidationErrors | null {
    const value = input.value;
    if (checkCode(value)) {
        //console.log('checkCode');
        let date = value.substring(6, 14);
        if (checkDate(date)) {
            //console.log('checkDate');
            if (checkPro(value.substring(0, 2))) {
                console.log('checkPro');
                    return null;
            } else {
                return {'identity': 'location'};
            }
        } else {
            return {'identity': 'date'};
        }
    } else {
        return {'identity': 'code'};
    }
}
function checkCode(val: string) {
    let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    // 17 位加权因子
    let divisor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码列表mod11,对应校验码字符值
    let validCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    if (!reg.test(val)) {
        console.log('正则表达式未通过');
        return false;
    } else {
        let sum = 0;
        for (let i = 0; i < 17; i++) {
            // 17位每一位数 乘以加权因子 的 和
            sum += Number.parseInt(val[i]) * divisor[i];
        }
        let index = sum % 11;
        return validCode[index].toUpperCase() === val[17];
    }
 
}
// 检查日期
function checkDate(val: string) {
    const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if (pattern.test(val)) {
        const year = val.substring(0, 4);
        const month = val.substring(4, 6);
        const date = val.substring(6, 8);
        const date2 = new Date(year + '-' + month + '-' + date);
        return date2 && date2.getMonth() === (parseInt(month) - 1);
    }
    return false;
}
// 检查省市编号
function  checkPro(val: string) {
    const pattern = /^[1-9][0-9]/;
    const provs = {11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ',
        31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ',
        43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ',
        61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门'};
    if (pattern.test(val)) {
        return !!provs[val];
    }
    return false;
}
