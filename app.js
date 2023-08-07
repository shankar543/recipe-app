let current_Random_Receipies={};
// const random_recipe =document.querySelector('.random_recipe');
const rand_receipie_img = document.querySelector('#rand_receipie_img')
const meals=document.querySelector('.meals');
const fav_meals_container= document.querySelector('#fav-meals-container');
let random_recipe_instructions =""
let favmeals=[];
const searchelm =document.getElementById('searchword');


async function  getRandomReceipis(){
let response =  await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
let result = await response.json()
displayReceipies(result.meals[0],true);
}

function displayReceipies(recepie,isRandom=false){
    Object.assign(current_Random_Receipies, recepie);
    console.log(recepie.strInstructions);
    //   random_recipe_instructions = current_Random_Receipies.strInstructions
let meal =document.createElement('div');
meal.classList.add("meal");
isRandom?meals.innerHTML=`<span class="random_recipe">random receipe</span>`:""
    try {
        meal.innerHTML=`
<div class="meal-header">
    <img src=${recepie.strMealThumb} alt="random receipe" id="rand_receipie_img">
<div class="vertical_info_bar">
    <button data-mydata="${JSON.stringify(recepie)}" onclick='loadInstructions(${JSON.stringify(recepie)},this)'><i class="fa-solid fa-circle-info"></i></button>
    <button><a href=${recepie.strYoutube} target="_blank"><i class="fa-brands fa-youtube"></i></a></button>
</div>
</div>
<div class="meal-body">
    <h4>${recepie.strMeal}</h4>
    <button class="fav-meal"><i class="fa-sharp fa-solid fa-heart"></i></button>
</div>
`;
    } catch (err) {
        alert("error"+err.message)
}
  meals.appendChild(meal);
let favbtn =  meal.querySelector('.fav-meal');
    favbtn.addEventListener('click',function(){
        favbtn.classList.toggle("actived")
        if(favbtn.classList.contains("actived")){
            //store id in favmeals ls
            addFavMealLS(recepie.idMeal)
        }else{
            //remove meal from ls
            removeFavMealLS(recepie.idMeal)
        }
    });
    let isfavmeal=isFavMealId(recepie.idMeal);
    if(isfavmeal){
        favbtn.click();
        favbtn.classList.add("activated");
    }else{favbtn.classList.remove("activated")}
}
function isFavMealId(id){
return getMyMeals().filter(favid=>{
   return favid==id 
}).length?true:false
}

function applyStyles(elm,width,height,pos,left,top,bottom,right,bgcolor,ptrevents,tans){
    elm.style.position=pos?pos:""
    elm.style.width=width+"%";
    elm.style.height=height+"%";
    // elm.style.overflow="scroll"
    elm.style.left=left!=-1?left+"%":"";
    elm.style.top=top!=-1?top+"%":"";
    elm.style.bottom=bottom!=-1?bottom+"%":"";
    elm.style.right=right!=-1?right+"%":"";
    elm.style.backgroundColor=bgcolor?`rgba(${bgcolor}, ${0.9})`:"";
    // elm.style['transform']=tans?`${tans}`:"";
    if (tans) {
        elm.style.transform = `translate(-50%,-50%)`;
      } else {
        elm.style.transform = "";
      }
    
    // elm.style.pointerEvents=ptrevents?ptrevents:"";
    return elm;
}
function loadInstructions(recepie, elm) {
    // console.log(elm.getAttribute("data-mydata"))
    // Object.assign(current_Random_Receipies, recepie);
    // console.log(JSON.parse(elm.getAttribute("data-mydata")))
    let meal = recepie;
        
    // console.log(random_recipe_instructions);
    let overlay = document.createElement('div');
    overlay.classList.add('overlay')
    // elm,width,height,pos,left,top,bottom,right,bgcolor,ptrevents,tans
      overlay=applyStyles(overlay,100,100,"absolute","0","0",'100','100',"0,0,0",'none',null)
    let close=document.createElement("span")
    close.classList.add('overlay_close_btn')
    close.innerText="close";
    // close=applyStyles(close,8,4,"absolute","",0,"",3,'255,255,255','none',null)
    close.addEventListener("click",function(){
        document.body.removeChild(overlay);
        document.body.removeChild(close);
        document.body.removeChild(ins_container);
    });
    let ins_container=document.createElement("div");
    ins_container.classList.add("ins_container")
    ins_container=applyStyles(ins_container,80,76,"absolute",50,50,"","",'255,255,255','',1);
    let insMealImg = document.createElement("img");
    insMealImg.src=meal.strMealThumb;
    ins_container.appendChild(insMealImg)
   
    meal.strInstructions.split('\n').forEach(ins=>{
        console.log(ins.length)
    if(ins.length){
        let para =document.createElement("p");
    para.classList.add('instructions')
    para.innerHTML=ins;
    ins_container.appendChild(para);
    }
    })

    document.body.appendChild(overlay);
    close.style.cursor="pointer"
    document.body.appendChild(close)
    ins_container.style.overflowY="scroll"
    document.body.appendChild(ins_container);
    
}
function getRandomRecipy(){
    
}
getRandomReceipis();
async function getMealById(id){
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id)
    let meal = await response.json()
    return meal.meals[0];
}
async function getMealBySearch(){
    let queryparam = searchelm.value;
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+queryparam);
    let result = await response.json()
    if(result?.meals?.length){
        meals.innerHTML=""
    }
    result.meals.forEach(meal=>{
        displayReceipies(meal);
    })
}

function togggleFavouriteMeal(){

}
function getMyMeals(){
    let mymeals=JSON.parse(localStorage.getItem("favmeals"))
    mymeals=mymeals?mymeals:[];
    return mymeals
}
function addFavMealLS(id){
let mymeals = getMyMeals();
if(isFavMealId(id)){
    return;
}    
favmeals=[...mymeals,id];
localStorage.setItem("favmeals",JSON.stringify(favmeals));
fetchFavMeals();
}
function removeFavMealLS(id){
    let mymeals=getMyMeals()
    favmeals = mymeals.filter(mealid=>id!=mealid);
    localStorage.setItem("favmeals",JSON.stringify(favmeals));
    fetchFavMeals();
}
async function fetchFavMeals(){
    fav_meals_container.innerHTML=""
    let myMealIds=getMyMeals();
    for(let i=0;i<myMealIds.length;i++){
        let meal = await getMealById(myMealIds[i])
        addFavMeal(meal)
    }
}
function addFavMeal(meal){
 let favmeal = document.createElement('li');
 favmeal.innerHTML=`<img src="${meal.strMealThumb}" alt="image1"><span>${meal.strMeal}</span>
 <button class="close-fav-meal"><i class="fa-regular fa-rectangle-xmark"></i></button>`;
 fav_meals_container.appendChild(favmeal);
 favmeal.addEventListener("click",()=>{
    meals.innerHTML=""
    displayReceipies(meal,false)
 });
 let remFavMealbtn=favmeal.querySelector('.close-fav-meal');
 remFavMealbtn.addEventListener('click',function(e){
    e.stopPropagation();
    removeFavMealLS(meal.idMeal)
 })   
}

fetchFavMeals();