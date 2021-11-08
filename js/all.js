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

    console.log();
    if (location.pathname !== "furniture/index.html") {
        return;
    }


    console.log("===============================");

    let productData; // 取陣列
    let cartDataObj; // 取物件
    let cartData; // 取陣列

    let selectedProductData;

    const productWrap = DOM({
        element: ".productWrap"
    });
    const shoppingCart = DOM({
        element: "#shoppingCart"
    });

    let shoppingCart__body = DOM({
        element: "#shoppingCart__body"
    });

    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/products')
        .then(function (response) {
            // 成功的 response
            productData = response.data.products;

            console.log("data", productData);
            renderView({
                DATA: productData,
                renderActon: "product",
                appendTo: productWrap,
                setAttributeName: "class",
                setAttributevalue: "productCard",
                createElement: "li"
            });

        })
        .catch(function (error) {
            // 失敗的 response
            console.log(error);
        })

    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/carts')
        .then(function (response) {
            // 成功的 response
            cartData = response.data.carts;
            cartDataObj = response.data;
            console.log("cartData", cartData);
            renderView({
                DATA: cartData,
                renderActon: "cart",
                appendTo: shoppingCart__body,
                createElement: "tr",
                setAttributeName: "class",
                setAttributevalue: "shoppingCart__tr"
            });

        })
        .catch(function (error) {
            // 失敗的 response
            console.log(error);
        })




    const renderView = function ({
        DATA,
        renderActon,
        appendTo,
        setAttributeName,
        setAttributevalue,
        createElement
    }) {
        console.log("DATA", DATA);
        appendTo.innerHTML = null;
        let totalPrice = DOM({
            element: "#totalPrice"
        });

        if (DATA.length === 0 && renderActon === "cart") {
            totalPrice.textContent = `NT$0`;
            appendTo.innerHTML = `<tr><th colspan="5"> <h2 style="text-align:center; font-size:48px; color:red; padding: 30px 0;"> 購物車內尚無資料 </h2> </th></tr>`;
        } else if (DATA.length === 0 && renderActon === "product") {
            {

                appendTo.innerHTML = ` <h2 style=" flex-grow:1; text-align:center; font-size:48px; color:red; padding: 30px 0;"> 找不到資料啊!      (╯°□°）╯︵ ┻━┻ </h2> `;
            }
        }

        DATA.forEach(function (items) {

            let creatNode;
            const creatNodeFragment = document.createDocumentFragment();

            creatNode = document.createElement(createElement);
            if (setAttributeName && setAttributevalue) {
                creatNode.setAttribute(setAttributeName, setAttributevalue)
            }
            switch (renderActon) {
                case "product":


                    creatNode.innerHTML = `
        <h4 class="productType">新品</h4>
        <img src="${items.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${items.id}">加入購物車</a>
        <h3>${items.title}</h3>
        <del class="originPrice">NT$${items.origin_price}</del>
        <p class="nowPrice">NT$${items.price}</p>
        `;
                    break;

                case "cart":
                    //${items.}
                    console.log("cart itemss", items);
                    creatNode.innerHTML = `
                        <td>
                            <div class="cardItem-title">
                                <img src="${items.product.images}" alt="">
                                <p>${items.product.title}</p>
                            </div>
                        </td> 
                        <td>${items.product.price}</td>
                        <td> <input type="number" data-id="${items.product.id}" data-cartid="${items.id}"  value="${items.quantity}" style="width: 50%;
                        padding: 10px;"></td>
                        <td>${items.quantity * items.product.price}
                        <td class="discardBtn">
                            <a href="#" class="material-icons" data-id="${items.product.id}" data-cartid="${items.id}" >clear</a>
                        </td> `

                    totalPrice.textContent = `NT$${ cartDataObj.carts.length >0 ? cartDataObj.finalTotal :0}`;
                    break;
                case "adminOrder":

                    creatNode.innerHTML = `  <td>10088377474</td>
                    <td>
                        <p>小杰</p>
                        <p>0912345678</p>
                    </td>
                    <td>高雄市前鎮區六合路183巷66號</td>
                    <td>cccexample@gmail.com</td>
                    <td>
                        <p>Louvre 雙人床架</p>
                    </td>
                    <td>2021/03/08</td>
                    <td class="orderStatus">
                        <a href="#">未處理</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" value="刪除">
                    </td>`


                    break;
            }

            /*
               
                
                */
            creatNodeFragment.appendChild(creatNode);
            appendTo.appendChild(creatNodeFragment)

        })


    }



    const dataFilter = function ({
        DATA,
        compareData,
        eventTrigger
    }) {
        console.log("dataFilter DATA", DATA);
        let reg;


        console.log("getCartQuantity data", DATA);
        if (DATA.length === 0) {
            return [];
        }



        //   console.log(`(eventTrigger.nodeName = "INPUT" && eventTrigger.value > 0)`, (eventTrigger.textContent === "clear" || (eventTrigger.nodeName = "INPUT" && eventTrigger.value > 0)));
        // console.log(String(reg));
        return DATA.filter(function (items) {
            if (eventTrigger.textContent === "加入購物車") {
                // add .productWrap 加入購物車
                // console.log("加入購物車!!!!");
                if (compareData && compareData.hasOwnProperty("getid")) {
                    console.log(" 取得 cartData[索引].id");
                    console.log(items[compareData.getid], eventTrigger.dataset.id);
                    // 取得 cartData[索引].quantity
                    return items.product.id === eventTrigger.dataset.id;
                } else if (eventTrigger && eventTrigger.nodeType === 1) {
                    console.log("items", items);
                    console.log("eventTrigger", eventTrigger);
                    return items.id === eventTrigger.dataset.id;;

                }

                console.log("篩選出點擊到的 產品");
                return eventTrigger.dataset.id === items.id;
            } else if (eventTrigger.getAttribute("type") === "search") {
                // .productSearch input 搜尋 
                //  console.log("執行 reg ");
                //  console.log(reg);
                // console.log(reg.test(items.title));
                reg = new RegExp(`${eventTrigger.value}`)
                return reg.test(items.category) || reg.test(items.title) || reg.test(items.origin_price) || reg.test(items.price);


            } else if (eventTrigger.textContent === "clear" || (eventTrigger.nodeName = "INPUT" && eventTrigger.value >= 0)) {

                return items.id === eventTrigger.dataset.cartid;
            } else {
                //  .productSelect change
                console.log("其他");
                return (eventTrigger.value !== "全部") ? items.category === eventTrigger.value : (eventTrigger.value === "全部") ? items.category : null;
            }



        })
    }


    // 加入購物車
    DOM({
        element: ".productWrap",
        listener: "click",
        func: function (e) {
            e.preventDefault();
            console.log(e.target.textContent);
            if (e.target.tagName = "A" && e.target.textContent === "加入購物車") {
                //      console.log("加入購物車");
                console.log("bug tesst", cartData);
                // 篩選出點擊到的 產品 (2: eventTrigger && eventTrigger.nodeType === 1)
                let selectedCategory = dataFilter({
                    DATA: productData,
                    eventTrigger: e.target
                });

                console.log("252 selectedCategory", selectedCategory);
                console.log("bug tesst", cartData);
                console.log("=======================================");
                // getAllCategorNode、isSelectedCategoryRepeat 檢查資料有沒有重複

                // 取 .discardBtn a 的 node
                // let getAllCategorNode = DOM({
                //     element: ".shoppingCart__tr  .discardBtn a",
                //     allElement: true
                // });

                // console.log("325", getAllCategorNode);
                // 篩選 點擊到的產品與下方購物車 相同的 id 為何 ?
                //isSelectedCategoryRepeat 回傳 id
                // let isSelectedCategoryRepeat = dataFilter({
                //     DATA: Array.from(getAllCategorNode),

                //     eventTrigger: e.target
                // });
                // console.log("332 isSelectedCategoryRepeat", isSelectedCategoryRepeat);

                console.log("bug tesst", cartData);
                console.log("=======================================");

                let getCartQuantity = dataFilter({
                    DATA: cartData,
                    eventTrigger: e.target,
                    compareData: {
                        getid: "id",
                    }
                });

                console.log("334 getCartQuantityQuantity", getCartQuantity);

                console.log("=======================================");


                selectedCategory = {
                    productId: selectedCategory[0].id,
                    quantity: getCartQuantity.length > 0 ? getCartQuantity[0].quantity : 0
                };

                console.log("處理後的 selectedCategory", selectedCategory);
                // cartData.push(
                //     selectedCategory
                // );      
                // //   console.log("加入購物車 cartData", cartData);

                selectedCategory.quantity += 1;

                axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/carts", {
                    "data": selectedCategory
                }).then(function (response) {
                    console.log("post", response);
                    cartData = response.data.carts;
                    cartDataObj = response.data;
                    console.log("cartData", cartData);
                    renderView({
                        DATA: cartData,
                        renderActon: "cart",
                        appendTo: shoppingCart__body,
                        createElement: "tr",
                        setAttributeName: "class",
                        setAttributevalue: "shoppingCart__tr"
                    });
                }).catch(function (error) {
                    console.log(error);
                })


            }

        }
    });


    // 購物車刪除資料 DELETE
    DOM({
        element: "#shoppingCart",
        listener: "click",
        func: function (e) {
            e.preventDefault();
            console.log(e.target.textContent);
            console.log(e.target.dataset.cartid);
            console.log(cartData);
            console.log(e.target.getAttribute("class"));
            // 購物車刪除一筆資料
            if (e.target.tagName = "A" && e.target.textContent === "clear") {

                let deleteData = dataFilter({
                    DATA: cartData,
                    eventTrigger: e.target
                })
                console.log("deleteData", deleteData);
                console.log(deleteData.id);

                axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/carts/${deleteData[0].id}`).
                then(function (response) {
                    console.log(response);
                    cartData = response.data.carts;
                    cartDataObj = response.data;
                    console.log("335", cartDataObj);
                    console.log("cartData", cartData);
                    console.log("cartDataObj.finalTotal", cartDataObj.finalTotal);
                    renderView({
                        DATA: cartData,
                        renderActon: "cart",
                        appendTo: shoppingCart__body,
                        createElement: "tr",
                        setAttributeName: "class",
                        setAttributevalue: "shoppingCart__tr"
                    });
                }).catch(function (error) {
                    console.log(error);
                })


            } else if (e.target.tagName = "A" && e.target.textContent === "刪除所有品項" && e.target.getAttribute("class") === "discardAllBtn") {
                // 購物車刪除全部資料
                axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/carts`).
                then(function (response) {
                    console.log(response);
                    cartData = response.data.carts;
                    cartDataObj = response.data;
                    console.log("384", cartDataObj);
                    console.log("cartData", cartData);
                    console.log("cartDataObj.finalTotal", cartDataObj.finalTotal);
                    renderView({
                        DATA: cartData,
                        renderActon: "cart",
                        appendTo: shoppingCart__body,
                        createElement: "tr",
                        setAttributeName: "class",
                        setAttributevalue: "shoppingCart__tr"
                    });
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }

    })

    // 修改購物車數量 PATCH
    DOM({
        element: "#shoppingCart",
        listener: "change",
        func: function (e) {

            if (e.target.nodeName = "INPUT") {
                console.log("INPUT");

                if (e.target.value <= 0) {
                    e.target.value = 1;
                }

                let patchData = dataFilter({
                    DATA: cartData,
                    eventTrigger: e.target
                })
                console.log("patchData", patchData);

                console.log(patchData[0].id, e.target.value);


                axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/carts`, {
                    data: {
                        id: patchData[0].id,
                        quantity: Number(e.target.value)
                    }
                }).
                then(function (response) {
                    console.log(response);
                    cartData = response.data.carts;
                    cartDataObj = response.data;
                    console.log("443", cartDataObj);
                    console.log("cartData", cartData);
                    console.log("cartDataObj.finalTotal", cartDataObj.finalTotal);
                    renderView({
                        DATA: cartData,
                        renderActon: "cart",
                        appendTo: shoppingCart__body,
                        createElement: "tr",
                        setAttributeName: "class",
                        setAttributevalue: "shoppingCart__tr"
                    });
                }).catch(function (error) {
                    console.log(error);
                })


            }
        }
    })

    // 篩選產品
    DOM({
        element: ".productSelect",
        listener: "change",
        func: function (e) {

            let selectedCategory = dataFilter({
                DATA: productData,
                eventTrigger: e.target
            })

            console.log("selectedCategory", selectedCategory);

            if (selectedCategory) {
                renderView({

                    DATA: selectedCategory,
                    renderActon: "product",
                    appendTo: productWrap,
                    setAttributeName: "class",
                    setAttributevalue: "productCard",
                    createElement: "li"

                });
            }
        }
    })

    // 搜尋產品
    DOM({
        element: ".productSearch",
        listener: "input",
        func: function (e) {

            let selectedCategory = dataFilter({
                DATA: productData,
                eventTrigger: e.target
            })

            console.log("selectedCategory", selectedCategory);

            //    cartData.push(selectedCategory);

            renderView({
                DATA: selectedCategory,
                renderActon: "product",
                appendTo: productWrap,
                setAttributeName: "class",
                setAttributevalue: "productCard",
                createElement: "li"

            });

        }

    })
    const formVadidate = function () {

        const formDOM = DOM({
            element: ".orderInfo-form"
        })

        let vadidateFormat = {

            姓名: {
                presence: {
                    message: "為必填"
                }
            },
            電話: {
                presence: {
                    message: "為必填"
                },
                format: {
                    pattern: "[-0-9]+", // - 、 0~9
                    message: "只能輸入 0-9"
                },
                length: {
                    is: 10,
                    message: "號碼長度輸入不正確"
                }
            },
            Email: {
                presence: {
                    message: "為必填"
                },
                email: {
                    message: "格式不正確"
                },
                format: {
                    pattern: "[a-zA-Z0-9_]+@[a-zA-Z0-9._]+",
                    message: "格式不正確"
                }
            },
            寄送地址: {
                presence: {
                    message: "為必填"
                },
                length: {
                    minimum: 10,
                    message: "字數輸入不正確"
                }
            },
            交易方式: {
                presence: {
                    message: "為必填"
                }
            },
        }
        return validate(formDOM, vadidateFormat);
    }
    const DOMinputs = DOM({
        element: ".orderInfo-form .orderInfo-input",
        allElement: true
    })

    // 送出表單
    DOM({
        element: ".orderInfo-btn",
        listener: "click",
        func: function (e) {
            e.preventDefault();
            let errorMessage = formVadidate();
            console.log("formVadidate", errorMessage);
            let obj = {}
            let errorMessageObjKeys = errorMessage ? Object.keys(errorMessage) : null;

            if (errorMessage !== undefined) {
                [...DOMinputs].forEach(function (node) {
                    // node.nextElementSibling.textContent=null;
                    errorMessageObjKeys.forEach(function (messageName) {

                        if (messageName === node.getAttribute("name")) {
                            node.nextElementSibling.textContent = errorMessage[messageName];
                        }

                    })
                })
            } else if (errorMessage === undefined) {
                // 取 DOM value
                [...DOMinputs].forEach(function (node) {

                    obj[node.getAttribute("name")] = node.value;

                    node.value = "";
                })
                obj = {
                    "name": obj["姓名"],
                    "tel": obj["電話"],
                    "email": obj["Email"],
                    "address": obj["寄送地址"],
                    "payment": obj["交易方式"]
                }

                // POST 
                console.log("obj", obj);
                axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/orders`, {
                    "data": {
                        "user": obj
                    }
                }).then(function (response) {
                    console.log(response);
                    console.log(response);
                    // order 送出之後， caer api 的資料會被清空，所以需要手動把 cartData 改為空陣列，cartDataObj 改為空物件
                    cartData = [];
                    cartDataObj = {};

                    renderView({
                        DATA: cartData,
                        renderActon: "cart",
                        appendTo: shoppingCart__body,
                        createElement: "tr",
                        setAttributeName: "class",
                        setAttributevalue: "shoppingCart__tr"
                    });
                }).catch(function (error) {
                    console.log(error);
                })
            }
        }
    })

    DOM({
        element: ".orderInfo-form .orderInfo-input",
        allElement: true,
        listener: "blur",
        func: function (e) {

            let errorMessage = formVadidate();
            console.log("formVadidate", errorMessage);
            let hasError = errorMessage ? Object.keys(errorMessage).filter(function (attribute) {
                return attribute === e.target.getAttribute("name");
            }) : false;
            // true ==> 有錯誤
            // false ==> 無錯誤

            e.target.nextElementSibling.textContent = errorMessage ? errorMessage[hasError] : " ";

            console.log("hasError", hasError);


        }

    })

}();

