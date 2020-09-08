
window.addEventListener('load', () => {
    const searchFilters = document.querySelectorAll('input[name=active]');
    const hasMotorFilters = document.querySelectorAll('input[name=hasmotor]');
    const sailFilters = document.querySelectorAll('input[name=sail]');

    const sortFilters = document.querySelectorAll('input[name=active-sort]');
    const querystring = document.querySelector('#searchInput');


    let url = '';
    let searchFilter = '';
    let hasMotorFilter ='';
    let sailFilter ='';
    let sortFilter ='';
    update();
    
    
    console.log('Searchfilters outside: ', searchFilters.value)
    console.log('Searchfilteroutside', searchFilter)

    function update() {
        url = `http://localhost:1337/api/search/?${searchFilter}=${querystring.value}${sailFilter}${hasMotorFilter}&${sortFilter}`;
    }

    querystring.addEventListener('change', update);

    hasMotorFilters.forEach(elem => {
        elem.addEventListener('change', e => {
            hasMotorFilter = e.target.value ; update();
        })
    })

    sailFilters.forEach(elem => {
        elem.addEventListener('change', e => {
            sailFilter = e.target.value ; update();
        })
    })

    searchFilters.forEach(box => {
		box.addEventListener('change', e => {
            searchFilter = e.target.value ; update();
            if ( searchFilter == 'word' ) {
            querystring.placeholder = 'Mata in ett sökord';
            } if (searchFilter == 'maxprice') {
                querystring.placeholder = 'Ange ett maxpris i siffror';
            } if (searchFilter == 'madebefore') {
                querystring.placeholder = 'Ange årtal ex(1984)';
            } if (searchFilter == 'madeafter') {
                querystring.placeholder = 'Producerad efter, ange årtal ex(1984)';

            }
		})
    })

    sortFilters.forEach(elem => {
        elem.addEventListener('change', e => {
            sortFilter = e.target.value; update();
        })
    })
    

/*------------------------------------------------------------------------Createboat with inputfields*/
const createBoat = document.querySelector('#createBoatButton');
createBoat.addEventListener('click', async e => {
    let modelAdd  = document.querySelector('#modelInput');
    let yearAdd = document.querySelector('#yearInput');
    let priceAdd = document.querySelector('#priceInput');
    let sailAdd = document.querySelector('#sailInput');
    let motorAdd = document.querySelector('#motorInput');
    let imageAdd = document.querySelector('#imageInput');
    
    let urlAddBoat = 'http://localhost:1337/api/boat';

    let bodyAddReq = JSON.stringify({model : modelAdd.value, model_year : yearAdd.value, price : priceAdd.value, sail : sailAdd.value,
    motor : motorAdd.value, image : imageAdd.value })

    console.log('URL on modbutton ', urlAddBoat);
    console.log('Body  modbutton ', bodyAddReq);
    try {
        console.log('About to send a put request');
        const response = await fetch(urlAddBoat, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: bodyAddReq
        });

        const data = await response.json();
        console.log('Response data: ', data);

        modelAdd.value = ''; //Clear
        priceAdd.value = ''; //Clear
        } catch(error){
            let errorMessage = document.createElement('li');
            console.error(error)
            if( error.message.startsWith('Unexpected token') && response ) {
                let text = response.text();
                console.log('Response text: ', text);
                errorMessage.innerHTML = text;
                console.log(errorMessage);
            } else {
                errorMessage.innerHTML = 'Error! Do you have a local web server? Do you use the correct port?\n' + error.message;
                console.log(errorMessage);
            }           
    } finally {
        show();
    }
    //--------------------
    

});//Createboats

/*------------------------------------------------------------------------View boats*/

async function show() {
    let checkedSearch = document.querySelectorAll('input[name="active"]:checked').length;
    let checkedMotor = document.querySelectorAll('input[name="hasmotor"]:checked').length;
    let checkeSail = document.querySelectorAll('input[name="sail"]:checked').length;
    let checkeSort = document.querySelectorAll('input[name="active-sort"]:checked').length;

    if( checkedSearch == 0) {
        searchFilter = ''; update();
        querystring.placeholder = 'Välj ett sökalternativ eller sök för alla båtar';} 
    if( checkedMotor == 0) {
        hasMotorFilter =''; update();
        querystring.placeholder = 'Välj ett sökalternativ eller sök för alla båtar';} 
    if( checkeSail == 0) {
        sailFilter =''; update();
        querystring.placeholder = 'Välj ett sökalternativ eller sök för alla båtar';}
    if( checkeSort == 0) {
        sortFilter =''; update();
        querystring.placeholder = 'Välj ett sökalternativ eller sök för alla båtar';}

        
    console.log(url)
    try {
        console.log('About to send GET request');
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();

         console.log('Response data: ', data)
        let imgListResult = await imgListAx(); //Hämta lista för vilka bilder som ligger i databasen
        if (!imgListResult) {
            imgListResult = "";
        }
        console.log('imglist', imgListResult)
            
		let boatCards = document.querySelector('.boatCards');
        boatCards.innerHTML = '';//Clear
        
		for (let i=0; i<data.length; i++) {
			//Create card-container to every bookelement
			let card = document.createElement('div');
			card.classList.add('card');
			boatCards.appendChild(card);

			//Create a divcontainer inside card to every book
			let boatId = document.createElement('div');
			boatId.classList.add('title');
			card.appendChild(boatId);
		
			//Create ul to every boat
			let boatProp = document.createElement('ul');
			boatProp.classList.add('info');
			boatId.appendChild(boatProp);
            
            async function noImage() {
                let imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container');
                boatProp.appendChild(imgContainer);

                let noImage = document.createElement('div');
                noImage.classList.add('no-image');
                imgContainer.appendChild(noImage);
                
                let noImageText = document.createElement('p');
                noImageText.classList.add('no-image-text');
                noImageText.innerText = 'Bild fattas'
                noImage.appendChild(noImageText)

            }
            //Kontrollera om det finns en bildadress, kontrollera om bilden finns i databasen, om inte skapa tomt divelement
            if (!imgListResult || data[i].image == "" || !data[i].image) {
                let imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container');
                boatProp.appendChild(imgContainer);

                let noImage = document.createElement('div');
                noImage.classList.add('no-image');
                imgContainer.appendChild(noImage);
                
                let noImageText = document.createElement('p');
                noImageText.classList.add('no-image-text');
                noImageText.innerText = 'Bild fattas'
                noImage.appendChild(noImageText)
                
            } else {
                let imgLista = await imgListResult.some(function(el){ return el.filename == data[i].image});

                if (imgLista) {
                    let imgContainer = document.createElement('div');
                    imgContainer.classList.add('img-container');
                    imgContainer.setAttribute("id", data[i].image);
                    boatProp.appendChild(imgContainer);

                    let elem = document.createElement("img");
                    elem.setAttribute("src", `http://localhost:1337/api/image/${data[i].image}`);
                    document.querySelector(`#${CSS.escape(data[i].image)}`).appendChild(elem);

                } else {
                    let imgContainer = document.createElement('div');
                    imgContainer.classList.add('img-container');
                    boatProp.appendChild(imgContainer);
    
                    let noImage = document.createElement('div');
                    noImage.classList.add('no-image');
                    imgContainer.appendChild(noImage);
                    
                    let noImageText = document.createElement('p');
                    noImageText.classList.add('no-image-text');
                    noImageText.innerText = 'Bild fattas'
                    noImage.appendChild(noImageText)
                }
                
            }
            

            //image adress
            let imgProp = document.createElement('li');
			imgProp.classList.add('imgInfo')
			imgProp.innerHTML = 'Bildadress:  ';
			boatProp.appendChild(imgProp);

			let idForModImg = data[i]._id;
			let imgSpan = document.createElement('span');
			imgSpan.classList.add(idForModImg + 'img'); //unique classname
			imgSpan.innerHTML = data[i].image;
			imgSpan.contentEditable = "true";
			imgProp.appendChild(imgSpan);

			// Model
			let modelProp = document.createElement('li');
			modelProp.classList.add('modelInfo')
			// modelProp.innerHTML = 'Model:  ';
			boatProp.appendChild(modelProp);
				
			let idForModModel = data[i]._id;
			let modelSpan = document.createElement('span');
			modelSpan.classList.add(idForModModel + 'model'); //unique classname
			modelSpan.innerHTML = data[i].model;
			modelSpan.contentEditable = "true";
			modelProp.appendChild(modelSpan); 

			// Price
			let priceProp = document.createElement('li');
			priceProp.classList.add('priceInfo')
			priceProp.innerHTML = 'Pris:  ';
			boatProp.appendChild(priceProp);

			let idForModPrice = data[i]._id;
			let priceSpan = document.createElement('span');
			priceSpan.classList.add(idForModPrice + 'price'); //unique classname
			priceSpan.innerHTML = data[i].price;
			priceSpan.contentEditable = "true";
            priceProp.appendChild(priceSpan); 

			//Year
			let yearProp = document.createElement('li');
			yearProp.classList.add('yearInfo')
			yearProp.innerHTML = 'År:  ' ;
            boatProp.appendChild(yearProp);
            
            let idForModYear = data[i]._id
			let yearSpan = document.createElement('span');
			yearSpan.classList.add(idForModYear + 'year'); //unique classname
			yearSpan.innerHTML = data[i].model_year;
			yearSpan.contentEditable = "true";
            yearProp.appendChild(yearSpan); 
            
            // Motor 
			let motorProp = document.createElement('li');
			motorProp.classList.add('motorInfo')
			motorProp.innerHTML = 'Motor:  ';
			boatProp.appendChild(motorProp);

			let idForModMotor = data[i]._id;
			let motorSpan = document.createElement('span');
			motorSpan.classList.add(idForModMotor + 'motor'); //unique classname
			motorSpan.innerHTML = data[i].motor;
			motorSpan.contentEditable = "true";
            motorProp.appendChild(motorSpan);
            
            // Sail
			let sailProp = document.createElement('li');
			sailProp.classList.add('sailInfo')
			sailProp.innerHTML = 'Segel:  ';
			boatProp.appendChild(sailProp);

			let idForModSail = data[i]._id;
			let sailSpan = document.createElement('span');
			sailSpan.classList.add(idForModSail + 'sail'); //unique classname
			sailSpan.innerHTML = data[i].sail;
			sailSpan.contentEditable = "true";
            sailProp.appendChild(sailSpan); 

			//Deletebutton
			let deleteButton = document.createElement('button');
			deleteButton.classList.add('deleteBtn');
			deleteButton.value = `${data[i]._id}`
			deleteButton.innerText = 'Ta bort';
				
			deleteButton.addEventListener('click', async e => {
                let urlDeleteBook = `http://localhost:1337/api/boat?id=${deleteButton.value}`
                console.log('uLDDD ', urlDeleteBook);
                try {
                console.log('About to send a delete request');
				const response = await fetch(urlDeleteBook, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'DELETE'
                });
                
			    const data = await response.json();
                console.log('Response data: ', data);

                deleteButton.innerText = 'Borttagen';
                deleteButton.disabled = true;
                deleteButton.classList.add('deleteBtnDeleted')

                } catch(error){
                    let errorMessage = document.createElement('li');
                    console.error(error)
                    if( error.message.startsWith('Unexpected token') && response ) {
                        let text = response.text();
                        console.log('Response text: ', text);
                    } else {
                        errorMessage.innerHTML = 'Error! Do you have a local web server? Do you use the correct port?\n' + error.message;
                        console.log(errorMessage);
                    } 
                    deleteButton.innerText = 'Ta bort';
                    deleteButton.disabled = false;
                    deleteButton.classList.add('deleteBtn')       
                } finally {
                    show()
                }
                
                });//Deletebutton
    
				card.appendChild(deleteButton);
				
				//Modify boat object
				let modifyButton = document.createElement('button');
				modifyButton.innerText = 'Ändra';
				modifyButton.classList.add('modifyBtn');
				let buttonValueId = data[i]._id;
				modifyButton.value = buttonValueId;
				let modelMod = document.querySelector(`.${CSS.escape(buttonValueId)}model`); //Inserting variable inside queryselector parentheses
                let priceMod = document.querySelector(`.${CSS.escape(buttonValueId)}price`); //Inserting variable inside queryselector parentheses
                let yearMod = document.querySelector(`.${CSS.escape(buttonValueId)}year`); //Inserting variable inside queryselector parentheses
                let motorMod = document.querySelector(`.${CSS.escape(buttonValueId)}motor`); //Inserting variable inside queryselector parentheses
                let sailMod = document.querySelector(`.${CSS.escape(buttonValueId)}sail`); //Inserting variable inside queryselector parentheses
                let imgMod = document.querySelector(`.${CSS.escape(buttonValueId)}img`); //Inserting variable inside queryselector parentheses
                
				card.appendChild(modifyButton);

				modelMod.addEventListener('click', async e => {
					modifyButton.classList.remove('btnModified')
					modifyButton.innerText = 'Godkänn ändring';
				})
				priceMod.addEventListener('click', async e => {
					modifyButton.classList.remove('btnModified')
					modifyButton.innerText = 'Godkänn ändring';
                })
                yearMod.addEventListener('click', async e => {
					modifyButton.classList.remove('btnModified')
                    modifyButton.innerText = 'Godkänn ändring';
                })
                motorMod.addEventListener('click', async e => {
					modifyButton.classList.remove('btnModified')
					modifyButton.innerText = 'Godkänn ändring';
                })
                sailMod.addEventListener('click', async e => {
					modifyButton.classList.remove('btnModified')
					modifyButton.innerText = 'Godkänn ändring';
                })
                imgMod.addEventListener('click', async e => {
					modifyButton.classList.remove('btnModified')
					modifyButton.innerText = 'Godkänn ändring';
                })
                
				modifyButton.addEventListener('click', async e => {
                    let urlmodifyButton = `http://localhost:1337/api/boat?id=${buttonValueId}`
                    let bodyModReq = JSON.stringify({model : modelMod.innerHTML, price : priceMod.innerHTML, model_year : yearMod.innerHTML,
                    motor : motorMod.innerHTML, sail : sailMod.innerHTML, image : imgMod.innerHTML})

                    console.log('URL on modbutton ', urlmodifyButton);
                    console.log('Body  modbutton ', bodyModReq);
                    try {
                    console.log('About to send a put request');

                    const response = await fetch(urlmodifyButton, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'PUT',
                        body: bodyModReq
                    });
                    
                    const data = await response.json();
                    console.log('Response data: ', data);

                    modifyButton.classList.add('btnModified')
                    modifyButton.innerText = 'Ändra';
    
                    } catch(error){
                        let errorMessage = document.createElement('li');
                        console.error(error)
                        if( error.message.startsWith('Unexpected token') && response ) {
                            let text = response.text();
                            console.log('Response text: ', text);
                        } else {
                            errorMessage.innerHTML = 'Error! Do you have a local web server? Do you use the correct port?\n' + error.message;
                            console.log(errorMessage);
                        }
                        modifyButton.innerText = 'Ändra';
                        modifyButton.classList.add('modifyBtn')           
                    } finally {
                        show()
                    }

				});//Modify Button
					card.appendChild(modifyButton);

        };//For-loop 
        
        querystring.value = '';

    } //Try	
	catch(error) {
		let errorMessage = document.createElement('li');
        console.error(error)
        if( error.message.startsWith('Unexpected token') && response ) {
            let text = response.text();
            console.log('Response text: ', text);
            errorMessage.innerHTML = text;
            console.log(errorMessage);
        } else {
            errorMessage.innerHTML = 'Error! Do you have a local web server? Do you use the correct port?\n' + error.message;
            console.log(errorMessage);
        }
    }//Catch

};//Show boats
show();
const showBoats = document.querySelector('#showCards');
showBoats.addEventListener('click', async () => {
    show()
})

})

function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('active');
    checkboxes.forEach((item) => {
        if (item !== checkbox) 
        item.checked = false;
    })
}

function onlyOneSort(checkbox) {
    var checkboxes = document.getElementsByName('active-sort');
    checkboxes.forEach((item) => {
        if (item !== checkbox) 
        item.checked = false;
    })
}

function readSingleFile(e) {
    const name = e[0].name;
    document.getElementById("imageInput").value = name;
}


// imageInput
// JSON.stringify(name)
// console.log(name)
// document.getElementById("file-label").innerHTML = name;

async function imgListAx() {
let urlImg = `http://localhost:1337/api/imagelist`
try {
    const res = await axios.get(urlImg)
    const { data } = await res;
    return data;
} catch (error) {
    console.log(error);
    
} finally {

}

}