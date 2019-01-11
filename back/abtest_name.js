/* Problem 1 */

//Could not find "PROMOS" so instead appended An AB TASTY nav item to the front

var clonedDiv = $(".scrolling-nav").children()[4]
console.log(clonedDiv.children[2])

var itemMenu = clonedDiv.childNodes[1].childNodes[7]

itemMenu.style.color = "#529df5"
itemMenu.innerHTML = "AB TASTY"
$("#miseEnAvantSectionId").after(clonedDiv)



/* Problem 2 */

//https://advocatemasterplumbing.com/wp-content/uploads/2018/02/smiling-plumber.jpg
$(".owl-wrapper-outer").empty()

var owlWrap = $(".owl-wrapper-outer")
owlWrap.append("<a href='https://www.rtl.fr/actu/conso/posez-vos-questions-juridiques-a-l-equipe-de-julien-courbet-7773824511'><img src='https://advocatemasterplumbing.com/wp-content/uploads/2018/02/smiling-plumber.jpg'/></a>")





/* Problem 3 */

var arrOfProducts = $(".grocery-item")
var groceryItem = arrOfProducts.find(".grocery-item__normal-price")

for(var i = 0; i < groceryItem.length; i++){
    if(parseInt(groceryItem[i].innerHTML[0]) >= 3 ){
        groceryItem[i].parentNode.parentNode.parentNode.style.backgroundColor = "red"
    }
}




/* Problem 4 */

//Ran out of time


/* Problem 5 */

//Ran out of time