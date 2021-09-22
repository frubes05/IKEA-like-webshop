// let arr = [];
// let cartItems=[];

// window.addEventListener("load", fetchSomeData);

// function fetchSomeData(e) {
//   fetch("jsons/products0.json")
//     .then((response) => response.json())
//     .then((data) => {
//       localStorage.setItem("products",JSON.stringify(data.moreProducts.productWindow));
//       arr=JSON.parse(localStorage.getItem("products"));
//       console.log(arr);
//       const url=new URL(window.location);
//       let ractive = new Ractive({
//         target: ".products__list",
//         template: "#productsTemplate",
//         data: {
//           products: arr,
//         },
//       });
//       url.searchParams.set("page","1");
//       window.history.pushState({},'',url);
//       let number=JSON.parse(localStorage.getItem("myproducts"));
//       document.querySelector(".navigation__secondary-item--num").innerHTML=`${number.length}`;
//     });

//   e.preventDefault();
// }

// let loads = 0;

// document
//   .querySelector(".show-more__button")
//   .addEventListener("click", loadMoreData);

// function loadMoreData(e) {
//   loads++;
//   const url=new URL(window.location);

//   if (loads === 1) {
//     fetchMoreData(loads);
//     url.searchParams.set("page","2");
//     window.history.pushState({},'',url);
//   } else if (loads === 2) {
//     fetchMoreData(loads);
//     url.searchParams.set("page","3");
//     window.history.pushState({},'',url);
//   } else if (loads === 3) {
//     fetchMoreData(loads);
//     url.searchParams.set("page","4");
//     window.history.pushState({},'',url);
//   } else if (loads >= 4) {
//     fetchMoreData(loads);
//     url.searchParams.set("page","5");
//     window.history.pushState({},'',url);
//   }

//   e.preventDefault();
// }

// function fetchMoreData(num) {
//   fetch(`jsons/products${num}.json`)
//     .then((response) => response.json())
//     .then((data) => {
//       arr=JSON.parse(localStorage.getItem("products"));
//       arr.push(...data.moreProducts.productWindow);
//       localStorage.setItem("products",JSON.stringify(arr));
//       arr=JSON.parse(localStorage.getItem("products"));
//       document.querySelector(".show-more__showing").innerHTML=`${arr.length}`;
//       document.querySelector(".show-more__progress-bar").style.width=`calc((${arr.length}/304)*100%)`;
//       let ractive = new Ractive({
//         target: ".products__list",
//         template: "#productsTemplate",
//         data: {
//           products: arr,
//         }
//       });
//     });
// }

// document.body.addEventListener("click",addToCart);

// function addToCart(e){
//     if(e.target.closest(".products__cart")){
//       console.log(e.target.closest(".products__cart"));
//         cartItems=JSON.parse(localStorage.getItem("myproducts"));
//         let article=e.target.closest(".products__cart");
//         cartItems.push(article.dataset.id);
//         localStorage.setItem("myproducts",JSON.stringify(cartItems));
//         document.querySelector(".navigation__secondary-item--num").innerHTML=`${cartItems.length}`;
//     }

//     e.preventDefault();
// }

class ProductsListPage {
  constructor() {
    this.arr = [];
    this.cartItems = [];
    this.loads = 1;
    this.#bindEvents();
    this.sidebar = document.querySelector(".sidebar");
    this.body = document.querySelector("body");
    this.header = document.querySelector("header");
    this.main = document.querySelector(".container");
    this.footer = document.querySelector("footer");
    this.products = document.querySelector(".products");
    this.showmore = document.querySelector(".show-more");
    this.overlay=document.querySelector(".overlay");
    this.burgerNavigation=document.querySelector(".burger__navigation");
  }

