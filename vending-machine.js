let dataset = [
    {img:"./img/cola-red.png", text:"Original_Cola", cost:"1000", cnt : 5},
    {img:"./img/cola-purple.png", text:"Violet_Cola", cost:"1000", cnt : 5},
    {img:"./img/cola-yellow.png", text:"Yellow_Cola", cost:"1000", cnt : 5},
    {img:"./img/cola-blue.png", text:"Cool_Cola", cost:"1000", cnt : 5},
    {img:"./img/cola-green.png", text:"Green_Cola", cost:"1000", cnt : 5},
    {img:"./img/cola-orange.png", text:"Orange_Cola", cost:"1000", cnt : 5}, 
];

let basket = [];


function renderCola(){
    let frag = document.createDocumentFragment(); //가상 돔
    let itemBox = document.querySelector('.item-box');
    dataset.forEach(i=>{
        let colaImg = i.img;
        let colaTxt = i.text;
        let colaCost = i.cost;
        let newColaItem = document.createElement('li');
        newColaItem.classList.add('items');
        newColaItem.innerHTML = `<img class="items-img" src="${colaImg}" alt="" />
        <p class="items-text">${colaTxt}</p>
        <p class="items-value">${colaCost}원</p>`
        frag.appendChild(newColaItem);
    });
    itemBox.appendChild(frag);
}
renderCola(); //cola 아이템들 렌더링

let sellingItems = document.querySelectorAll('.item-box li');
let returnCoinBtn = document.querySelector('.return-coin-btn');
let insertCoinBtn = document.querySelector('.insert-coin-btn');
let getBtn = document.querySelector('.get-btn');

let leftCoinDisplay = document.querySelector('.left-coin-display');
let myMoneyDisplay = document.querySelector('.user-money-display');
let curStuffCost = document.querySelector('total-cost');

let userStuffList = document.querySelector('.user-stuff-list');
let userItemList = document.querySelector('.user-list');

let userTotalCost = document.querySelector('.total-cost');

function numToMoney(num){ //숫자를 돈 쉼표 찍어주는 함수
    const money = parseInt(num).toLocaleString('ko-KR');
    return money;
}

class User{
    constructor(startMoney){
        this.money = startMoney;
        this.inputMoney = 0;
        this.curTotalCost = 0;
        this.userItems = [];
    }
    input(i){
        if(this.money<i){
            alert("잔액이 부족합니다.");
            return;
        }
        if(i <= 0){
            alert("양의 정수 값을 입력해주세요");
            return;
        }
        this.money -= parseInt(i);
        this.inputMoney += parseInt(i);
    }
    returnMoney(){
        if(this.inputMoney===0){
            alert("반환할 거스름돈이 없습니다.")
            return;
        }
        this.money += this.inputMoney;
        this.inputMoney = 0;
    }
    buy(){
        if(basket.length===0){
            alert("구매할 아이템이 없습니다.");
            return;
        }
        let sumOfCost = 0;
        let basketItems = userStuffList.querySelectorAll('li')
        basket.forEach((i,idx)=>{
            sumOfCost += parseInt(i.cost) * parseInt(i.cnt);
        });
        if(this.inputMoney<sumOfCost){
            alert("잔액이 부족합니다.");
        }else{
            this.inputMoney -= sumOfCost;
            this.curTotalCost += sumOfCost;

            basket.forEach((i,idx)=>{
                let colaName = i.name;
                let colaCost = i.cost;
                let colaCnt = i.cnt;
                let curIdx = this.userItems.findIndex(i=>i.name===colaName);

                if(curIdx===-1){
                    this.userItems.push({name:colaName,cnt:colaCnt,cost:colaCost});
                    basketItems[idx].removeEventListener('click',removeBasket);
                    userItemList.appendChild(basketItems[idx]);
                }else{
                    this.userItems[curIdx].cnt++;
                    let curItem = userItemList.querySelector(`li:nth-child(${curIdx+1})`);
                    let curCnt = curItem.querySelector('.item-cnt');
                    curCnt.innerHTML = this.userItems[curIdx].cnt;
                    basketItems[idx].remove();
                }
            });
            basket = [];
        }
    }
}

let user;

