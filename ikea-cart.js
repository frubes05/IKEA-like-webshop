class CartsPage {
  constructor() {
    this.selected = [];
    this.duplicatesArray = [];
    this.elementsSum = [];
    this.#bindEventsAgain();
    this.burgerNavigation=document.querySelector(".burger__navigation");
    this.body=document.querySelector("body");
    this.overlay=document.querySelector(".overlay")
  }

  selectedItems(e) {
    let selectedItems = JSON.parse(localStorage.getItem("myproducts"));
    document.querySelector(
      ".navigation__secondary-item--num"
    ).innerHTML = `${selectedItems.length}`;

    fetch("jsons/products_all.json")
      .then((response) => response.json())
      .then((data) => {
        data = data.moreProducts.productWindow;
        data = data.filter((elem) => {
          selectedItems.forEach((element) => {
            if (elem.id === element) {
              this.selected.push(elem);
            }
          });
        });
        this.unique = this.uniqueValues(this.selected);
        this.unique = Array.from(this.unique);
        this.unique = this.findDuplicates(this.unique, this.selected);
        this.generateMultipleOptions(this.unique);
        let sum = this.getTotalSum(this.unique);
        sum = sum.split(".");
        document.querySelector(".aside-bar__sum-price").innerHTML = `${sum}`;
        let ractive = new Ractive({
          target: ".cart-section__list",
          template: "#selectedTemplate",
          data: {
            selected: this.unique,
          },
        });
        let label=document.querySelector(".instructions__form-label--link");
        let priceDiv=label.parentElement.previousElementSibling.lastElementChild.innerHTML;
        let price=Number(priceDiv.split(",").join("."));
        localStorage.setItem("currentPrice",price.toFixed(2));
      });

    e.preventDefault();
  }

  generateMultipleOptions(arr){
    let elements=[];
    let obj={};
    arr.forEach((elem,index)=>{
        for(let i=0;i<=elem.amount+5;i++){
          let opt=document.createElement("option");
          opt.dataset.optionNumber=`${i+1}`;
          obj[`option-${i+1}`]=opt;
        }
        elements.push(obj);
    })
    let selects=document.querySelectorAll(".cart-section__quantity");
    selects.forEach((select,index)=>{
      Object.keys(elements).forEach((element)=>{
        if(element===index.toString()){
         let optionLength=Object.values(elements[index]);
          for(let i=0;i<optionLength.length;i++){
            let option=new Option(`${i+1}`,`${i+1}`);
            select.add(option);
          }
        }
      })
    })
  }

  uniqueValues(selectedArray) {
    let newSet = new Set(selectedArray);
    return newSet;
  }

  findDuplicates(unique, duplicates) {
    unique.forEach((elem) => {
      elem.amount = 0;
    });
    unique.forEach((element, index) => {
      for (let i = index; i <= duplicates.length - 1; i++) {
        if (element.id === duplicates[i].id) {
          element.amount++;
        }
      }
    });
    localStorage.setItem("unique", JSON.stringify(unique));
    return unique;
  }

  getTotalSum(allElements) {
    console.log(allElements);
    allElements.forEach((elem) => {
      this.elementsSum.push(Number(elem.amount * elem.priceNumeral).toFixed(2));
    });
    this.elementsSum = this.elementsSum.reduce(
      (acc, curr) => Number(acc) + Number(curr),
      0
    );
    return this.elementsSum.toFixed(2);
  }

  removeItem(e) {
    if (e.target.classList.contains("cart-section__remove")) {
      document.querySelector(".instructions__checkbox-input").checked=false;
      let list = e.target.parentElement.parentElement;
      let liElement = list.firstElementChild;
      let listElement =
        liElement.parentElement.parentElement.parentElement.parentElement;
      let selectedId = liElement.firstElementChild.firstElementChild.dataset.id;
      let amount =
        list.firstElementChild.firstElementChild.firstElementChild.innerHTML;
      amount = Number(amount);
      console.log(amount);
      if (amount > 1) {
        amount=amount-amount;
        let specific = document.querySelectorAll(".cart-section__option");
        console.log(specific);
        specific.forEach((elem) => {
          if (elem.dataset.id === selectedId) {
            listElement.remove();
            elem.innerHTML = `${amount}`;
            let localRemove = JSON.parse(localStorage.getItem("myproducts"));
            let index = localRemove.findIndex((elem) => elem === selectedId);
            console.log(localRemove);
            let elements=localRemove.filter((elem)=>elem!==selectedId);
            console.log(elements);
            // console.log(localRemove);
            // let remove = localRemove.splice(index, 1);
            localStorage.setItem("myproducts", JSON.stringify(elements));
            document.querySelector(
              ".navigation__secondary-item--num"
            ).innerHTML = `${elements.length}`;
            let price =
              listElement.firstElementChild.lastElementChild.firstElementChild
                .innerHTML;
            price = price.replace(",", ".").split(" ")[0];
            let currAllDiv = document.querySelector(".aside-bar__sum-price");
            let currAll=localStorage.getItem("currentPrice");
            let sum = currAll//.replace(",", ".");
            sum = Number(sum) - (Number(price)*(localRemove.length-elements.length));
            localStorage.setItem("currentPrice",sum.toFixed(2));
            currAllDiv.innerHTML = `${sum.toFixed(2).split(".")}`;
          }
        });
      } else {
        document.querySelector(".instructions__checkbox-input").checked=false;
        listElement.remove();
        let localRemove = JSON.parse(localStorage.getItem("myproducts"));
        let index = localRemove.findIndex((elem) => elem === selectedId);
        let remove = localRemove.splice(index, 1);
        localStorage.setItem("myproducts", JSON.stringify(localRemove));
        document.querySelector(
          ".navigation__secondary-item--num"
        ).innerHTML = `${localRemove.length}`;
        let price =
          listElement.firstElementChild.lastElementChild.firstElementChild
            .innerHTML;
        price = price.replace(",", ".").split(" ")[0];
        let currAllDiv = document.querySelector(".aside-bar__sum-price");
        let currAll=localStorage.getItem("currentPrice");
        //let sum = currAll.innerHTML.replace(",", ".");
        let sum = currAll;//.replace(",", ".");
        sum = (Number(sum) - Number(price));
        localStorage.setItem("currentPrice",sum.toFixed(2));
        currAllDiv.innerHTML = `${sum.toFixed(2).split(".")}`;
      }
    }

    e.preventDefault();
  }

  loadRandomData(){
    fetch("jsons/products_all.json")
      .then(response=>response.json())
      .then(data=>{
        let elements=this.getTenRandom(data.moreProducts.productWindow);
        console.log(elements);
        let ractive=new Ractive({
          target: ".glider",
          template: "#recommendedTemplate",
          data: {
            recommendedProducts: elements
          }
        })
      });
  }

  getTenRandom(allelements){
    let randomArr=[];
    for(let i=0;i<10;i++){
      randomArr.push(allelements[this.randomNum(allelements)]);
    }
   return randomArr;
  }

  randomNum(arr){
    return Math.floor(Math.random()*arr.length);
  }

  showFullPrice(e){
    let valueOne=localStorage.getItem("currentPrice");
    let valueTwo=Number(valueOne)+0.25*Number(valueOne);
    let currValue=(document.querySelector(".instructions__checkbox-input").checked)?localStorage.setItem("pdvPrice",valueTwo.toFixed(2)):localStorage.removeItem("pdvPrice");
    currValue=(localStorage.getItem("pdvPrice"))?localStorage.getItem("pdvPrice"):localStorage.getItem("currentPrice");
    document.querySelector(".aside-bar__sum-price").innerHTML=`${currValue.split(".").join(",")}`;
  }

  toggleVisible(e){
    if(e.target.closest(".aside-bar__discount")){
      let btn=e.target.closest(".aside-bar__discount");
      let chevron=btn.lastElementChild.firstElementChild;
      chevron.classList.toggle("aside-bar__svg-chevron--rotate");
    }
  }

  openNavigation(e){
    if(e.target.closest(".burger") || e.target.closest(".burger__navigation") && !e.target.closest(".burger__exit")){
     this.burgerNavigation.classList.add("burger__navigation-grow");
     this.body.style.overflow = "hidden";
     this.overlay.classList.add("overlay--open");
   }else if(e.target.closest(".burger__exit") || !e.target.closest(".burger__navigation")){
     this.burgerNavigation.classList.remove("burger__navigation-grow");
     this.body.style.overflow = "auto";
     this.overlay.classList.remove("overlay--open");
   }
 }


  #bindEventsAgain() {
    window.addEventListener("load", this.selectedItems.bind(this));
    document.querySelector(".cart-section__list").addEventListener("click", this.removeItem.bind(this));
    window.addEventListener("load",this.loadRandomData.bind(this));
    document.querySelector(".aside-bar").addEventListener("click",this.showFullPrice.bind(this));
    document.querySelector(".aside-bar__options").addEventListener("click",this.toggleVisible.bind(this));
    document.body.addEventListener("click",this.openNavigation.bind(this));
  }
}

new CartsPage();
