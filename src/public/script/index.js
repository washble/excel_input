function get_categorys() {
    let isuSrtCd = document.getElementById('isuSrtCd');
    let checker = document.getElementById('check_isuSrtCd');
    let result_textarea = document.getElementById('result_categorys_textarea');
    let ok = '등록된 카테고리가 없습니다'
    let no = '등록된 카테고리가 있습니다'

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
        result_textarea.innerHTML = JSON.stringify(json[0].category);
        checker_toggle(1, checker, no);
        console.log(`Success: ${json[0].category}`);
    })
    .catch(err => {
        result_textarea.innerHTML = ok;
        checker_toggle(0, checker, ok);
        console.log(`Failure: ${JSON.stringify(err)}`);
    })
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

function insert_categorys() {
    let isuSrtCd = document.getElementById('isuSrtCd');
    let insert_textarea = document.getElementById('insert_textarea');

    if(isuSrtCd.value == undefined || isuSrtCd.value == '') {
        console.log('종목코드를 넣어주세요');
        return
    }
    if(insert_textarea.value == undefined || insert_textarea.value == '') {
        console.log('카테고리를 추가해주세요');
        return
    }

    fetch('/insert_categorys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'isuSrtCd': isuSrtCd.value,
            'categorys': split_and_link(insert_textarea.value, ','),
            'array_to_json': array_to_json(insert_textarea.value, ',')
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

function array_to_json(value, sign) {
    let temp_split = split(value, sign)
    return JSON.stringify(temp_split);
}