void

function () {

    if (location.pathname !== "furniture/admin.html") {
        return;
    }

    const renderView = function ({
        DATA,
        renderActon,
        appendTo,
        setAttributeName,
        setAttributevalue,
        createElement
    }) {
        console.log("DATA", DATA);
        appendTo.innerHTML = null;
        // let totalPrice = DOM({
        //     element: "#totalPrice"
        // });

        if (DATA.length === 0) {
            // totalPrice.textContent = `NT$0`;
            appendTo.innerHTML = `<tr><th colspan="8"> <h2 style="text-align:center; font-size:48px; color:red; padding: 30px 0;"> 目前尚無訂單資料 </h2> </th></tr>`;
        }
        DATA.forEach(function (items) {

            let creatNode;
            const creatNodeFragment = document.createDocumentFragment();

            creatNode = document.createElement(createElement);
            if (setAttributeName && setAttributevalue) {
                creatNode.setAttribute(setAttributeName, setAttributevalue)
            }

            let productTitleList = "";


            items.products.forEach(function (objs) {
                productTitleList += `${objs.title} * ${objs.quantity}  <br>`
            })


            switch (renderActon) {
                case "adminOrder":
                    //${items.}
                    //${items.user.}
                    creatNode.innerHTML = `
                      <td>${items.createdAt}</td>
                <td>
                    <p>${items.user.name}</p>
                    <p>${items.user.tel}</p>
                </td>
                <td>${items.user.address}</td>
                <td>${items.user.email}</td>
                <td>
                    <p>${productTitleList}</p>
                </td>
                <td>2021/03/08</td>
                <td class="orderStatus">
                    <a href="#" data-id="${items.id}">${ !items.paid ? "未處理" : "已處理"}</a>
                </td>
                <td>
                    <input type="button" data-id="${items.id}" class="delSingleOrder-Btn" value="刪除">
                </td>`


                    break;
            }
            creatNodeFragment.appendChild(creatNode);
            appendTo.appendChild(creatNodeFragment)

        })
    }
    let orderDataObj;
    let orderData;

    const orderPage__tr = DOM({
        element: "#orderPage-table__tr"
    })


    const rederChart = function ({
        data,
        category,
        categoryTitle
    }) {
        console.log("圓餅圖", data, category);

        let chartColums = [];

        category.forEach(function (items) {
            let chartColums_Num = 0;
            data.forEach(function (obj) {
                obj.products.forEach(function (productsObj) {

                    if (productsObj.category === items) {
                        chartColums_Num += productsObj.price * productsObj.quantity;
                    }

                })
            })
            chartColums.push([items, chartColums_Num])
        })

        console.log("圓餅圖 data", chartColums);
        c3.generate({
            bindto: "#chart__category",
            data: {

                columns: chartColums,
                type: 'pie',

            }
        });

        chartColums = [];

        categoryTitle.forEach(function (items) {
            let chartColums_Num = 0;
            data.forEach(function (obj) {
                obj.products.forEach(function (productsObj) {

                    if (productsObj.title === items ||  items==="其他") {
                        chartColums_Num += productsObj.price * productsObj.quantity;
                    }

                })
            })
            if (chartColums_Num > 0) {
                chartColums.push([items, chartColums_Num])
            }

        })
      


console.log(chartColums);

        console.log("圓餅圖 data", chartColums);
        c3.generate({
            bindto: "#chart__item",
            data: {
                columns: chartColums,
                type: 'pie',
            }
        });

    }

    let productCatgory = [];
    let productTitle = ["其他"];

    axios.all([axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/jason/orders", {
            headers: {
                Authorization: "hxw4q4ILBrSckCuDUzzGTIfFkEG2"
            }
        }), axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/products")])
        .then(axios.spread((ordersResponse, productsResponse) => {

            ////////////////// ordersResponse==> orders api   ///////////////
            //     console.table('ordersResponse', ordersResponse)

            orderDataObj = ordersResponse.data;
            orderData = ordersResponse.data.orders;
            console.log(orderDataObj, orderData);

            renderView({
                DATA: orderData,
                renderActon: "adminOrder",
                appendTo: orderPage__tr,
                // setAttributeName,
                // setAttributevalue,
                createElement: "tr"
            })
            console.log("產品資料", productsResponse.data);
            /////////// productsResponse ==> products api  ////////////////////////
            productsResponse.data.products.forEach(function (items) {
                productCatgory.push(items.category);
                if(items.title === "Louvre 雙人床架／雙人加大" || items.title === "Antony 雙人床架／雙人加大"|| items.title === "Jordan 雙人床架／雙人加大")
                productTitle.unshift(items.title);
            })
            // 篩選出不重復的 產品類別
            productCatgory = productCatgory.filter(function (items, index, arr) {
                return arr.indexOf(items) === index;
            })




            rederChart({
                data: orderData,
                category: productCatgory,
                categoryTitle: productTitle
            });


            console.log("產品標題", productTitle);


        }))
        .catch((err) => {
            console.error(err)
        })

    const deleteOrder = function (id = "") {

        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/jason/orders/${id}`, {
                headers: {
                    Authorization: "hxw4q4ILBrSckCuDUzzGTIfFkEG2"
                }
            }

        ).then(function (response) {
            console.log(response);
            orderDataObj = response.data;
            orderData = response.data.orders;
            //    console.log(orderDataObj,orderData);
            renderView({
                DATA: orderData,
                renderActon: "adminOrder",
                appendTo: orderPage__tr,
                // setAttributeName,
                // setAttributevalue,
                createElement: "tr"
            })
            rederChart({
                data: orderData,
                category: productCatgory,
                categoryTitle: productTitle
            });

        }).catch(function (error) {
            console.log(error);
        })
    }


    const putOrder = function (putParamater) {
        axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/jason/orders", {
                data: {
                    "id": putParamater.id,
                    "paid": putParamater.paid
                }

            }, {
                headers: {
                    Authorization: "hxw4q4ILBrSckCuDUzzGTIfFkEG2"
                }

            })
            .then(function (response) {
                console.log(response);
                orderDataObj = response.data;
                orderData = response.data.orders;
                //    console.log(orderDataObj,orderData);

                renderView({
                    DATA: orderData,
                    renderActon: "adminOrder",
                    appendTo: orderPage__tr,
                    // setAttributeName,
                    // setAttributevalue,
                    createElement: "tr"
                })

            }).catch(function (error) {
                console.log(error);
            })

        {

        }
    }
    DOM({
        element: "#orderPage-table__tr",
        listener: "click",
        func: function (e) {
            e.preventDefault();
            if (e.target.tagName === 'INPUT' && e.target.value === "刪除") {

                deleteOrder(e.target.dataset.id);
            } else if (e.target.tagName === 'A' && (e.target.textContent === "未處理" || e.target.textContent === "已處理")) {
                //  deleteOrder();
                let putParamater = {
                    paid: e.target.textContent === "未處理" ? true : false,
                    id: e.target.dataset.id
                }
                console.log(putParamater);
                putOrder(putParamater);
            }

        }
    })

    DOM({
        element: ".discardAllBtn",
        listener: "click",
        func: function () {
            deleteOrder();
        }
    })
    console.log("/admin.html");
}()