/*

 渲染卡片的程式碼提取
 表單驗證邏輯
 清空表單的邏輯提取：clearForm() 函式，統一清空表單欄位的邏輯
 錯誤提示

 初始化資料：確認從 API 成功載入資料並渲染到頁面。
 篩選功能：確認篩選器能正確篩選不同地區的套票。
 新增功能：確認新增套票後，資料即時更新並顯示在頁面上。
 表單驗證：確認未填寫欄位時顯示錯誤提示，填寫後提示消失。

 Mentor Feedback: 嘗試改為透過 reset() 方法清空表單資料，就不用逐一清除表單內容。
 
 1、使用 reset() 清空表單： 簡化清空表單欄位的邏輯，減少程式碼重複性
 2、錯誤提示清空：在清空表單時，同步清空所有欄位的錯誤提示，避免殘留錯誤訊息。

*/

let data = [];

// 定義 API URL
const apiUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';

// 選取 DOM 元素
const ticketCard = document.querySelector(".ticketCard-area"); // 套票卡片區域
const searchResultNum = document.querySelector(".searchResultNum");// 搜尋結果數量
const filter = document.querySelector(".regionSearch");// 篩選器
const btn = document.querySelector(".btn");// 新增按鈕
const addTicketForm = document.querySelector(".addTicket-form"); // 表單元素

// 表單欄位
const formFields = {
  ticketName: document.querySelector("#ticketName"),
  ticketImgUrl: document.querySelector("#ticketImgUrl"),
  ticketRegion: document.querySelector("#ticketRegion"),
  ticketPrice: document.querySelector("#ticketPrice"),
  ticketNum: document.querySelector("#ticketNum"),
  ticketRate: document.querySelector("#ticketRate"),
  ticketDescription: document.querySelector("#ticketDescription"),
};

// 必填提示元素
const errorMessages = {
  ticketName: document.querySelector("#ticketName-message"),
  ticketImgUrl: document.querySelector("#ticketImgUrl-message"),
  ticketRegion: document.querySelector("#ticketRegion-message"),
  ticketPrice: document.querySelector("#ticketPrice-message"),
  ticketNum: document.querySelector("#ticketNum-message"),
  ticketRate: document.querySelector("#ticketRate-message"),
  ticketDescription: document.querySelector("#ticketDescription-message"),
};

// 通用錯誤提示樣式
const errorTip = `<i class="fas fa-exclamation-circle"></i><span>必填!</span>`;

// 從 API 獲取資料
function fetchData(apiUrl) {
  axios.get(apiUrl)
    .then((response) => {
      data = response.data.data; // 更新資料
      init(); // 初始化頁面
    })
    .catch((error) => {
      console.error(error);
      alert("未正確取得 API 資料");
    });
}

// 初始化頁面
function init() {
  filter.value = "全部地區"; // 預設篩選器顯示「全部地區」
  renderCards(data); // 渲染所有卡片
}

// 渲染卡片
function renderCards(dataArray) {
  let str = "";
  dataArray.forEach((item) => {
    str += renderCard(item); // 生成單一卡片 HTML
  });
  ticketCard.innerHTML = str; // 更新卡片區域
  searchResultNum.textContent = dataArray.length; // 更新搜尋結果筆數
}

// 生成單一卡片的 HTML
function renderCard(item) {
  return `
    <li class="ticketCard">
      <div class="ticketCard-img">
        <a href="#">
          <img src="${item.imgUrl}" alt="">
        </a>
        <div class="ticketCard-region">${item.area}</div>
        <div class="ticketCard-rank">${item.rate}</div>
      </div>
      <div class="ticketCard-content">
        <div>
          <h3>
            <a href="#" class="ticketCard-name">${item.name}</a>
          </h3>
          <p class="ticketCard-description">${item.description}</p>
        </div>
        <div class="ticketCard-info">
          <div class="ticketCard-num">
            <p>
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span>${item.group}</span> 組
            </p>
          </div>
          <p class="ticketCard-price">
            TWD <span>$${item.price}</span>
          </p>
        </div>
      </div>
    </li>
  `;
}

// 篩選邏輯
filter.addEventListener("change", function () {
  const selectedRegion = filter.value;
  const filteredData = selectedRegion === "全部地區"
    ? data
    : data.filter((item) => item.area === selectedRegion);

  renderCards(filteredData); // 更新卡片區域
});

// 表單驗證
function validateForm() {
  let isValid = true;
  Object.keys(formFields).forEach((field) => {
    const value = formFields[field].value.trim();
    if (!value) {
      errorMessages[field].innerHTML = errorTip; // 顯示錯誤提示
      isValid = false;
    } else {
      errorMessages[field].innerHTML = ""; // 清空錯誤提示
    }
  });
  return isValid; // 回傳表單是否有效
}


// 新增套票邏輯
btn.addEventListener("click", function () {
  if (!validateForm()) {
    return; // 若表單驗證未通過，則中止新增
  }

  // 建立新套票物件
  const newTicket = {
    id: data.length,
    name: formFields.ticketName.value.trim(),
    imgUrl: formFields.ticketImgUrl.value.trim(),
    area: formFields.ticketRegion.value.trim(),
    description: formFields.ticketDescription.value.trim(),
    group: parseInt(formFields.ticketNum.value, 10),
    price: parseInt(formFields.ticketPrice.value, 10),
    rate: parseInt(formFields.ticketRate.value, 10),
  };

  // 新增資料到陣列
  data.push(newTicket);

  // 更新畫面
  init();

  // 清空表單 (使用 reset 方法)
  addTicketForm.reset();

  // 清空錯誤提示
  Object.keys(errorMessages).forEach((field) => {
    errorMessages[field].innerHTML = ""; // 清空錯誤訊息
  });

  alert("新增套票成功！");
});

// 執行 API 請求
fetchData(apiUrl);

