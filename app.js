//Selectores
const divResult = document.querySelector('.pedidos__result');
const formProduct = document.querySelector('form');
const divAlert = document.querySelector('.content__alert');
const inputPrecio = document.querySelector('.form__input-precio');

// Inputs del formulario
const skuInput = document.querySelector('.form__input-sku');
const nameInput = document.querySelector('.form__input-nombre');
const quantityInput = document.querySelector('.form__input-cantidad');
const priceInput = document.querySelector('.form__input-precio');
//Bandera para determinar si se está editando un pedido
let editando = false;

let header = new Headers();

const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ';
header.append('Authorization', token);

window.onload = ()=>{
    getOrders();
    formProduct.addEventListener('submit', validateForm);
    document.addEventListener('click', payOrder);
    document.addEventListener('click', addProduct);
}
// Objeto del producto 
let productObj = {
    skuObj: '',
    nameObj: '',
    quantityObj: '',
    priceObj: ''
}
// Arreglo que almacenará las ordenes consultadas
let ordersResult = [];

let request = {
    method: 'GET',
    headers: header,
    redirect: 'follow'
}
// Function que permite modificar la orden seleccionada
function addProduct(e){
    if(e.target.classList.contains('pedido__button-edit')){
        editando = true;
        editOrder(e.target.dataset.number);
    }
}

// Función que agregar productos a la orden por modificar
function editOrder(orderNumber){
    formProduct.addEventListener('submit', validateForm);
    const editHeading = document.querySelector('.content__edit');
    editHeading.innerHTML = `Editando el pedido: ${orderNumber}`;
    let newOrders = ordersResult.filter(order => order.number === orderNumber);
    console.log(productObj);
    if(productObj.skuObj !== ''){
        console.log(productObj);
        console.log('lleno');
        newOrders[0].items = [...newOrders[0].items, productObj];
        console.log(newOrders[0].items);
    }
    console.log(newOrders[0].items);
}

// Función que revisa el formulario de producto
function validateForm(e){
    e.preventDefault();
    if(editando){
        if(skuInput.value === ''){
            showAlert('error', 'El campo Identificador es obligatorio');
            borderRed(skuInput);
        }else if(nameInput.value === ''){
            showAlert('error', 'El campo Nombre es obligatorio');
            borderRed(nameInput);
        }else if(quantityInput.value === ''){
            showAlert('error', 'El campo Cantidad es obligatorio');
            borderRed(quantityInput);
        }else if(priceInput.value === ''){
            showAlert('error', 'El campo Cantidad es obligatorio');
            borderRed(priceInput);
            return;
        }
        productObj.skuObj = skuInput.value;
        productObj.nameObj = nameInput.value;
        productObj.priceObj = priceInput.value;
        productObj.quantityObj = quantityInput.value;

        const editHeading = document.querySelector('.content__edit');
        showAlert('success', 'Agregando Producto');
        editHeading.textContent = '';
        resetObj();
        editando = false;
    }
    showAlert('error', 'No se están agregando productos a alguna orden');
}

// Función que coloca el borde del input vacío en rojo
function borderRed(input){
    input.classList.add('border-red');
    setTimeout(() => {
        input.classList.remove('border-red');
    }, 3000);
}

// Función que consulta la API para obtener las ordenes
async function getOrders(){
    const url = `https://eshop-deve.herokuapp.com/api/v2/orders`;
    const result = await fetch(url, request);
    const response = await result.json();
    ordersResult = await response.orders;
    showResult(ordersResult);
}

// Función que permite mostrar el resultado de la consulta en el HTML
function showResult(orders){
    clearHTML();
    orders.forEach(order=>{
        let {number} = productObj;
        number = order.number;
        // Contenedor de la orden (contenedor general)
        const divOrder = document.createElement('div');
        divOrder.classList.add('pedido');
        
        // Contenido de cada orden
        const orderHeading = document.createElement('h3');
        orderHeading.classList.add('pedido__heading');
        orderHeading.innerHTML = `Pedido: <span class="heading__span">${number}</span>`;

        // Contenedor de cada producto
        const pedidoContent = document.createElement('div');
        pedidoContent.classList.add('pedido__content');

        // Contenido de los productos
        const skuOrder =  document.createElement('p');
        skuOrder.classList.add('pedido__sku');

        const nameOrder =  document.createElement('p');
        nameOrder.classList.add('pedido__name');

        const priceOrder =  document.createElement('p');
        priceOrder.classList.add('pedido__price');

        const quantityOrder =  document.createElement('p');
        quantityOrder.classList.add('pedido__quantity');

        // Contenedor de los botones
        const divButtons = document.createElement('div');
        const editButton = document.createElement('button');
        const payButton = document.createElement('button');
        divButtons.classList.add('pedido__buttons'); 
        payButton.classList.add('pedido__button', 'pedido__button-pay');
        payButton.textContent = "Pagar"; 
        payButton.dataset.number = order.number;
        editButton.classList.add('pedido__button', 'pedido__button-edit'); 
        editButton.textContent = "Editar";
        editButton.dataset.number = order.number;
        // Obteniendo los valores a inyectar en el html creado previamente
        order.items.forEach(item=>{
            const {sku, name, price, quantity} = item;
            let {skuObj, nameObj, priceObj, quantityObj} = productObj;
            skuOrder.innerHTML = `Identificador: <span class="sku__span">${sku}</span>`;
            nameOrder.innerHTML = `Nombre: <span class="price__span">${name}</span>`;
            priceOrder.innerHTML = `Precio: <span class="price__span">$</span>${price}`;
            quantityOrder.innerHTML = `Cantidad: <span class="quantity__span">${quantity}</span>`;
        })
        //AppendChilds
        divOrder.appendChild(orderHeading);
        divOrder.appendChild(pedidoContent);
        pedidoContent.appendChild(skuOrder);
        pedidoContent.appendChild(nameOrder);
        pedidoContent.appendChild(priceOrder);
        pedidoContent.appendChild(quantityOrder);
        divOrder.appendChild(pedidoContent);
        divButtons.appendChild(editButton);
        divButtons.appendChild(payButton);
        divOrder.appendChild(divButtons);
        divResult.appendChild(divOrder);
    })
}

// Función que muestra una alerta
function showAlert(type, content){
    const errors = document.querySelectorAll('.error');
    const success = document.querySelectorAll('.success');
    const alert = document.createElement('p');
    alert.classList.add('alert');
    alert.textContent = content;
    if(errors.length === 0 && success.length === 0){
        if(type === 'error'){
            alert.classList.add('error');
            alert.classList.remove('success');
        }else{
            alert.classList.remove('error');
            alert.classList.add('success');
        }
        divAlert.appendChild(alert);
    }
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Función que muestra un spinner simulando el pago de una orden
function payOrder(e){
    if(e.target.classList.contains('pedido__button-pay')){
        const orderId = e.target.dataset.number;
        console.log(orderId);
    }
}


// Función que limpia el HTML generado previamente
function clearHTML(){
    while(divResult.firstChild){
        divResult.removeChild(divResult.firstChild);
    }
}
// Función que reinicia el objeto y los inputs
function resetObj(){
    let {sku, name, quantity, price} = productObj;
    sku = '';
    name = '';
    quantity = '';
    price = '';
    skuInput.value = '';
    nameInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
}
