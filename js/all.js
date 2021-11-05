const getAxios = function ({
    method = "get",
    url
}) {

    axios[method](url).then(function (response) {
        console.log(response);
        data = response;
    }).catch(function (error) {
        console.log(error);
    })

}

const DOM = function ({
    element,
    listener,
    func,
    allElement = false
}) {
    const selector = (allElement ? document.querySelectorAll(element) : document.querySelector(element));

    if (listener && allElement) {

        return selector.forEach(function (el) {
            el.addEventListener(listener, func);
        })

    } else if (listener) {
        //truthy
        return selector.addEventListener(listener, func);
    } else {
        //falsy
        return selector;
    }

}





void

function () {

    console.log(location.pathname);
    if (location.pathname !== "/index.html") {
        return;
    }

    // let data;

    // getAxios({
    //     url: "https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/products"
    // })

    // window.addEventListener("load", function () {
    //     console.log("window data", data);
    // })


    // DOM({
    //     element: ".productSelect",
    //     listener: "change",
    //     func: function () {
    //         console.log("change data", data);
    //     }
    // })




    console.log("===============================");


    let data;

    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/products')
        .then(function (response) {
            // 成功的 response
            data = response

            console.log("data", data);

        })
        .catch(function (error) {
            // 失敗的 response
            console.log(error);
        })

        window.addEventListener("load", function () {
            console.log("data", data);

        })


    DOM({
        element: ".productSelect",
        listener: "change",
        func: function () {
            console.log("change",data);
        }
    })






}();


void

function () {

    if (location.pathname !== "/admin.html") {
        return;
    }
    console.log("/admin.html");
}()