// (function initInput(){
//     let inputMoney = prompt("초기 자본을 입력해주세요");
//     if(inputMoney===""||isNaN(inputMoney)||inputMoney<=0){
//         alert("양의 정수만 입력 가능합니다.")
//         initInput();
//     }else{
//         user = new User(inputMoney);
//         console.log(user);
//         myMoneyDisplay.innerHTML=numToMoney(user.money);
//     }
// })();

user = new User(100000);
myMoneyDisplay.innerHTML=numToMoney(user.money);



insertCoinBtn.addEventListener('click',()=>{
    let inputCoin = document.querySelector("#input-coin-box");
    user.input(inputCoin.value);
    leftCoinDisplay.innerHTML = numToMoney(user.inputMoney);
    myMoneyDisplay.innerHTML = numToMoney(user.money);
    inputCoin.value = '';
});

returnCoinBtn.addEventListener('click',()=>{
    user.returnMoney();
    leftCoinDisplay.innerHTML = numToMoney(user.inputMoney);
    myMoneyDisplay.innerHTML = numToMoney(user.money);
});

getBtn.addEventListener('click',()=>{
    user.buy();
    leftCoinDisplay.innerHTML = numToMoney(user.inputMoney);
    userTotalCost.innerHTML = `총금액: ${numToMoney(user.curTotalCost)} 원`;
});



sellingItems.forEach(i=>{
    i.addEventListener("click",(e)=>{
        if(e.target.nodeName==="DIV"){
            alert("품절입니다.")
        }else{
            moveItemToBasket(i);
        }
    });
});

function moveItemToBasket(item){
    let newLi = document.createElement('li');
    let imgSrc = item.querySelector('.items-img').src;
    let colaName = item.querySelector('.items-text').innerHTML;
    let colaCost = item.querySelector('.items-value').innerHTML;
    let idx = basket.findIndex(i=>i.name===colaName);
    if(idx===-1){//추가되는 콜라이름이 장바구니에 없다.
        basket.push({name:colaName,cnt:1,cost:colaCost});
        newLi.classList.add('list-items');
        newLi.innerHTML = `<img class="list-items-img" src="${imgSrc}" alt="" />
        <p class="items-text">${colaName}</p>
        <div class="item-cnt">1</div>`
        userStuffList.appendChild(newLi);
        newLi.addEventListener('click',removeBasket);
    }else{//추가되는 콜라이름이 장바구니에 있다.
        basket[idx].cnt++;
        let curItem = userStuffList.querySelector(`li:nth-child(${idx+1})`);
        let curCnt = curItem.querySelector('.item-cnt');
        console.log(curCnt);
        curCnt.innerHTML = basket[idx].cnt;
    }
    decreaseDataset(colaName);
}

function decreaseDataset(colaName){
    let itemBox = document.querySelector('.item-box');
    let idx = dataset.findIndex(i=>i.text===colaName);
    dataset[idx].cnt--;
    if(dataset[idx].cnt===0){
        let curItem = itemBox.querySelector(`li:nth-child(${idx+1})`);
        let soldOut = document.createElement('div');
        soldOut.classList.add("sold-out");
        curItem.appendChild(soldOut);
    }
}

function removeBasket(event){
    let datasetIdx = dataset.findIndex(i => i.text === event.target.closest('li').querySelector('.items-text').innerHTML);
    let basketIdx = basket.findIndex(i => i.name === event.target.closest('li').querySelector('.items-text').innerHTML);
    console.log(datasetIdx);
    console.log(basketIdx);
    if(basket[basketIdx].cnt===1){
        dataset[datasetIdx].cnt++;
        basket[basketIdx].cnt--;
        basket.splice(basketIdx,1);
        event.target.closest('li').remove();
    }else{
        dataset[datasetIdx].cnt++;
        basket[basketIdx].cnt--;
        event.target.closest('li').querySelector('.item-cnt').innerHTML=basket[basketIdx].cnt;
        if(dataset[datasetIdx].cnt===1){
            let itemBox = document.querySelector('.item-box');
            let curItem = itemBox.querySelector(`li:nth-child(${datasetIdx+1})`);
            curItem.querySelector('div').remove();
        }
    }
}