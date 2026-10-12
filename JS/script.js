var btn = document.getElementById('addForm');
var con = document.getElementById('contact-form');
var closeBtn = document.getElementById('closeContForm');
var cancelBtn = document.getElementById('cancelForm');
var form = document.getElementById('myForm');

function closeForm() {
    con.style.display = 'none';
    form.reset();
}

btn.addEventListener('click', () => {
    con.style.display = 'block';
});
closeBtn.addEventListener('click', closeForm);
cancelBtn.addEventListener('click', closeForm);

const cardName = document.getElementById("cardName");
const cardNum = document.getElementById("cardNum");
const cardCat = document.getElementById("cardCat");
const cardAddress = document.getElementById("cardAddress");
const cardGmail = document.getElementById("cardGmail");
const cardImg = document.getElementById("cardImg");
const cardRow = document.getElementById("cardRow");
const searchInput = document.getElementById("searchInput");
const totalCount = document.querySelector(".total .text-g-quick h4");
const favCount = document.querySelector(".favorites .text-g-quick h4");
const emerCount = document.querySelector(".emergency .text-g-quick h4");
var editId = null;
const formTitle = document.querySelector(".header-form h2");
const saveBtnEl = document.querySelector(".save-f-btn");



var cardArr = [];
if (localStorage.getItem('list')) {
    cardArr = JSON.parse(localStorage.getItem('list'));
}
display();

function saveData() {
    localStorage.setItem('list', JSON.stringify(cardArr));
}

function updateCounts() {
    totalCount.textContent = cardArr.length;
    favCount.textContent = cardArr.filter(function (c) { return c.pFav; }).length;
    emerCount.textContent = cardArr.filter(function (c) { return c.pEmer; }).length;
}

function esc(text) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function closeForm() {
    con.style.display = 'none';
    form.reset();
    editId = null;
    formTitle.textContent = "Add New Contact";
    saveBtnEl.innerHTML = '<i class="fa-solid fa-check" style="color: rgb(255, 255, 255);"></i> Save Contact';
}


function editFun(id) {
    var c = cardArr.find(function (x) { return x.id === id; });
    if (!c) return;

    editId = id;
    cardName.value = c.pName;
    cardNum.value = c.pNum;
    cardGmail.value = c.pGmail;
    cardAddress.value = c.pAddress;
    cardCat.value = c.pCat || "";
    document.getElementById("check-fav").checked = !!c.pFav;
    document.getElementById("check-emer").checked = !!c.pEmer;

    formTitle.textContent = "Edit Contact";
    saveBtnEl.innerHTML = '<i class="fa-solid fa-check" style="color: rgb(255, 255, 255);"></i> Save Changes';
    con.style.display = 'block';
}

var saveBtn = form.querySelector('.save-f-btn');
if (saveBtn) saveBtn.removeAttribute('onclick');

form.addEventListener('submit', function (e) {
    e.preventDefault(); 
    createCard();
});

function createCard() {
    var file = cardImg && cardImg.files ? cardImg.files[0] : null;
    if (file) {
        var reader = new FileReader();
        reader.onload = function () {
            saveCard(reader.result);
        };
        reader.readAsDataURL(file);
    } else {
        saveCard('');
    }
}

function saveCard(img) {
    if (editId) {
        var c = cardArr.find(function (x) { return x.id === editId; });
        if (c) {
            c.pName = cardName.value.trim();
            c.pNum = cardNum.value.trim();
            c.pCat = cardCat.value;
            c.pAddress = cardAddress.value.trim();
            c.pGmail = cardGmail.value.trim();
            c.pFav = document.getElementById("check-fav").checked;
            c.pEmer = document.getElementById("check-emer").checked;
            if (img) c.pImg = img; 
        }
    } else {
        cardArr.push({
            id: Date.now(),
            pName: cardName.value.trim(),
            pNum: cardNum.value.trim(),
            pCat: cardCat.value,
            pAddress: cardAddress.value.trim(),
            pGmail: cardGmail.value.trim(),
            pImg: img,
            pFav: document.getElementById("check-fav").checked,
            pEmer: document.getElementById("check-emer").checked
        });
    }
    saveData();
    searchFun();
    closeForm();
}



