// Al terminar proyecto eliminar línea 3

const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');

// Crear Objeto
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

// Crear Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded',()=>{ 
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})



function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    
    fetch(url) 
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas));
};

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;  

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
};

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value; 
};

function submitFormulario(e){
    e.preventDefault();

    // Validar 
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }
    
    consultarAPI();
};

// Consultar API



function mostrarAlerta(mensaje){

    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        // Mensaje de error
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
};


function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda} `;

    mostrarSpinner();
    fetch(url) 
    .then( respuesta => respuesta.json()) 
    .then( cotizacion => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    })
    
};


function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();
    
    const {criptomoneda} = objBusqueda;
    const {PRICE, HIGHDAY, LOWDAY, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio del ${criptomoneda} es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precio.classList.add('precioAlto');
    precioAlto.innerHTML = `El precio mas alto del día es: <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precio.classList.add('precioBajo');
    precioBajo.innerHTML = `El precio mas bajo del día es: <span>${LOWDAY}</span>`
    
    const precioActualizacion = document.createElement('p');
    precioActualizacion.classList.add('precioActualizacion');
    precioActualizacion.innerHTML = `La última actualización fue: <span>${LASTUPDATE}</span>`

    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(precioActualizacion);
    
};


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}