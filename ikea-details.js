class DetailsPage {
  constructor() {
    this.#bindEvents();
    this.sidebar = document.querySelector(".sidebar");
    this.body = document.querySelector("body");
    this.header = document.querySelector("header");
    this.sectionOne = document.querySelector(".section-one");
    this.sectionTwo = document.querySelector(".section-two");
    this.aside = document.querySelector(".aside");
    this.sectionThree = document.querySelector(".section-three");
    this.sectionFour = document.querySelector(".section-four");
    this.footer = document.querySelector("footer");
    this.cartNumber = document.querySelector(
      ".navigation__secondary-item--num"
    );
    this.cartList = document.querySelector(".cart-section__list--sidebar");

    this.mediaquery = 899;
    this.sectionImages = document.querySelector(".section-one__images");
    this.clicks = 0;
    this.overlay=document.querySelector(".overlay");
    this.burgerNavigation=document.querySelector(".burger__navigation");
  }

  openSidebar(e) {
    if (e.target.closest(".products__info-button")) {
      this.overlay.classList.add("overlay--two");
      this.sidebar.classList.add("sidebar-grow");
      this.bodyOverflow.style.overflow = "hidden";
    } else if (
      !e.target.closest(".sidebar") ||
      e.target.closest(".sidebar__button--detail")
    ) {
      this.sidebar.classList.remove("sidebar-grow");
      this.overlay.classList.remove("overlay--two");
    }

    // e.preventDefault();
  }

  getCartInfo(e) {
    let cartInfo = JSON.parse(localStorage.getItem("myproducts"));
    this.cartNumber.innerHTML = `${cartInfo.length}`;

    e.preventDefault();
  }

  showGlider(e) {
    let width = window.innerWidth;

    if (width < this.mediaquery) {
      this.sectionImages.classList.add(
        "glider-contain",
        "multiple",
        "glider-mobile"
      );
      this.sectionImages.innerHTML = `
            <button class="glider-prev glider-prev--detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
                      </button>
                      <div class="glider">
                        <img
                        src="./assets/jastuk.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      <img
                        src="./assets/jastuk2.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      <img
                        src="./assets/jastuk3.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      </div>
                      <button class="glider-next glider-next--detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>
                      </button>
                      `;
      new Glider(document.querySelector(".glider"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        arrows: {
          prev: ".glider-prev",
          next: ".glider-next",
        },
      });
    } else if (width > this.mediaquery) {
      this.sectionImages.innerHTML = `
            <div class="section-one__images">
                        <img
                        src="./assets/jastuk.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      <img
                        src="./assets/jastuk2.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      <img
                        src="./assets/jastuk3.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                    </div>`;
    }
    e.preventDefault();
  }

  checkGlider(e) {
    let width = window.innerWidth;

    if (width < this.mediaquery) {
      this.sectionImages.classList.add("glider-contain", "multiple");
      this.sectionImages.innerHTML = `
                      <div class="glider">
                        <img
                        src="./assets/jastuk.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      <img
                        src="./assets/jastuk2.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      <img
                        src="./assets/jastuk3.webp"
                        alt="jastuk"
                        class="section-one__image"
                      />
                      </div>
                      `;
      new Glider(document.querySelector(".glider"), {
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        arrows: {
          prev: ".glider-prev",
          next: ".glider-next",
        },
      });
    }
  }

  openSidebarInfo(e) {
    if (e.target.closest(".cart-section__products--detail")) {
      if (this.clicks === 0) {
        let svg =
          e.target.firstElementChild.nextElementSibling.firstElementChild;
        svg.style.transform = `rotate(-90deg)`;
        let informations = e.target.nextElementSibling;
        informations.classList.add("cart-section__products--open");
        this.clicks++;
      } else if (this.clicks === 1) {
        let svg =
          e.target.firstElementChild.nextElementSibling.firstElementChild;
        svg.style.transform = `rotate(90deg)`;
        let informations = e.target.nextElementSibling;
        informations.classList.remove("cart-section__products--open");
        this.clicks--;
      }
    }
    // e.preventDefault();
  }

  loadRandomData() {
    fetch("jsons/products_all.json")
      .then((response) => response.json())
      .then((data) => {
        let elements = this.getTwentyRandom(data.moreProducts.productWindow);
        let sectionFour = this.getTwentyRandom(data.moreProducts.productWindow);
        this.sectionFourImages(sectionFour);
        let sectionThree = this.getTwentyRandom(
          data.moreProducts.productWindow
        );
        this.sectionThreeImages(sectionThree);
        let sectionTwo = this.getTwentyRandom(data.moreProducts.productWindow);
        this.sectionTwoImages(sectionTwo);
        let ractive = new Ractive({
          target: ".glider__three",
          template: "#detailsTemplate",
          data: {
            products: elements,
          },
        });
      });
  }

  getTwentyRandom(allelements) {
    let randomArr = [];
    for (let i = 0; i < 20; i++) {
      randomArr.push(allelements[this.randomNum(allelements)]);
    }
    return randomArr;
  }

  randomNum(arr) {
    return Math.floor(Math.random() * arr.length);
  }

  sectionTwoImages(elements) {
    let sectionTwo = this.getTwentyRandom(elements);
    let ractive = new Ractive({
      target: ".glider__2",
      template: "#similarTemplate",
      data: {
        products: elements,
      },
    });
  }

  sectionFourImages(elements) {
    let sectionFour = this.getTwentyRandom(elements);
    let ractive = new Ractive({
      target: ".glider__4",
      template: "#detailsTemplate",
      data: {
        products: elements,
      },
    });
  }

  sectionThreeImages(elements) {
    let sectionThree = this.getTwentyRandom(elements);
    let ractive = new Ractive({
      target: ".glider__3",
      template: "#alsoTemplate",
      data: {
        products: elements,
      },
    });
  }

  loadMoreProducts(e) {
    this.loadRandomData();
  }

  loadAllGliders(e) {
    for (let i = 2; i <= 4; i++) {
      if(i===2){
        new Glider(document.querySelector(`.glider__${i}`), {
          slidesToShow: 2,
          slidesToScroll: 1,
          draggable: true,
          arrows: {
            prev: `.glider-prev__${i}`,
            next: `.glider-next__${i}`,
          },
        });
      }else{
        new Glider(document.querySelector(`.glider__${i}`), {
          slidesToShow: 1,
          slidesToScroll: 1,
          draggable: true,
          arrows: {
            prev: `.glider-prev__${i}`,
            next: `.glider-next__${i}`,
          },
        });
      }
      
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
    window.addEventListener("load", this.getCartInfo.bind(this));
    window.addEventListener("resize", this.showGlider.bind(this));
    window.addEventListener("load", this.checkGlider.bind(this));
    document.body.addEventListener("click", this.openSidebar.bind(this));
    document.body.addEventListener("click", this.openSidebarInfo.bind(this));
    window.addEventListener("load", this.loadMoreProducts.bind(this));
    window.addEventListener("load", this.loadAllGliders.bind(this));
    document.body.addEventListener("click",this.openNavigation.bind(this));
  }
}

new DetailsPage();
