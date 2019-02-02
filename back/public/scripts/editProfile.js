/*
 * Raj Mahal
 * November 2018
 *
 * Edit Profile
 * Employee Directory
 * 
*/


$.ajax({
  method: "GET",
  url: 'https://rmahal.com/projects/empdir/hr/employee/'+localStorage.getItem("id"),
  success: function succ(succ) {
    //console.log("SUCC")
    //console.log(succ)
    if(succ.length < 1){
      console.log("LESS THAN 1 WAS HIT")
      window.location.assign("../");
    }
  },
  error: function err(err){
    console.log(err)
  }
})


//const baseURL = 'https://rmahal.com/projects/empdir/back'
const baseURL = 'https://rmahal.com/projects/empdirTest/back'
const current_userID = localStorage.getItem('id')

// Set up page with current user on first load

// url_user = `${baseURL}/userext/${current_userID}`
let url_user = `${baseURL}/userext/${current_userID}`
let userAttributes = ""

if(localStorage.getItem("name") === null){
  window.location.assign("/")
}else{
  let googleimg = ""
  $("#fullname").text(localStorage.getItem("name"))
  if(localStorage.getItem("type") == "google"){
    googleimg = localStorage.getItem("img")
  }else{
    googleimg = "../"+localStorage.getItem("img")
  }
  $(".googleImg").attr("src", googleimg)
}


$.ajax({
  method: "GET",
  url: "https://rmahal.com/projects/empdirTest/back/getEditInfo/"+localStorage.getItem("id"),
  success: function success(succ) {
    console.log("Success, data retrieved: ")
    console.log(succ)
    handleData(succ)
    
  },
  error: function error(err){
    console.log(err)
  }
})



function handleData(data)
{ 
    populateContacts(data);
    populateTags(data.tags)
}

function populateTags(data){
  //console.log(data)
  let compiledTags = ""
  if(data.length >= 1){
    //console.log("not broken yet")
    compiledTags+=data[0].tag.TagName
    //console.log(compiledTags)
    for(let i=1 ; i< data.length; i++){
      //console.log("i was hit")
      compiledTags+="," 
      compiledTags+=data[i].tag.TagName
    }
  }
  console.log("Compiled Tags:")
  console.log(compiledTags)
  $("#inputTags").html(compiledTags)
}

function populateContacts(data){
    console.log("POPULATING CONTACTS")
    let rows = $('#contactRows');
    console.log("ROWS CONTACTS POPULATE DATA")
    console.log(rows)
    console.log("DATA PASSED IN:")
    console.log(data)
    let contacts = data.contacts;
    let len = contacts.length;

    if (len <= 0)
    {
        return;
    }

    let finalId = --rows.data().iterations;
    rows.attr('data-iterations', finalId);

    for (let i = 0; i < len; i++)
    {
        let name = contacts[i].Label;
        let value = contacts[i].Value; // stringified HTML object
            value = $(value); // casted to DOM object (jQ)
            value = value[0].innerHTML; // obtain inner value

        let id = ++rows.data().iterations;

        rows.attr('data-iterations', id);
        
        createContact(name, value, id)
    }

    $("#contactData-0").remove();
    
}

function createContact(name, value, id)
{    
    let newRow = $("#contactData-0").clone();
    newRow.attr('id', `contactData-${id}`);

    let children = newRow.children();
        
    let contactNameDOM = children[1];
    let contactValueDOM = children[2];
    contactNameDOM.childNodes[1].value = name;
    contactValueDOM.childNodes[1].value = value;

    newRow.appendTo('#contactRows');
}




// retrieve user attributes information from the server to populate as editable text
fetch(url_user)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    userAttributes = myJson  

    // Pre-populate overview, mobile, tags, contacts

    // populate the image URL
    let current_image = `${baseURL}/${userAttributes.PhotoURL}`
    let img_tag = document.createElement('img')
    img_tag.src = current_image
    img_tag.height = 200
    img_tag.width = 200

    let profilePicCurrent = document.getElementById('profile-pic')
    profilePicCurrent.removeChild(profilePicCurrent.children[0])
    profilePicCurrent.append(img_tag)

    // overview - inputOverviewText
    // mobile - inputMobilePhone

    document.getElementById('inputOverviewText').value = userAttributes.OverviewText
    document.getElementById('inputMobilePhone').value = userAttributes.MobilePhone

    // TODO: Tags, Contacts
    // tags - inputTags
    // contacts - inputContact
});

// Set up drag and drop functionality

// get a pointer to the drop zone
let dropArea = document.getElementById('drop-area')

