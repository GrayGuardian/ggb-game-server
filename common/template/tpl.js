const Template = {};

let getArr = function (name) {
    return require("./" + name);
}

let getMap = function (name, key) {
    let map = {}
    let arr = getArr(name);
    arr.forEach(element => {
        if (element[key] != null) {
            map[element[key]] = element;
        }
        else {
            //未找到标识
        }

    });
    return map;
}

let template_role = getMap('template_role', "id");

Template.template_role = template_role;

module.exports = Template;