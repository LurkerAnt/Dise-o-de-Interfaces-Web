//La pagina se carga desde dos archivos diferentes (xml o json),
//para cambiar el punto de origen basta con cambiar el nombre de la variable remoteSource a 'json' o 'xml'
const remoteSource = 'json';

function xmlToJson(xml) {
    const json = {};
    //Se convierte el xml en un object jquery xml.
    xml = $(xml);
    //Sacamos el primer hijo 'webData'
    const webData = xml.children('web-data');
    
    //Creamos el campo title para guardar el texto del tag title.
    //Funcion text(): saca el contenido del tag del xml.
    json.icon = webData.children('icon').text();
    json.title = webData.children('title').text();
    json.description = webData.children('description').text();
    json.keywords = webData.children('keywords').text();
    
    const content = webData.children('content');
    
    json.content = {};
    
    json.content.logo = content.children('logo').text();
    
    //Creamos una lista en la variable menu
    json.content.menu = [];
    const menuItems = content.children('menu').children('value');
    //For each sobre un objeto jquery, cambia el orden de los parametros (y su nombre es each). index <-> value
    menuItems.each(function (index, menuItem) {
        //Funcion push(): añade un item en la lista
        //La funcion each con cada iteración devuelve el item original, para tratarlo con 
        //jquery primero hay que convertirlo.
        json.content.menu.push($(menuItem).text());
    });
    
    json.content.slider = [];
    const sliderItems = content.children('slider').children('value');
    sliderItems.each(function (index, sliderItem) {
        json.content.slider.push($(sliderItem).text());
    });
    
    json.content.products = [];
    const productItems = content.children('products').children('product');
    productItems.each(function (index, productItem) {
        const jsonProductItem = {}; 
        
        jsonProductItem.name = $(productItem).children('name').text();
        jsonProductItem.description = $(productItem).children('description').text();
        jsonProductItem.img = $(productItem).children('img').text();
        
        json.content.products.push(jsonProductItem);
    });
    
    const topSells = content.children('topSells');
    json.content.topSells = {};
    json.content.topSells.title = topSells.children('title');
    json.content.topSells.sells = [];
    const sells = topSells.children('sells').children('value');
    sells.each(function (index, sellItem) {
        json.content.topSells.sells.push($(sellItem).text()); 
    });
    
    json.content.footer = {};
    json.content.footer.info = [];
    const footer = content.children('footer');
    const infoItems = footer.children('info').children('value');
    infoItems.each(function (index, infoItem) {
        json.content.footer.info.push($(infoItem).text());
    });
    json.content.footer.disclaimer = footer.children('disclaimer').text();
    return json;
}

function treatData(data) {
    //Para apuntar a un ID del html se pone delante del nombre un #
    $('#icon').attr('href', data.icon)
    $('#title').html(data.title);
    $('#description').attr('content', data.description);
    $('#keywords').attr('content', data.keywords);
    //Para apuntar a una CLASE de html se pone delante del nombre .
    $('.chapman-img').attr('src', data.content.logo);
    
    const ulMenu = $('#ul-menu');
    //Bucle forEach que ejecuta la funcion por cada item en la lista
    data.content.menu
    .forEach(function (menuItem) {
        //Funcion append: funcion que añade en el elemento objetivo el item como ultimo hijo.
        //Para crear un elemento html con jquery se pone directamente la estructura html dentro de la function $()
        ulMenu.append($('<li><a href="">' + menuItem + '</a></li>'));
    });
    
    const ulSlider = $('#ul-slider');
    data.content.slider
    .forEach(function (sliderItem) {
        ulSlider.append($('<li><img src="' + sliderItem + '" /></li>')) ;
    });
    
    const products = $('#products');
    data.content.products
    .forEach(function (productItem) {
        //Los acentos permiten la concatenación de los string permitiendo meter 
        //las variables directamente en el texto (con la sintaxis de ${}).
        products.append($(`
        <div>
            <h2><a href="">${productItem.name}</a> </h2>
            <p class="byline">${productItem.description}</p>
            <img src="${productItem.img}">
        </div>`));
    });
    $('#topSellsTitle').html(data.content.topSells.title);
    
    const ventas = $('#ventas');
    data.content.topSells.sells
    .forEach(function (sellItem, index) {
        ventas.append(`<li>${index + 1}. <a href="#">${sellItem}</a></li>`)
    });
    
    const footer = $('#footer');
    data.content.footer.info
    .forEach(function (footerItem) {
        footer.append(`<li><a href="#">${footerItem}</a></li>`);
    });
    footer.append(`<a>${data.content.footer.disclaimer}</a>`);
}

if (remoteSource === 'json') {
    //Funcion que hace una llamada ajax a un json y 
    //devuelve un objeto de javascript con las propiedades del json.
    $.getJSON(`data_web.json?nocache=${new Date().getTime()}`, treatData);
    console.log('Carga hecha desde JSON');
} else {
    //Funcion que hace una llamada ajax 'get' y devuelve la información, 
    //en este caso devuelve un objeto dom de xml
    $.get(`data_web.xml?nocache=${new Date().getTime()}`, function (xml) {
        const json = xmlToJson(xml);
        treatData(json);
    });
    console.log('Carga hecha desde XML');
}