// add listeners
// dragenter -- entering the drop zone, so highlight
// dragleave -- leaving the drop zone, so unhighlight
// dragover -- within the drop zone, so highlight
// drop -- drop item in the drop zone, so unhighlight and do something with file
dropArea.addEventListener('dragenter', handlerFunction, false)
dropArea.addEventListener('dragleave', handlerFunction, false)
dropArea.addEventListener('dragover', handlerFunction, false)
dropArea.addEventListener('drop', handlerFunction, false)

function handlerFunction(e) {}

// for all events, prevent propagation
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

// highlight area when entering or dragging over an iteam the drop zone
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

// unhighlight if leaving drop zone or if item is dropped
;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

// 2nd listener to drop, this will do something with file
dropArea.addEventListener('drop', handleDrop, false)

// get a pointer to the file(s)
function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)

}

// for each file, do an upload
function handleFiles(files) {
  files = [...files]
  files.forEach(previewFile)
  files.forEach(uploadFile)
}

function uploadFile(file) {
  let id = localStorage.getItem('id')
  //let id = '101' //hardcoding for demo.  This should be replaced by line above
  let url = baseURL + '/editProfile/' + id
  let file_ext = file.name.split('.').pop().toLowerCase()
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let obj = {"image" : reader.result, "fileExt" : file_ext, "id" : id}
    console.log(`New profile pic,has been saved to the server: ` + JSON.stringify(obj))
    fetch(url, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(obj)
    })
    .then(() => { 
	console.log(`New profile pic,has been saved to the server: ` + JSON.stringify(obj))
	window.location.reload(true) 
     })
    .catch((err) => { console.log("Error: Profile-pic save to server "+err)})
  }
  let setImg = "img/profilepics/"+localStorage.getItem('id')+"."+file_ext
  window.localStorage.setItem("img", setImg)
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    img.height = 200
    img.width = 200
    let profilePic = document.getElementById('profile-pic')
    profilePic.removeChild(profilePic.children[0])
    profilePic.appendChild(img)
  }
}


$("#searchBar").keypress((e)=>{
  if (e.keyCode === 13) {
          e.preventDefault();
          document.getElementById("searchButton").click();
      }
  })

  $("#searchButton").on("click", ()=>{
  let val = $("#searchBar").val()
  //console.log(val)
  window.location.assign("../search?search="+val)
})




$('form').on('submit', e=>{
  //e.preventDefault();

      //console.log($('form').serialize())
      let pageId = parseInt($("#editButton").data("id")[0])
      $.ajax({
          method: 'PUT',
          data: $('form').serialize(),
          url: "/userext/"+pageId ,
          success: titleSuccess,
          error: titleError
      
      });


      function titleSuccess (response) {
          console.log(response)
      }
      function titleError (response) {
          console.log(response)
      }
})



function addRow()
{
    /* Iterate the counter of rows */
    let rows = $('#contactRows');
    let iterations = rows.data('iterations');
    let newId;

    switch(typeof iterations)
    {
        case 'undefined':
            newId = 0;
            break;
        case 'number':
            newId = ++rows.data().iterations;
            break;
        default:
            break;
    }

    rows.attr('data-iterations', newId);

    /* Create and add new element to the DOM */
    let newRow = $("#contactData-0").clone();
    newRow.find('label').remove()
    newRow.find("#inputContact").val("");
    newRow.find("#inputContactValue").val("");
    newRow.find("#inputContact").val("");

    newRow.attr('id', `contactData-${newId}`);
    newRow.appendTo('#contactRows');
}

function prepData(){

    let payload = [];
    let invalidArr = [];
    let sendDataBool = true;
    let overviewTrigger = false;
    let mobileTrigger = false;
    let contactTrigger = false;

    hideBanners();
    /* Obtain Overview Text, Mobile Phone, and Tags Data */
    
    let ovVal = $('#inputOverviewText').val();
    let mobileVal = $('#inputMobilePhone').val();
    // let tags = $('inputTags');

    let data = {
        "id": localStorage.getItem("id"),
        "overview-text": ovVal,
        "mobile-phone": mobileVal
    };
    console.log("MOBILE VAL:")
    console.log(mobileVal)
    sendDataBool = checkMobileNum(mobileVal)

    if(sendDataBool == false){
      mobileTrigger = true;
    }

    if(ovVal == ""){
      overviewTrigger = true;
      sendDataBool = false;
    }else{
      payload.push(data);
    }

    /* ************ */

    /* Obtain Contact Data */
    let topLevelChildren = $('#contactRows').children();
    let counter = $('#contactRows').data('iterations') + 1;
    console.log("PREPDATA Function:")
    console.log(topLevelChildren)
    for (let i = 0; i < counter; i++){

        let tempId = `contactData-${i}`;
        let child = topLevelChildren[i];
        console.log("Iterator at: "+i)
        let subChildren = child.childNodes;
        console.log("Sub Children: ")
        console.log(subChildren)
        let contactNameElem = subChildren[3];
        let contactValueElem = subChildren[5];

        let contactName = contactNameElem.childNodes[1].value;
        let contactValue = contactValueElem.childNodes[1].value;
        if( (contactName === "" && contactValue !== "" )|| (contactName !== "" && contactValue === "")){
          console.log("Null contact was hit")
          invalidArr.push(i)
          contactTrigger = true;
          sendDataBool = false;
        }
        let data = {
            "name": contactName,
            "val": contactValue
        };
        
        payload.push(data);
    }

    /* ************ */
    let tagString = $("#inputTags").val()
    console.log("TAGS")
    console.log(tagString);
    let tagsFromString = tagString.split(",");
    let tagData = tagsFromString.filter(tag => tag !== "");

    if(sendDataBool === true){
    console.log("DATA SENDING!");
    console.log("Tags:")
    console.log(tagData)
    sendData(payload, tagData);
    }else{
      console.log("DATA NOT SENT!");
      if(overviewTrigger){
        console.log("Overtrigger = "+overviewTrigger)
        setOverviewDangerBanner();
      }
      if(mobileTrigger){
        console.log("Mobiletrigger = "+mobileTrigger)
        setMobileDangerBanner();
      }
      if(contactTrigger){
        console.log("Contacttrigger = "+contactTrigger)
        setContactDangerBanner(invalidArr);
      }
      console.log("sendDataBool = "+sendDataBool)
      //setDangerBanner();
      payload = [];
    }
}



