function Validator(obj) {
    //Object ho tro xu li nhieu rule tren 1 field
    let selectorRules = {};
    //Cac ham ho tro:
    function validate(inputElem, rule, errorElem) {
        //Mang cac rules gang buoc cho 1 field
        let rules = selectorRules[rule.selector];
        let errorMessage;
        //Kiem tra tung rule cho filed, chi can 1 loi la xong
        for (let i = 0; i < rules.length; i++) {
            switch (inputElem.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElem.querySelector(rule.selector + ':checked')
                    )
                    break;
                default:
                    errorMessage = rules[i](inputElem.value);
            }
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElem.innerText = errorMessage;
            inputElem.closest(obj.formGroupSelector).classList.add('invalid');
        } else {
            errorElem.innerText = '';
            inputElem.closest(obj.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }

    function inspect(inputElem, rule, errorElem) {
        errorElem.innerText = null;
        inputElem.closest(obj.formGroupSelector).classList.remove('invalid');
    }

    //Xu li chinh:
    let formElem = document.querySelector(obj.form);
    if (formElem) {
        //Khi submit form 
        formElem.onsubmit = function(event) {
            event.preventDefault();
            let isFormValid = true;
            //Lap qua tung rule va validate tat ca
            obj.rules.forEach(function(rule) {
                const inputElem = formElem.querySelector(rule.selector);
                const errorElem = inputElem.closest(obj.formGroupSelector).querySelector(obj.errorSelector);
                const isValid = validate(inputElem, rule, errorElem);
                if (!isValid)
                    isFormValid = false;
            });
            if (isFormValid) {
                if (typeof obj.onSubmit === 'function') {
                    let dataInput = formElem.querySelectorAll(`[name]:not([disabled])`);
                    //Lấy tất cả dữ liệu hợp lệ để đưa vào method onSubmit.
                    let valuesInput = Array.from(dataInput).reduce(function(value, dataElem) {
                            // value[dataElem.name] = dataElem.value
                            switch (dataElem.type) {
                                //Trường hợp checkbox nhận nhiều giá trị
                                case 'checkbox':
                                    if (!dataElem.matches(`:checked`)) {
                                        value[dataElem.name] = '';
                                        return value
                                    }
                                    if (!Array.isArray(value[dataElem.name])) {
                                        value[dataElem.name] = [dataElem.value];
                                    } else {
                                        value[dataElem.name].push(dataElem.value);
                                    }
                                    break;
                                case 'radio':
                                    value[dataElem.name] = formElem.querySelector(`input[name="${dataElem.name}"]:checked`).value;
                                    break;
                                case 'file':
                                    value[dataElem.name] = dataElem.files;
                                    break;
                                default:
                                    value[dataElem.name] = dataElem.value;
                            }
                            return value;
                        }, {})
                        //Truyền tất cả dữ liệu của form về cho back-end
                    obj.onSubmit(valuesInput);
                }
            } else {
                console.log('co loi')
            }
        }
        obj.rules.forEach(function(rule) { //Xu li truong hop blur va input  
            let inputElems = formElem.querySelectorAll(rule.selector);
            //Luu rules vao mang de k bi de
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            Array.from(inputElems).forEach(function(inputElem) {
                let errorElem = inputElem.closest(obj.formGroupSelector).querySelector(obj.errorSelector)
                if (inputElem.type != 'file') {
                    inputElem.onblur = function() { //Xu li truong hop blur
                        validate(inputElem, rule, errorElem);
                    }
                }
                inputElem.oninput = function() { //Xu li khi nhap vao dung va xoa message loi
                    inspect(inputElem, rule, errorElem);
                }
            })
        });
        console.log(selectorRules)
    }
}
// Xu li trong mang rules:
// rule
Validator.isRequired = function(selector, customMessage) {
    return {
        selector: selector,
        test: function(value) {
            if (typeof value == 'string')
                value = value.trim();
            return value ? undefined : (customMessage || `Thông tin chưa được nhập`);
        }
    }
}
Validator.isConfirmed = function(selector, getValueCallback, customMessage) {
    return {
        selector: selector,
        test: function(value) {
            return value === getValueCallback() ? undefined : (customMessage || "Giá trị không khớp");
        }
    }
}
Validator.isStrong = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim().length >= 6 ? undefined : 'Mật khẩu yếu vãi bạn ei >= 6 kí tự';
        }
    }
}
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value.trim()) ? undefined : "Email không hợp lệ";
        }
    }
}