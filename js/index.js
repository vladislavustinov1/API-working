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
    urlCard,
    price2
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
    this.price2 = price2;
  }
  createCard() {
    this.cardCount = 3;
    let cardBody = document.getElementById(`card_cont`);
    let cardsDiv = document.createElement(`div`);
    let cardsColumn = document.createElement(`div`);
    let cardsImg = document.createElement(`img`);
    let cardsBody = document.createElement(`div`);
    let cardsTitle = document.createElement(`h4`);
    let cardsDesc = document.createElement(`a`);
    let buttonBlock = document.createElement(`div`);
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
    cardsTitle.title = `${this.nameCard[this.i]}`;
    cardsTitle.appendChild(document.createTextNode(`${this.nameCard[this.i]}`));
    cardsBody.prepend(cardsTitle);

    cardsDesc.className = `card-description`;
    cardsDesc.id = `cads-Url`;
    cardsDesc.href = `${this.urlCard[this.i]}`;
    cardsDesc.appendChild(document.createTextNode(`Click for more...`));
    buttonBlock.append(cardsDesc);

    buttonBlock.className = `d-grid gap-2`;
    cardsBody.append(buttonBlock);

    cardsPrice.textContent = `Price: ${this.priceCard[this.i]}$`;
    buttonBlock.append(cardsPrice);
    document
      .getElementById(`cads-Url`)
      .addEventListener(`click`, function (event) {
        event.preventDefault();
        window.open(event.target.href, `_blank`);
      });
  }
  createErrorText() {
    let cardBody = document.getElementById(`card_cont`);
    let cardError = document.createElement(`div`);
    cardError.className = `myCards`;
    cardError.textContent = `Not found! Please, choose another product/brand or change the price values`;
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
    let cardBody = document.getElementById(`card_cont`);
    for (this.i; this.i < this.brands2.length; this.i++) {
      if (
        this.priceOrig <= this.priceCard[this.i] &&
        this.price2 >= this.priceCard[this.i]
      ) {
        this.createCard();
      } else if (
        this.priceOrig > this.priceCard ||
        this.price2 < this.priceCard[this.i]
      ) {
        continue;
      } else if (cardBody.childNodes.length == 0) {
        this.createErrorText();
        break;
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
  let price2 = document.getElementById(`select-price`).value;
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
  console.log(resPrice);
  parseInt(resPrice);
  parseInt(price);
  parseInt(price2);
  console.log(resPrice);
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
      resUrl,
      price2
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