function sendData(obj, tagData){


  //https://rmahal.com/projects/empdir/back/allTags
  let editURL = "https://rmahal.com/projects/empdirTest/back/editInfo/"+obj[0].id


  $.ajax({
    method: "POST",
    url: editURL,
    data:{
      payload: obj,
      tags: tagData,
    },
    success: function success(succ) {
      console.log("Success, done saving")
      hideBanners();
      setSuccessBanner();
    },
    error: function error(err){
      console.log(err)
      hideBanners();
      setDangerBanner();
    }
  })
}

function checkMobileNum(phoneInput){
  let mobileExpression = new RegExp('[^0-9]')
  let regex = /^\d{3}-\d{3}-\d{4}?$/;
  let regexTwo = /^\+\d{1,2}-\(\d{3}\)-\d{3}-\d{4}?$/;
  
  if(regex.test(phoneInput)|| regexTwo.test(phoneInput)){
    return true
  }else{
    return false
  }
}

function hideBanners(){
  let succBanner = $('#successBanner');
  let dangBanner = $('#dangerBanner');
  let overviewDangerBanner = $('#overviewDangerBanner');
  let mobileDangerBanner = $('#mobileDangerBanner');
  let contactDangerBanner = $('#contactDangerBanner');

  dangBanner.hide();
  succBanner.hide();
  overviewDangerBanner.hide();
  mobileDangerBanner.hide();
  contactDangerBanner.hide();

  console.log("clearing set values")
  $('#inputOverviewText').css({ "border": "0", "background-color": "transparent"})
  $('#inputMobilePhone').css({ "border": "0", "background-color": "transparent"})
  $('#contactRows').find('input').css({ "border": "0", "background-color": "transparent"})


  return 0;
}

function setDangerBanner(){
  let banner = $('#dangerBanner');
  banner.html(`<strong>Error! Missing/Invalid values data not sent!</strong>`);
  banner.show();
  window.scrollTo(0, 0);
  return 0;
}

function setSuccessBanner(){
  let banner = $('#successBanner');
  banner.html(`<strong>Success!</strong>`);
  banner.show();
  window.scrollTo(0, 0);
  return 0;
}

function setOverviewDangerBanner(){
  let banner = $('#overviewDangerBanner');
  banner.html(`<strong>Overview is empty please type something into Overview Text!</strong>`);
  banner.show();
  window.scrollTo(0, 0);
  $('#inputOverviewText').css({ "border": "5px solid #ffdddd", "background-color": "#ffdddd"})
  return 0;
}

function setMobileDangerBanner(){
  console.log("Mobile Danger Banner Hit")
  let banner = $('#mobileDangerBanner');
  banner.html(`<strong>Invalid Phone Format. Valid format: ###-###-#### !</strong>`);
  banner.show();
  window.scrollTo(0, 0);
  $('#inputMobilePhone').css({ "border": "5px solid #ffdddd", "background-color": "#ffdddd"})
  return 0;
}

function setContactDangerBanner(arr){
  let banner = $('#contactDangerBanner');
  banner.html(`<strong>Invalid contact data, missing either Contact Name or Contact Value input!</strong>`);
  banner.show();
  window.scrollTo(0, 0);
  for(let i = 0; i<arr.length; i++){
    $('#contactData-'+arr[i]).find('input').css({ "border": "5px solid #ffdddd", "background-color": "#ffdddd"})
  }
  return 0;
}