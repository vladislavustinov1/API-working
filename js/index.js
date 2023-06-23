class Cards {
  cnt = 0;
  constructor(
    img,
    nameCard,
    descrCard,
    priceCard,
    brands2,
    cardCount,
    priceOrig,
    i,
    delCards,
    urlCard
  ) {
    this.img = img;
    this.nameCard = nameCard;
    this.descrCard = descrCard;
    this.priceCard = priceCard;
    this.brands2 = brands2;
    this.cardCount = cardCount;
    this.priceOrig = priceOrig;
    this.i = i;
    this.delCards = delCards;
    this.urlCard = urlCard;
  }
  createCard() {
    this.cardCount = 3;
    let cardBody = document.getElementById(`card_cont`);
    let cardsDiv = document.createElement(`div`);
    let cardsColumn = document.createElement(`div`);
    let cardsImg = document.createElement(`img`);
    let cardsBody = document.createElement(`div`);
    let cardsTitle = document.createElement(`a`);
    let cardsDesc = document.createElement(`p`);
    let buttonBlock = document.createElement(`div`);
    let cardsButtonBuy = document.createElement(`button`);
    let cardsPrice = document.createElement(`p`);

    cardsColumn.className = `col-${this.cardCount} myCards`;
    cardBody.prepend(cardsColumn);
    cardsDiv.className = "card text-white bg-primary";
    cardsColumn.prepend(cardsDiv);

    cardsImg.className = "card-img-top";
    cardsImg.src = `${this.img[this.i]}`;
    cardsImg.alt = "title";
    cardsDiv.prepend(cardsImg);

    cardsBody.className = "card-body";
    cardsDiv.append(cardsBody);

    cardsTitle.className = "card-title";
    cardsTitle.href = `${this.urlCard}`;
    cardsTitle.title = `${this.nameCard[this.i]}`;
    cardsTitle.appendChild(document.createTextNode(`${this.nameCard[this.i]}`));
    cardsBody.prepend(cardsTitle);

    cardsDesc.className = `card-description`;
    cardsDesc.textContent = `${this.descrCard[this.i]}`;
    cardsBody.append(cardsDesc);

    buttonBlock.className = `d-grid gap-2`;
    cardsBody.append(buttonBlock);

    cardsPrice.textContent = `Price: ${this.priceCard[this.i]}$`;
    buttonBlock.append(cardsPrice);
  }
  createErrorText() {
    let cardBody = document.getElementById(`card_cont`);
    let cardError = document.createElement(`div`);
    cardError.className = `myCards`;
    cardError.textContent = `Not found! Please, choose another product/brand`;
    cardBody.prepend(cardError);
  }
  createCardsForProd() {
    for (this.i; this.i < this.brands2.length; this.i++) {
      if (this.brands2.length > 0) {
        this.createCard();
      } else {
        this.createErrorText();
        break;
      }
    }
  }
  createCardForPrice() {
    for (this.i; this.i < this.brands2.length; this.i++) {
      if (this.priceOrig <= this.priceCard[this.i]) {
        this.createCard();
      } else {
        continue;
      }
    }
  }
}
async function gotValue(prod, brand) {
  let arrWithProductType = [];
  prod = document.getElementById(`select-second`);
  brand = document.getElementById(`select-first`).value;
  let api = await fetch(
    `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`
  );
  let brands = await api.json();
  console.log(brands);
  let resProd = brands.map((x) => x.product_type);
  // get unique brands
  for (let str of resProd) {
    if (!arrWithProductType.includes(str)) {
      arrWithProductType.push(str);
    }
  }

  if (api.ok) {
    // function get price and production and adds his in selects
    function gotProd() {
      // receiving selects from HTML
      brands = document.getElementById(`select-first`);
      priceList = document.getElementById(`select-third`);
      // got all options in production select
      let options = prod.getElementsByTagName(`option`);
      // delete old options at call function again
      while (options.length > 1) {
        options[1].remove();
      }
      // got productions from brand select
      for (let i = 0; i < arrWithProductType.length; i++) {
        let newOption = document.createElement(`option`);
        newOption.setAttribute(`value`, arrWithProductType[i]);
        newOption.innerHTML = arrWithProductType[i];
        prod.appendChild(newOption);
      }
      // if brand doesn't contain products
      if (options.length == 1) {
        let textWhenNoOptionInArr =
          "Production not found/You have not chosen a brand!";
        let noOptionInArr = document.createElement(`option`);
        noOptionInArr.textContent = textWhenNoOptionInArr;
        prod.appendChild(noOptionInArr);
      }
    }
    gotProd();
  } else {
    console.log(`Ошибка доступа: ` + api.status);
  }
}
// getting tags

async function gotCardsByProduction() {
  let brand = document.getElementById(`select-first`).value;
  let prod = document.getElementById(`select-second`).value;
  let cardDelete = document.getElementsByClassName(`myCards`);
  let api = await fetch(
    `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${prod}`
  );
  let brands = await api.json();
  console.log(brands);
  let resPrice = brands.map((y) => y.price);
  let resImg = brands.map((z) => z.image_link);
  let resDescr = brands.map((e) => e.description);
  let resName = brands.map((p) => p.name);
  let resUrl = brands.map((f) => f.product_link);
  if (api.ok) {
    while (cardDelete.length > 0) {
      cardDelete[0].remove();
    }
    let card = new Cards(
      resImg,
      resName,
      resDescr,
      resPrice,
      brands,
      0,
      null,
      0,
      cardDelete,
      resUrl
    );
    card.createCardsForProd();
  }
}
async function gotCardsByPrice() {
  let brand = document.getElementById(`select-first`).value;
  let prod = document.getElementById(`select-second`).value;
  let price = document.getElementById(`select-third`).value;
  let cardDelete = document.getElementsByClassName(`myCards`);

  let api = await fetch(
    `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${prod}`
  );
  let brands = await api.json();
  let resPrice = brands.map((y) => +y.price);
  let resImg = brands.map((z) => z.image_link);
  let resDescr = brands.map((e) => e.description);
  let resName = brands.map((p) => p.name);
  let resUrl = brands.map((f) => f.product_link);
  console.log(resUrl);
  resPrice.sort((a, b) => a - b);
  parseInt(resPrice);
  parseInt(price);
  console.log(resPrice);
  console.log(price);
  console.log(price > resPrice[0]);
  if (api.ok) {
    while (cardDelete.length > 0) {
      cardDelete[0].remove();
    }

    let card = new Cards(
      resImg,
      resName,
      resDescr,
      resPrice,
      brands,
      0,
      price,
      0,
      cardDelete,
      resUrl
    );
    card.createCardForPrice();
  }
  console.log(cardDelete.length);
}
document
  .querySelector(".form-input")
  .addEventListener("input", function inputChange() {
    this.value = this.value.replace(/[^\d\.]/g, "");
    if (this.value.match(/\./g).length > 1) {
      this.value = this.value.substr(0, this.value.lastIndexOf("."));
    }
  });

window.addEventListener("scroll", function () {
  if (scrollY > 113) {
    let footerHide = document.getElementById(`footer`);
    footerHide.style.display = `none`;
  } else if (scrollY <= 113) {
    let footerShow = document.getElementById(`footer`);
    footerShow.style.display = `inline`;
  }
});
