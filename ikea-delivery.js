class CalculationsPage {
  constructor() {
    this.#bindEvents();
    this.sidebar = document.querySelector(".sidebar");
    this.body = document.querySelector("body");
    this.header = document.querySelector("header");
    this.instructions = document.querySelector(".instructions");
    this.asidebar = document.querySelector(".aside-bar");
    this.footer = document.querySelector("footer");
    this.cartList = document.querySelector(".cart-section__list--sidebar");
    this.cartListItems = document.querySelector(".cart-section__list-items");
    this.overlay = document.querySelector(".overlay");
    this.sidebarOrder = document.querySelector(".sidebar__order");
  }

  #populateSidebar() {
    let selected = JSON.parse(localStorage.getItem("unique"));
    let ractive = new Ractive({
      target: ".cart-section__list-items",
      template: "#selectedProducts",
      data: {
        selectedProducts: selected,
      },
    });
  }

  choosenProducts(e) {
    document
      .querySelector(".instructions__payment-rates")
      .classList.add("instructions__payment-rates--close");
    let selected = JSON.parse(localStorage.getItem("myproducts"));
    selected = this.filterSpecificElements(selected);
    if (selected.length < 4) {
      document.querySelector(".aside-bar__few").style.display = "block";
      document.querySelector(".aside-bar__plus-more").style.display = "none";
      let ractive = new Ractive({
        target: ".section-two__list--instructions",
        template: "#choosenProducts",
        data: {
          choosenProducts: selected,
        },
      });
    } else if (selected.length >= 4) {
      let initial = selected.length;
      let firstItems = selected.splice(0, 3);
      selected = firstItems;
      document.querySelector(".aside-bar__few").style.display = "none";
      let remainder = initial - firstItems.length;
      document.querySelector(
        ".aside-bar__plus-more"
      ).innerHTML = `${remainder}`;
      document.querySelector(".aside-bar__more").style.display = "block";
      let ractive = new Ractive({
        target: ".section-two__list--instructions",
        template: "#choosenProducts",
        data: {
          choosenProducts: selected,
        },
      });
    }
  }

  filterSpecificElements(selectedElements) {
    let storingArr = [];
    let unique = JSON.parse(localStorage.getItem("unique"));
    selectedElements = new Set(selectedElements);
    selectedElements = Array.from(selectedElements);
    selectedElements.forEach((element) => {
      storingArr.push(...unique.filter((elem) => elem.itemNo === element));
    });
    return storingArr;
  }

  openSidebar(e) {
    if (
      e.target.closest(".aside-bar__button--more") ||
      e.target.closest(".instructions__form-label--link-two") ||
      e.target.closest(".instructions-package__delivery-btn") ||
      e.target.closest(".instructions-package__change")
    ) {
      this.sidebar.classList.add("sidebar-grow");
      this.cartList.style.overflowY = "scroll";
      this.body.style.overflow = "hidden";
      this.overlay.classList.add("overlay--open");
      if (
        e.target.closest(".instructions-package__delivery-btn") ||
        e.target.closest(".instructions-package__change")
      ) {
        this.#getLocationsData();
        document
          .querySelector(".aside-bar__payment--active-two")
          .classList.remove("aside-bar__payment--active-blue");
        document.querySelector(
          ".aside-bar__payment--active-two"
        ).disabled = true;
        document
          .querySelector(".cart-section__list")
          .classList.add("cart-section__locations");
        document.querySelector(".sidebar__white--one").style.display = "none";
        document.querySelector(".sidebar__white").style.display = "block";
        document.querySelector(".sidebar__button-options").style.display =
          "flex";
        document.querySelector(".sidebar__locations-choice").style.display =
          "flex";
      } else if (
        e.target.closest(".aside-bar__button--more") ||
        e.target.closest(".instructions__form-label--link-two")
      ) {
        this.#populateSidebar();
        document
          .querySelector(".cart-section__list")
          .classList.remove("cart-section__locations");
        document.querySelector(".sidebar__white--one").style.display = "block";
        document.querySelector(".sidebar__white").style.display = "none";
        document.querySelector(".sidebar__button-options").style.display =
          "none";
        document.querySelector(".sidebar__locations-choice").style.display =
          "none";
      }
    } else if (
      !e.target.closest(".sidebar") ||
      e.target.closest(".sidebar__button--detail")
    ) {
      this.sidebar.classList.remove("sidebar-grow");
      this.overlay.classList.remove("overlay--open");
      this.body.style.overflow = "auto";
    }
  }

  getRealPrices(e) {
    if (localStorage.getItem("pdvPrice")) {
      document.querySelector(".js-checkbox").checked = true;
      let pdvPrice = localStorage.getItem("pdvPrice");
      let normalPrice = localStorage.getItem("currentPrice");
      document.querySelector(".js-whole__price").innerHTML = `${pdvPrice
        .split(".")
        .join(",")}`;
      document.querySelector(".js-payment__price").innerHTML = `${pdvPrice
        .split(".")
        .join(",")}`;
      document.querySelector(".js-normal__price").innerHTML = `${normalPrice
        .split(".")
        .join(",")}`;
      document.querySelector(".js-pdv").innerHTML = `${(pdvPrice - normalPrice)
        .toFixed(2)
        .split(".")
        .join(",")}`;
      document.querySelector(
        ".js-whole__price--sidebar"
      ).innerHTML = `${pdvPrice.split(".").join(",")}`;
      document.querySelector(
        ".js-normal__price--sidebar"
      ).innerHTML = `${normalPrice.split(".").join(",")}`;
      document.querySelector(".js-pdv--sidebar").innerHTML = `${(
        pdvPrice - normalPrice
      )
        .toFixed(2)
        .split(".")
        .join(",")}`;
    } else {
      document.querySelector(".js-checkbox").checked = false;
      let pdvPrice = localStorage.getItem("pdvPrice");
      let normalPrice = localStorage.getItem("currentPrice");
      pdvPrice = 0.25 * normalPrice;
      document.querySelector(".js-whole__price").innerHTML = `${normalPrice
        .split(".")
        .join(",")}`;
      document.querySelector(".js-payment__price").innerHTML = `${normalPrice
        .split(".")
        .join(",")}`;
      document.querySelector(".js-normal__price").innerHTML = `${normalPrice
        .split(".")
        .join(",")}`;
      document.querySelector(".js-pdv").innerHTML = `${pdvPrice
        .toFixed(2)
        .split(".")
        .join(",")}`;
      document.querySelector(
        ".js-whole__price--sidebar"
      ).innerHTML = `${normalPrice.split(".").join(",")}`;
      document.querySelector(
        ".js-normal__price--sidebar"
      ).innerHTML = `${normalPrice.split(".").join(",")}`;
      document.querySelector(".js-pdv--sidebar").innerHTML = `${pdvPrice
        .toFixed(2)
        .split(".")
        .join(",")}`;
    }
  }

  changePrices(e) {
    if (e.target.closest(".js-checkbox")) {
      let checkbox = e.target.closest(".js-checkbox");
      let checkbox2 = document.querySelector(".js-checkbox--sidebar");
      if (checkbox.checked) {
        checkbox2.checked = true;
        let normalPrice = localStorage.getItem("currentPrice");
        normalPrice = Number(normalPrice);
        normalPrice = normalPrice.toFixed(2);
        let pdvPrice = 0.25 * normalPrice;
        pdvPrice = pdvPrice.toFixed(2);
        let wholePrice = Number(normalPrice) + Number(pdvPrice);
        wholePrice = wholePrice.toFixed(2);
        document.querySelector(".js-normal__price").innerHTML = `${normalPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-normal__price--sidebar"
        ).innerHTML = `${normalPrice.toString().split(".").join(",")}`;
        document.querySelector(".js-pdv").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-pdv--sidebar").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-whole__price").innerHTML = `${wholePrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-whole__price--sidebar"
        ).innerHTML = `${wholePrice.toString().split(".").join(",")}`;
        document.querySelector(".js-payment__price").innerHTML = `${wholePrice
          .split(".")
          .join(",")}`;
      } else {
        checkbox2.checked = false;
        let normalPrice = localStorage.getItem("currentPrice");
        normalPrice = Number(normalPrice);
        normalPrice = normalPrice.toFixed(2);
        let pdvPrice = 0.25 * normalPrice;
        pdvPrice = pdvPrice.toFixed(2);
        document.querySelector(".js-normal__price").innerHTML = `${normalPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-normal__price--sidebar"
        ).innerHTML = `${normalPrice.toString().split(".").join(",")}`;
        document.querySelector(".js-pdv").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-pdv--sidebar").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-whole__price").innerHTML = `${normalPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-whole__price--sidebar"
        ).innerHTML = `${normalPrice.toString().split(".").join(",")}`;
        document.querySelector(".js-payment__price").innerHTML = `${normalPrice
          .split(".")
          .join(",")}`;
      }
    }
  }

  changeButton(e) {
    if (e.target.closest(".instructions-buttons__button")) {
      let btn = e.target.closest(".instructions-buttons__button");
      if (btn.classList.contains("instructions-buttons__button")) {
        if (btn.dataset.order === "1") {
          console.log(btn.dataset.order);
          btn.classList.add("instructions-buttons__button--active");
          btn.nextElementSibling.classList.remove(
            "instructions-buttons__button--active"
          );

          document.querySelector(".instructions-package__get").style.display =
            "none";
          document.querySelector(
            ".instructions-package__delivery"
          ).style.display = "block";
          let nextBtn = document.querySelector(".aside-bar__payment");
          nextBtn.disabled = false;
          nextBtn.classList.add("aside-bar__payment--active");
          nextBtn.classList.remove("aside-bar__payment--active-two");
        } else if (btn.dataset.order === "2") {
          btn.classList.add("instructions-buttons__button--active");
          btn.previousElementSibling.classList.remove(
            "instructions-buttons__button--active"
          );
          document.querySelector(".instructions-package__get").style.display =
            "block";
          document.querySelector(
            ".instructions-package__delivery"
          ).style.display = "none";
          let nextBtn = document.querySelector(".aside-bar__payment");
          nextBtn.classList.add("aside-bar__payment--active-two");
          if (nextBtn.dataset.back === "true") {
            nextBtn.disabled = false;
          } else {
            nextBtn.disabled = true;
          }
          nextBtn.classList.remove("aside-bar__payment--active");
        }
      }
    }
  }

  changeSidebarPrice(e) {
    if (e.target.closest(".instructions__form-label--link-two")) {
      e.preventDefault();
      let firstInput = document.querySelector(".js-checkbox");
      let input = e.target.closest(
        ".instructions__form-label--link-two"
      ).firstElementChild;
      if (input.checked) {
        input.checked = false;
        firstInput.checked = false;

        let normalPrice = localStorage.getItem("currentPrice");
        normalPrice = Number(normalPrice);
        normalPrice = normalPrice.toFixed(2);
        let pdvPrice = 0.25 * normalPrice;
        pdvPrice = pdvPrice.toFixed(2);
        document.querySelector(".js-normal__price").innerHTML = `${normalPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-normal__price--sidebar"
        ).innerHTML = `${normalPrice.toString().split(".").join(",")}`;
        document.querySelector(".js-pdv").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-pdv--sidebar").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-whole__price").innerHTML = `${normalPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-whole__price--sidebar"
        ).innerHTML = `${normalPrice.toString().split(".").join(",")}`;
      } else {
        input.checked = true;
        firstInput.checked = true;
        let normalPrice = localStorage.getItem("currentPrice");
        normalPrice = Number(normalPrice);
        normalPrice = normalPrice.toFixed(2);
        let pdvPrice = 0.25 * normalPrice;
        pdvPrice = pdvPrice.toFixed(2);
        let wholePrice = Number(normalPrice) + Number(pdvPrice);
        wholePrice = wholePrice.toFixed(2);
        document.querySelector(".js-normal__price").innerHTML = `${normalPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-normal__price--sidebar"
        ).innerHTML = `${normalPrice.toString().split(".").join(",")}`;
        document.querySelector(".js-pdv").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-pdv--sidebar").innerHTML = `${pdvPrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(".js-whole__price").innerHTML = `${wholePrice
          .toString()
          .split(".")
          .join(",")}`;
        document.querySelector(
          ".js-whole__price--sidebar"
        ).innerHTML = `${wholePrice.toString().split(".").join(",")}`;
      }
    }
  }

  checkAddress(e) {
    let input = document.querySelector(".js-input__address");
    if (Number(input.value) > 9999 && Number(input.value) <= 54000) {
      let deliveryInfo = {};
      deliveryInfo.address = input.value;
      localStorage.setItem("address-info", JSON.stringify(deliveryInfo));
      document.querySelector(".instructions__address").style.display = "none";
      document.querySelector(".instructions__wrapper").style.display = "block";
    }
    input.value = "";
    let underText = document.querySelector(".js-undertext");
    underText.innerHTML = "Molimo te, unesi važeći poštanski broj.";
    underText.classList.add("instructions__input-text--invalid");
    input.classList.add("instructions__input-border--invalid");

    e.preventDefault();
  }

  getDeliveryInfo(e) {
    if (e.target.classList.contains("aside-bar__payment--active")) {
      let li = e.target.parentElement.parentElement.parentElement.parentElement;
      if (li.nextElementSibling.firstElementChild.children.length === 3) {
        let elem = li.nextElementSibling.firstElementChild.children[0];
        elem.lastElementChild.style.display = "none";
        li.nextElementSibling.firstElementChild.children[1].remove();
      }
      let deliveryInfo =
        e.target.parentElement.previousElementSibling.firstElementChild
          .lastElementChild;
      let deliveryWay =
        e.target.parentElement.previousElementSibling.firstElementChild
          .firstElementChild;
      deliveryWay = deliveryWay.firstElementChild;
      deliveryWay = deliveryWay.innerHTML;
      deliveryInfo = deliveryInfo.innerHTML;
      let objInfo = JSON.parse(localStorage.getItem("address-info"));
      objInfo.deliveryInfo = deliveryInfo;
      objInfo.deliveryWay = deliveryWay;
      localStorage.setItem("address-info", JSON.stringify(objInfo));
      document.querySelector(".instructions__wrapper").style.display = "none";
      document.querySelector(".instructions__address").style.display = "none";
      let addressInfo = JSON.parse(localStorage.getItem("address-info"));
      let change =
        e.target.parentElement.parentElement.previousElementSibling
          .previousElementSibling.lastElementChild;
      change.style.display = "block";
      change.dataset.visible = "true";
      let div = document.createElement("div");
      div.classList.add("instructions__choice-info");
      div.dataset.choice = "1";
      div.innerHTML = `
    <p class="instructions__choice-title">Način dostave</p>
    <p>${addressInfo.deliveryWay}<p>
    <p class="instructions__choice-title">Dostavi na</p>
    <p>${addressInfo.address}<p>
    <p class="instructions__choice-title">Datum dostave</p>
    <p>${addressInfo.deliveryInfo}<p>`;
      document
        .querySelector(".products__info-button")
        .insertBefore(div, document.querySelector(".instructions__address"));
      document
        .querySelector(".instructions__form-list")
        .classList.add("instructions__form-list--open");
      e.target.parentElement.parentElement.parentElement.firstElementChild.dataset.info =
        "delivery";
    } else if (e.target.classList.contains("aside-bar__payment--active-two")) {
      let addressInfo = JSON.parse(localStorage.getItem("choosenLocation"));
      let div = document.createElement("div");
      document.querySelector(".instructions__wrapper").style.display = "none";
      document.querySelector(".instructions__address").style.display = "none";
      let change =
        e.target.parentElement.parentElement.previousElementSibling
          .previousElementSibling.lastElementChild;
      change.style.display = "block";
      change.dataset.visible = "true";
      div.classList.add("instructions__choice-info");
      div.dataset.choice = "1";
      div.innerHTML = `
      <p class="instructions__choice-title">Način dostave</p>
      <p>Dostavljeno kamionom u robnu kuću<p>
      <p class="instructions__choice-title">Preuzeti kod</p>
      <p>${addressInfo.prebivaliste}<p>
      <p>${addressInfo.adresa}<p>
      <p>${addressInfo.postanskiBroj},${addressInfo.grad}<p>
      <p class="instructions__choice-title">Preuzeti na</p>
      <p>19.09.2021 11:00 - 17:00<p>`;
      document
        .querySelector(".products__info-button")
        .insertBefore(div, document.querySelector(".instructions__address"));
      document
        .querySelector(".instructions__form-list")
        .classList.add("instructions__form-list--open");
      e.target.parentElement.parentElement.parentElement.firstElementChild.dataset.info =
        "takeover";
    }
  }

  getDetailInfo(e) {
    e.preventDefault();
    let arr = [];
    let userInfo = {};
    let allInputs = document.querySelectorAll(".js-input");
    allInputs.forEach((elem, index) => {
      if (elem.value === "") {
        elem.style.borderBottom = "2px solid red";
        elem.nextElementSibling.style.color = "red";
        elem.nextElementSibling.style.display = "block";
      } else {
        elem.style.borderBottom = "2px solid green";
        elem.nextElementSibling.style.display = "none";
        userInfo[`info-${index}`] = elem.value;
        arr.push(userInfo[`info-${index}`]);
        localStorage.setItem("user-info", JSON.stringify(arr));
      }
    });
    let information = JSON.parse(localStorage.getItem("user-info"));
    if (information.length === 6) {
      let div = document.createElement("div");
      div.classList.add("instructions__choice-info");
      div.innerHTML = `
      <p>${information[0]} ${information[1]}<p>
      <p>${information[4]}<p>
      <p>${information[5]}<p>
      <p>${information[2]}<p>
      <p>${information[3]}<p>
      `;
      document
        .querySelector('.products__info-button[data-id="2"]')
        .insertBefore(div, document.querySelector(".instructions__form"));
      document
        .querySelector(".instructions__form-list")
        .classList.remove("instructions__form-list--open");
      document
        .querySelector(".instructions__payment-list")
        .classList.add("instructions__payment-list--open");
      let change =
        e.target.previousElementSibling.previousElementSibling.lastElementChild;
      change.style.display = "block";
      change.dataset.visible = "true";
    }
    localStorage.removeItem("user-info");
  }

  getBack(e) {
    location.reload();
  }

  switchPayments(e) {
    if (e.target.classList.contains("js-payment-type")) {
      if (e.target.dataset.payment === "1") {
        document.querySelector(".instructions__payment-credit").style.display =
          "none";
        document
          .querySelector(".instructions__payment-rates")
          .classList.remove("instructions__payment-rates--close");
      } else {
        document.querySelector(".instructions__payment-credit").style.display =
          "block";
        document
          .querySelector(".instructions__payment-rates")
          .classList.add("instructions__payment-rates--close");
      }
    }
  }

  checkIfChecked(e) {
    if (e.target.checked === true) {
      document.querySelector(".js-detail-btn").disabled = false;
      document
        .querySelector(".js-detail-btn")
        .classList.add("aside-bar__payment--active-blue");
      document
        .querySelector(".js-detail-btn")
        .classList.remove("aside-bar__payment--active-two");
      document
        .querySelector(".js-detail-btn")
        .classList.remove("aside-bar__payment--two");
    } else {
      console.log(false);
      document.querySelector(".js-detail-btn").disabled = true;
      document
        .querySelector(".js-detail-btn")
        .classList.remove("aside-bar__payment--active-blue");
      document
        .querySelector(".js-detail-btn")
        .classList.add("aside-bar__payment--active-two");
      document
        .querySelector(".js-detail-btn")
        .classList.add("aside-bar__payment--two");
    }
  }

  splitCreditNumbers(e) {
    if (e.target.dataset.paymentOption === "1") {
      if (
        e.target.value.length === 4 ||
        e.target.value.length === 9 ||
        e.target.value.length === 14
      ) {
        e.target.value = e.target.value + " ";
      }
    } else if (e.target.dataset.paymentOption === "2") {
      if (e.target.value.length === 2) {
        e.target.value = e.target.value + "/";
      }
    }
  }

  #getLocationsData() {
    fetch("jsons/locations.json")
      .then((response) => response.json())
      .then((data) => {
        let lokacije = data.lokacije;
        localStorage.setItem("locations", JSON.stringify(lokacije));
        let ractive = new Ractive({
          target: ".cart-section__list-items",
          template: "#locations",
          data: {
            locations: lokacije,
          },
        });
      });
  }

  selectLocation(e) {
    if (e.target.closest(".sidebar__locations-button--place")) {
      let id = e.target.closest(".sidebar__locations-button--place").dataset
        .locationId;
      let buttons = document.querySelectorAll(
        ".sidebar__locations-button--place"
      );
      buttons.forEach((elem, index) => {
        if ((index + 1).toString() === id) {
          elem.style.border = "2px solid #1859a3";
          elem.dataset.selected = true;
        } else {
          elem.dataset.selected = false;
          elem.style.border = "1px solid  #dfdfdf";
        }
      });
    }
  }

  addLocationInfo(e) {
    let buttons = document.querySelectorAll(
      ".sidebar__locations-button--place"
    );
    let locations = JSON.parse(localStorage.getItem("locations"));
    buttons.forEach((elem) => {
      if (elem.dataset.selected === "true") {
        this.sidebar.classList.remove("sidebar-grow");
        this.overlay.classList.remove("overlay--open");
        this.body.style.overflow = "auto";
        locations = locations.find(
          (element) => element.id.toString() === elem.dataset.locationId
        );
        localStorage.setItem("choosenLocation", JSON.stringify(locations));
        document.querySelector(
          ".instructions-package__delivery-btn"
        ).style.display = "none";
        document.querySelector(".sidebar__locations-items").remove();
        if (
          document.querySelector(".instructions-package__get").children
            .length === 4
        ) {
          document
            .querySelector(".instructions-package__get")
            .children[2].remove();
        }
        let div = document.createElement("div");
        div.innerHTML = `
        <p> ${locations.prebivaliste}</p>
        <span> ${locations.adresa}</span>
        <span> ${locations.postanskiBroj}</span>
        <span> ${locations.zupanija}</span>
        <button class="instructions-package__change">Promijeni</button>
        `;
        div.classList.add("instructions-package__location");
        let packageDiv = document.querySelector(".instructions-package__get");
        packageDiv.insertBefore(
          div,
          document.querySelector(".instructions-package__delivery-btn")
        );
        document.querySelector(
          ".aside-bar__payment--active-two"
        ).disabled = false;
        document
          .querySelector(".aside-bar__payment--active-two")
          .classList.add("aside-bar__payment--active-blue");
      }
    });
  }

  returnToPreviousStep(e) {
    if (e.target.closest(".instructions__info-change")) {
      let changes = document.querySelectorAll(".instructions__info-change");
      let step = e.target.parentElement.dataset.step;
      if (document.querySelector(".aside-bar__payment--active-two")) {
        document.querySelector(".aside-bar__payment--active-two").dataset.back =
          "true";
      }
      if (step === "1") {
        e.target.parentElement.nextElementSibling.remove();
        if (e.target.dataset.info === "takeover") {
          document.querySelector(".instructions__address").style.display =
            "block";
          document.querySelector(".instructions__wrapper").style.display =
            "none";
          e.target.style.display = "none";
          document
            .querySelector(".instructions__form-list")
            .classList.remove("instructions__form-list--open");
        } else {
          document.querySelector(".instructions__wrapper").style.display =
            "block";
          document.querySelector(".instructions__address").style.display =
            "none";
          e.target.style.display = "none";
          document
            .querySelector(".instructions__form-list")
            .classList.remove("instructions__form-list--open");
        }
      } else if (step === "2") {
        let elem =e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild;
        elem.lastElementChild.dataset.reload = "true";
        e.target.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.add(
          "instructions__form-list--open"
        );
        e.target.style.display = "none";
        e.target.parentElement.nextElementSibling.remove();
      }
    }
  }

  #bindEvents() {
    window.addEventListener("load", this.#populateSidebar.bind(this));
    window.addEventListener("load", this.choosenProducts.bind(this));
    window.addEventListener("load", this.getRealPrices.bind(this));
    document.body.addEventListener("click", this.openSidebar.bind(this));
    document
      .querySelector(".aside-bar")
      .addEventListener("click", this.changePrices.bind(this));
    document
      .querySelector(".instructions-buttons__list")
      .addEventListener("click", this.changeButton.bind(this));
    document
      .querySelector(".sidebar")
      .addEventListener("click", this.changeSidebarPrice.bind(this));
    document
      .querySelector(".js-address-btn")
      .addEventListener("click", this.checkAddress.bind(this));
    document.body.addEventListener("click", this.getDeliveryInfo.bind(this));
    document
      .querySelector(".instructions__change")
      .addEventListener("click", this.getBack.bind(this));
    document
      .querySelector(".instructions__form")
      .addEventListener("submit", this.getDetailInfo.bind(this));
    document.body.addEventListener("click", this.switchPayments.bind(this));
    document
      .querySelector(".instructions__payment-list")
      .addEventListener("keyup", this.splitCreditNumbers.bind(this));
    document.body.addEventListener("click", this.selectLocation.bind(this));
    document
      .querySelector(".sidebar__locations-button")
      .addEventListener("click", this.addLocationInfo.bind(this));
    document.body.addEventListener(
      "click",
      this.returnToPreviousStep.bind(this)
    );
    document
      .querySelector(".js-input-checkbox")
      .addEventListener("click", this.checkIfChecked.bind(this));
  }
}

new CalculationsPage();
