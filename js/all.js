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
    if (location.pathname !== "/index.html") {
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

        if(DATA.length === 0){
            totalPrice.textContent=`NT$0`;
            appendTo.innerHTML=`<tr><th colspan="5"> <h2 style="text-align:center; font-size:48px; color:red; padding: 30px 0;"> 購物車內尚無資料 </h2> </th></tr>`;
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
                    <td>  ${items.quantity}</td>
                    <td>${items.quantity * items.product.price}
                    <td class="discardBtn">
                        <a href="#" class="material-icons" data-id="${items.product.id}" data-delete="${items.id}" >clear</a>
                    </td> `

                    totalPrice.textContent = `NT$${cartDataObj.finalTotal}`;
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

        eventTrigger ? reg = new RegExp(`${eventTrigger.value}`) : null;


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
            } else if (String(reg) !== "/undefined/" && reg !== null) {
                // .productSearch input 搜尋 
                //  console.log("執行 reg ");
                //  console.log(reg);
                // console.log(reg.test(items.title));
                return reg.test(items.category) || reg.test(items.title) || reg.test(items.origin_price) || reg.test(items.price);


            } else if (eventTrigger.textContent === "clear") {

                return items.id === eventTrigger.dataset.delete;
            } else {
                //  .productSelect change
                console.log("其他");
                return (eventTrigger !== "全部") ? items.category === eventTrigger : (eventTrigger === "全部") ? items.category : null;
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

                // 篩選出點擊到的 產品 (2: eventTrigger && eventTrigger.nodeType === 1)
                let selectedCategory = dataFilter({
                    DATA: productData,
                    eventTrigger: e.target
                });

                console.log("252 selectedCategory", selectedCategory);

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
                cartData.push(
                    selectedCategory
                );
                //   console.log("加入購物車 cartData", cartData);

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

            //  if (e.target)

        }
    });


    // 購物車刪除一筆資料
    DOM({
        element: "#shoppingCart__body",
        listener: "click",
        func: function (e) {
            e.preventDefault();
            console.log(e.target.textContent);
            console.log(e.target.dataset.delete);
            console.log(cartData);
            if (e.target.tagName = "A" || e.target.textContent === " clear ") {
                console.log("deldel");
                let deleteData = dataFilter({
                    DATA: cartData,
                    eventTrigger: e.target
                })
                console.log("deleteData", deleteData);
                console.log(deleteData.id);

                axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/jason/carts/${deleteData[0].id}`, {
                    data: deleteData
                }).
                then(function (response) {
                    console.log(response);
                    cartData = response.data.carts;
                    cartDataObj = response.data;
                    console.log("335",cartDataObj);
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
                eventTrigger: e.target.value
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

            cartData.push(selectedCategory);

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





}();


void

function () {

    if (location.pathname !== "/admin.html") {
        return;
    }
    console.log("/admin.html");
}()