  fetchSomeData(e) {
    fetch("jsons/products0.json")
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(
          "products",
          JSON.stringify(data.moreProducts.productWindow)
        );
        this.arr = JSON.parse(localStorage.getItem("products"));
        console.log(this.arr);
        const url = new URL(window.location);
        let ractive = new Ractive({
          target: ".products__list",
          template: "#productsTemplate",
          data: {
            products: this.arr,
          },
        });
        url.searchParams.set("page", `${this.loads}`);
        window.history.pushState({}, "", url);
        let number = JSON.parse(localStorage.getItem("myproducts")) || [];
        document.querySelector(
          ".navigation__secondary-item--num"
        ).innerHTML = `${number.length}`;
      });

    e.preventDefault();
  }

  loadMoreData(e) {
    console.log(this.loads);
    const url = new URL(window.location);
    this.fetchMoreData(this.loads);
    url.searchParams.set("page", `${this.loads}`);
    window.history.pushState({}, "", url);
    this.loads++;
    e.preventDefault();
  }

  fetchMoreData(num) {
    fetch(`jsons/products${num}.json`)
      .then((response) => response.json())
      .then((data) => {
        this.arr = JSON.parse(localStorage.getItem("products"));
        this.arr.push(...data.moreProducts.productWindow);
        localStorage.setItem("products", JSON.stringify(this.arr));
        this.arr = JSON.parse(localStorage.getItem("products"));
        document.querySelector(
          ".show-more__showing"
        ).innerHTML = `${this.arr.length}`;
        console.log(this.arr.length);
        document.querySelector(
          ".show-more__progress-bar"
        ).style.width = `calc((${this.arr.length}/304)*100%)`;
        let ractive = new Ractive({
          target: ".products__list",
          template: "#productsTemplate",
          data: {
            products: this.arr,
          },
        });
      });
  }

  openSidebar(e) {
    if (e.target.closest(".products__cart")) {
      this.sidebar.classList.add("sidebar-grow--products");
      this.overlay.classList.add("overlay--open");
      this.body.style.overflow = "hidden";
      this.loadRandomData();
    } else if (
      !e.target.closest(".sidebar") ||
      e.target.closest(".sidebar__button--detail")
    ) {
      this.sidebar.classList.remove("sidebar-grow--products");
      this.overlay.classList.remove("overlay--open");
      this.body.style.overflow = "auto";
    }

    //e.preventDefault();
  }

  loadRandomData(){
    fetch("jsons/products_all.json")
      .then(response=>response.json())
      .then(data=>{
        let elements=this.getTenRandom(data.moreProducts.productWindow);
        console.log(elements);
        let ractive=new Ractive({
          target: ".cart-section__list--sidebar",
          template: "#relatedProducts",
          data: {
            related: elements,
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

  addToCart(e) {
    if (e.target.closest(".products__cart")) {
      e.preventDefault();
      this.cartItems = JSON.parse(localStorage.getItem("myproducts")) || [];
      let article = e.target.closest(".products__cart");
      this.cartItems.push(article.dataset.id);
      localStorage.setItem("myproducts", JSON.stringify(this.cartItems));
      this.cartItems = JSON.parse(localStorage.getItem("myproducts"));
      document.querySelector(
        ".navigation__secondary-item--num"
      ).innerHTML = `${this.cartItems.length}`;
      let product = e.target.closest(".products__cart");
      product =
        product.parentElement.firstElementChild.firstElementChild
          .nextElementSibling;
      let productName = product.innerHTML;
      document.querySelector(
        ".sidebar__title"
      ).innerHTML = `${productName} je upravo dodan/a u košaricu`;
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


  #bindEvents() {
    window.addEventListener("load", this.fetchSomeData.bind(this));
    document
      .querySelector(".show-more__button")
      .addEventListener("click", this.loadMoreData.bind(this));
    document.querySelector(".products__list").addEventListener("click", this.addToCart.bind(this));
    document.body.addEventListener("click", this.openSidebar.bind(this));
    document.body.addEventListener("click",this.openNavigation.bind(this));
  }
}

new ProductsListPage();
