//Selectores
const divResult = document.querySelector('.pedidos__result');
const formProduct = document.querySelector('.form');
const divAlert = document.querySelector('.content__alert');


// Inputs del formulario
const skuInput = document.querySelector('#sku');
const nameInput = document.querySelector('#name');
const quantityInput = document.querySelector('#quantity');
const priceInput = document.querySelector('#price');
//Bandera para determinar si se está editando un pedido
let editando = false;

let header = new Headers();

const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ';
header.append('Authorization', token);

window.onload = ()=>{
    getOrders();
    formProduct.addEventListener('submit', validateForm);
    document.addEventListener('click', payOrder);
}
// Objeto del producto 
let productObj = {
    sku: '',
    name: '',
    quantity: '',
    price: ''
}
// Arreglo que almacenará las ordenes consultadas
let ordersResult = [];

let request = {
    method: 'GET',
    headers: header,
    redirect: 'follow'
}
// Function que permite modificar la orden seleccionada
function addProduct(newOrders){
    formProduct.addEventListener('submit', validateForm);
    const existe = ordersResult.includes(newOrders);
    const bandera = newOrders;
    console.log(newOrders.items);
    bandera.items = [...bandera.items, productObj];
    if(existe){    
        // newOrders[0].items = [...bandera[0].items, productObj];
        newOrders = ordersResult.filter(order => order.number !== bandera.number);
        console.log(bandera);
        newOrders = [...newOrders, bandera];
        console.log(newOrders);
        showResult(newOrders);
    }
    setTimeout(() => {
        resetObj();
    }, 2000);
}

// Función que selecciona la orden por modificar
function editOrder(number){
    let newOrders;
    editando = true;
    console.log(editando);
    const editHeading = document.querySelector('.content__edit');
    editHeading.innerHTML = `Editando el pedido: <span class="edit__span">${number}</span>`;
    ordersResult.forEach( order => {
        if(order.number == number){
            newOrders = order;
        }
    });
    document.querySelector('.form__button').addEventListener('click', ()=>{
        addProduct(newOrders);
    });
    resetObj();
}

// Función que revisa el formulario de producto
function validateForm(e){
    e.preventDefault();
    if(editando){
        if(skuInput.value === ''){
            // showAlert('error', 'El campo Identificador es obligatorio');
            borderRed(skuInput);
            // return;
        }else if(nameInput.value === ''){
            // showAlert('error', 'El campo Nombre es obligatorio');
            borderRed(nameInput);
            // return;
        }else if(quantityInput.value === ''){
            // showAlert('error', 'El campo Cantidad es obligatorio');
            borderRed(quantityInput);
            // return;
        }else if(priceInput.value === ''){
            // showAlert('error', 'El campo Cantidad es obligatorio');
            borderRed(priceInput);
            // return;
        }
        
        productObj.sku = skuInput.value;
        productObj.name = nameInput.value;
        productObj.price = priceInput.value;
        productObj.quantity = quantityInput.value;
        console.log(productObj);
        const editHeading = document.querySelector('.content__edit');
        showAlert('success', 'Agregando Producto');
        editHeading.textContent = '';   
        editando = false;
        return;
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
        editButton.onclick = ()=>{
            editOrder(editButton.dataset.number);
        };
        editButton.dataset.number = order.number;

        divOrder.appendChild(orderHeading);
        // Obteniendo los valores a inyectar en el html creado previamente
        order.items.forEach(item=>{
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

            const {sku, name, price, quantity} = item;

            skuOrder.innerHTML = `Identificador: <span class="sku__span">${sku}</span>`;
            nameOrder.innerHTML = `Nombre: <span class="price__span">${name}</span>`;
            priceOrder.innerHTML = `Precio: <span class="price__span">$</span>${price}`;
            quantityOrder.innerHTML = `Cantidad: <span class="quantity__span">${quantity}</span>`;
            pedidoContent.appendChild(skuOrder);
            pedidoContent.appendChild(nameOrder);
            pedidoContent.appendChild(priceOrder);
            pedidoContent.appendChild(quantityOrder);
            divOrder.appendChild(pedidoContent);
        });
        //AppendChilds
        divButtons.appendChild(editButton);
        divButtons.appendChild(payButton);
        divOrder.appendChild(divButtons);
        divResult.appendChild(divOrder);
    });

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
        const divSpinner = document.createElement('div');
        divSpinner.classList.add('sk-cube-grid');
        divSpinner.innerHTML= `
            <div class="sk-cube sk-cube1"></div>
            <div class="sk-cube sk-cube2"></div>
            <div class="sk-cube sk-cube3"></div>
            <div class="sk-cube sk-cube4"></div>
            <div class="sk-cube sk-cube5"></div>
            <div class="sk-cube sk-cube6"></div>
            <div class="sk-cube sk-cube7"></div>
            <div class="sk-cube sk-cube8"></div>
            <div class="sk-cube sk-cube9"></div>
        `;
        document.querySelector('.spinner').appendChild(divSpinner);
        setTimeout(() => {
            divSpinner.remove();
            showAlert('success', `Se pagó el pedido: ${e.target.dataset.number}`);
        }, 4000);
        ordersResult = ordersResult.filter(order => order.number !== e.target.dataset.number);
        showResult(ordersResult);
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
    skuInput.value = '';
    nameInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    sku = skuInput.value;
    name = nameInput.value;
    quantity = quantityInput.value;
    price = priceInput.value;
}