function display(list = cardArr) {
    updateCounts();
    if (!cardRow) return;

    if (list.length === 0) {
        cardRow.innerHTML = `
        <div class="con-grid">
            <div class="i-con-grid">
                <i class="fa-solid fa-address-book" style="color: rgb(209, 213, 220); font-size: 30px;"></i>
            </div>
            <h6>No contacts found</h6>
            <p>Click "Add Contact" to get started</p>
        </div>`;
        return;
    }

    var box = "";
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        var imgHtml = c.pImg
            ? `<img src="${c.pImg}" alt="${esc(c.pName)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
            : `<i class="fa-solid fa-user" style="color: #fff;"></i>`;

        box += `
        <div class="card">
            <div class="card-header">
                <div class="d-flex align-items-start gap-3">
                    <div class="img-card position-relative flex-shrink-0">
                        <div class="i-card">${imgHtml}</div>
                    </div>
                    <div class="name-card">
                        <h3>${esc(c.pName)}</h3>
                        <div class="d-flex align-items-center gap-2 mt-1">
                            <div class="i-phone-card">
                                <i class="fa-solid fa-phone" style="color: rgb(21, 93, 252);"></i>
                            </div>
                            <span>${esc(c.pNum)}</span>
                        </div>
                    </div>
                </div>
                <div class="mt-12">
                    <div class="gmail-card d-flex align-items-center gap-2">
                        <div class="i-gmail-card">
                            <i class="fa-solid fa-envelope" style="color: rgb(127, 34, 254);"></i>
                        </div>
                        <span>${esc(c.pGmail)}</span>
                    </div>
                    <div class="loc-card d-flex align-items-center gap-2">
                        <div class="i-loc-card">
                            <i class="fa-solid fa-location-dot" style="color: rgb(0, 153, 102);"></i>
                        </div>
                        <span>${esc(c.pAddress)}</span>
                    </div>
                </div>
                <div class="group-card d-flex flex-wrap gap-2 mt-12">
                    ${c.pCat ? `<span>${esc(c.pCat)}</span>` : ''}
                </div>
            </div>
            <div class="card-footer">
                <div class="card-I-footer d-flex align-items-center gap-2">
                    <a href="tel:${esc(c.pNum)}" class="a-phone-card">
                        <i class="fa-solid fa-phone"></i>
                    </a>
                    <a href="mailto:${esc(c.pGmail)}" class="a-gmail-card">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                </div>
                <div class="card-btn-footer d-flex align-items-center gap-2">
                    <button class="card-btn-footer-1 ${c.pFav ? 'active' : ''}" onclick="toggleFav(${c.id})">
                        <i class="${c.pFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                    </button>
                    <button class="card-btn-footer-2 ${c.pEmer ? 'active' : ''}" onclick="toggleEmer(${c.id})">
                        <i class="fa-solid ${c.pEmer ? 'fa-heart-pulse' : 'fa-heart'}"></i>
                    </button>
                    <button class="card-btn-footer-3" onclick="editFun(${c.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="card-btn-footer-4" onclick="deletefun(${c.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }
    cardRow.innerHTML = box;
}

function toggleFav(id) {
    var c = cardArr.find(function (x) { return x.id === id; });
    if (c) {
        c.pFav = !c.pFav;
        saveData();
        searchFun();
    }
}

function toggleEmer(id) {
    var c = cardArr.find(function (x) { return x.id === id; });
    if (c) {
        c.pEmer = !c.pEmer;
        saveData();
        searchFun();
    }
}

function deletefun(id) {
    cardArr = cardArr.filter(function (c) { return c.id !== id; });
    saveData();
    searchFun(); 
}

function searchFun() {
    var term = searchInput.value.toLowerCase().trim();
    var searchedArr = [];
    for (var i = 0; i < cardArr.length; i++) {
        var c = cardArr[i];
        if (
            c.pName.toLowerCase().includes(term) ||
            c.pNum.toLowerCase().includes(term) ||
            c.pGmail.toLowerCase().includes(term)
        ) {
            searchedArr.push(c);
        }
    }
    display(searchedArr);
}