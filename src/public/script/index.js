let before_category = '';
function get_categorys() {
    let isuSrtCd = document.getElementById('isuSrtCd');
    let checker = document.getElementById('check_isuSrtCd');
    let result_textarea = document.getElementById('result_categorys_textarea');
    let category_btn = document.getElementById('category_btn');
    let ok = '등록된 카테고리가 없습니다'
    let no = '등록된 카테고리가 있습니다'
    let way = '카테고리를 입력해주세요\n항목은 쉼표(,)로 구분해주세요'

    fetch('/get_categorys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'isuSrtCd': isuSrtCd.value
        })
    })
    .then(res => {
        if(res.status === 200) return res.json();
        else console.log(res.statusText);
    })
    .then(json => {
        result_textarea.innerHTML = '';
        result_textarea.innerHTML = jsonarray_to_comma(json[0].category, ',');
        before_category = result_textarea.innerHTML;
        checker_toggle(1, checker, no);
        set_readonly(result_textarea, true);
        category_btn.value = "수정"
        console.log(`Success: ${json[0].category}`);
    })
    .catch(err => {
        result_textarea.innerHTML = '';
        result_textarea.setAttribute('placeholder', way);
        before_category = '';
        checker_toggle(0, checker, ok);
        set_readonly(result_textarea, true);
        category_btn.value = "추가"
        console.log(`Failure: ${JSON.stringify(err)}`);
    })
}

function set_readonly(target, OnOff) {
    let attribute_readonly = 'readonly';
    if(OnOff)
        target.setAttribute(attribute_readonly, attribute_readonly);
    else
        target.removeAttribute(attribute_readonly);
}

function readonly_toggle(target) {
    let attribute_readonly = 'readonly';
    if (target.hasAttribute(attribute_readonly) == false)
        target.setAttribute(attribute_readonly, attribute_readonly);
    else
        target.removeAttribute(attribute_readonly);
}

function checker_toggle(check, id, announce) {
    if(check == 1) {
        id.classList.remove('checker_ok');
        id.classList.add('checker_error');
        id.innerHTML = announce;
    } else {
        id.classList.remove('checker_error');
        id.classList.add('checker_ok');
        id.innerHTML = announce;
    }
}

function display_toggle(target) {

}

function insert_categorys() {
    let isuSrtCd = document.getElementById('isuSrtCd');
    let result_textarea = document.getElementById('result_categorys_textarea');
    let category_btn = document.getElementById('category_btn');
    
    if(category_btn.value == '수정' || category_btn.value == '추가') {
        result_textarea.removeAttribute('readonly');
        result_textarea.focus();
        category_btn.value = '완료';
        return;
    }
    if(isuSrtCd.value == undefined || isuSrtCd.value == '') {
        console.log('종목코드를 넣어주세요');
        return;
    }
    if(result_textarea.value == undefined || result_textarea.value == '') {
        console.log('카테고리를 추가해주세요');
        return;
    }

    let before_category_array = split(before_category, ',');
    let current_category_array = split(result_textarea.value, ',');

    let delete_category_array = check_remove_array(before_category_array, current_category_array);
    let add_category_array  = check_remove_array(current_category_array, before_category_array);

    console.log(`d: ${delete_category_array}`);
    console.log(`a: ${add_category_array}`);

    fetch('/insert_categorys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'isuSrtCd': isuSrtCd.value,
            'categorys': split_and_link(result_textarea.value, ','),
            'array_to_json': array_to_json(result_textarea.value, ','),
            'delete_array': JSON.stringify(delete_category_array),
            'add_array': JSON.stringify(add_category_array)
        })
    })
    .then(res => {
        if(res.status === 200) return res.json();
        else console.log(res.statusText);
    })
    .then(json => {
        console.log(`Result: ${json[0].result}`);
    })
    .catch(err => {
        console.log(`Result: ${JSON.stringify(err)}`);
    })
}

function split(value, sign) {
    let temp_split = value.split(sign);
    for(let i = 0; i < temp_split.length; i++) {
        temp_split[i] = temp_split[i].trim();
    }
    return temp_split;
}

function split_and_link(value, sign) {
    let temp_split = split(value, sign)
    let link = '';
    for(let i = 0; i < temp_split.length; i++) {
        link += temp_split[i] + sign;
    }
    return link.replace(/.$/, '');
}

function jsonarray_to_comma(json_array, sign) {
    let link = '';
    for(let i = 0; i < json_array.length; i++) {
        link += json_array[i] + sign
    }
    return link.replace(/.$/, '');
}

function array_to_json(value, sign) {
    let temp_split = split(value, sign)
    return JSON.stringify(temp_split);
}

function check_remove_array(before_array, cur_array) {
    let temp = [];
    for(let i = 0; i < before_array.length; i++) {
        for(let j = 0; j < cur_array.length; j++) {
            if(before_array[i] == cur_array[j])
                break;
            if(j == cur_array.length - 1)
                temp.push(before_array[i]);
        }
    }
    return temp;
}