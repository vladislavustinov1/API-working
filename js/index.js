class Cards {
  constructor(
    img,
    nameCard,
    descrCard,
    priceCard,
    brands2,
    cardCount,
    priceOrig,
    i,
    delCards
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
  }
  createCard() {
    if (this.brands2.length % 3 == 0 || this.brands2.length >= 3) {
      this.cardCount = 3;
    } else if (this.brands2.length % 4 == 0 || this.brands2.length >= 4) {
      this.cardCount = 3;
    } else if (this.brands2.length % 6 == 0 || this.brands2.length >= 6) {
      this.cardCount = 2;
    } else if (this.brands2.length % 12 == 0 || this.brands2.length >= 12) {
      this.cardCount = 1;
    } else if (this.brands2.length == 1) {
      this.cardCount = 3;
    } else if (this.brands2.length == 2) {
      this.cardCount = 4;
    }
    let cardBody = document.getElementById(`card_cont`);
    let cardsDiv = document.createElement(`div`);
    let cardsColumn = document.createElement(`div`);
    let cardsImg = document.createElement(`img`);
    let cardsBody = document.createElement(`div`);
    let cardsTitle = document.createElement(`h4`);
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
    cardsTitle.textContent = `${this.nameCard[this.i]}`;
    cardsBody.prepend(cardsTitle);

    cardsDesc.className = `card-description`;
    cardsDesc.textContent = `${this.descrCard[this.i]}`;
    cardsBody.append(cardsDesc);

    buttonBlock.className = `d-grid gap-2`;
    cardsBody.append(buttonBlock);

    cardsButtonBuy.className = `btn btn-primary`;
    cardsButtonBuy.type = `button`;
    cardsButtonBuy.textContent = `Add to cart`;
    cardsButtonBuy.style.backgroundColor = `rgb(219, 177, 125)`;
    buttonBlock.prepend(cardsButtonBuy);

    cardsPrice.textContent = `Price: ${this.priceCard[this.i]}$`;
    buttonBlock.append(cardsPrice);
  }
  createErrorText() {
    let cardBody = document.getElementById(`card_cont`);
    cardError.textContent = `Not found! Please, choose another product/brand`;
    cardBody.prepend(cardError);
  }
  createCardsForProd() {
    for (this.i; this.i < this.brands2.length; this.i++) {
      if (this.brands2.length > 0) {
        this.createCard();
      }
    }
  }
  createCardForPrice() {
    for (this.i; this.i < this.brands2.length; this.i++) {
      if (this.priceCard[this.i] >= this.priceOrig) {
        this.createCard();
      } else if (this.delCards.length == 0) {
        console.log(123213);
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
async function gotTags(prod, brand) {
  prod = document.getElementById(`select-second`).value;
  brand = document.getElementById(`select-first`).value;
  let api = await fetch(
    `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&production_type=${prod}`
  );
  let brands = await api.json();
  let arrWithProductType = [];
  let arrWithProductTag = [];
  let resProd = brands.map((x) => x.product_type);
  let resTags = brands.map((z) => z.tag_list);
  for (let str of resProd) {
    if (!arrWithProductType.includes(str)) {
      arrWithProductType.push(str);
    }
  }
  // got unique tags
  for (let str3 of resTags) {
    if (!arrWithProductTag.includes(str3)) {
      arrWithProductTag.push(str3);
    }
  }
  // delete empty elements in array
  for (let g = 0; g < arrWithProductTag.length; g++) {
    if (!arrWithProductTag[g].length > 0) {
      arrWithProductTag.splice(g, 1);
      g--;
    }
  }
  // delete ununique elemets in array
  for (let item = 0, q = 0; item < arrWithProductTag.length; item++) {
    if (arrWithProductTag[item] !== arrWithProductTag[item - 1]) {
      arrWithProductTag[q++] = arrWithProductTag[item];
    }
    arrWithProductTag.length = q;
  }
  production1 = document.getElementById(`select-second`);
  tagList = document.getElementById(`select-fourth`);
  // got tags from production
  console.log(arrWithProductTag);
  while (tagList.length > 1) {
    tagList[1].remove();
  }
  for (let tagsCount = 0; tagsCount <= arrWithProductTag.length; tagsCount++) {
    if (arrWithProductTag.length === 0) {
      let newErrorTag = document.createElement(`option`);
      newErrorTag.innerHTML = `Tags not found!`;
      tagList.appendChild(newErrorTag);
      return;
    } else if (arrWithProductTag[0].length === 1) {
      let newTag = document.createElement(`option`);
      newTag.innerHTML = arrWithProductTag[0][tagsCount];
      tagList.appendChild(newTag);
      return;
    } else if (arrWithProductTag[0].length > 1) {
      let newTag = document.createElement(`option`);
      newTag.innerHTML = arrWithProductTag[0][tagsCount];
      tagList.appendChild(newTag);
    }
  }
}
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
      0
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
  let resPrice = brands.map((y) => y.price);
  let resImg = brands.map((z) => z.image_link);
  let resDescr = brands.map((e) => e.description);
  let resName = brands.map((p) => p.name);
  resPrice.sort((a, b) => {
    a = parseInt(a);
    b = parseInt(b);
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
  });
  console.log(resPrice);
  console.log(price);
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
      cardDelete
    );
    card.createCardForPrice();
  }
  console.log(cardDelete.length);
}
document
  .querySelector(".form-input")
  .addEventListener("input", function formInput() {
    this.value = this.value.replace(/[^\d\.]/g, "");
    if (this.value.match(/\./g).length > 1) {
      this.value = this.value.substr(0, this.value.lastIndexOf("."));
    }
  });
