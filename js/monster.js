window.onload = initMonsterView();

function initMonsterView() {
  initFilterTable();
  setMonsterList();
  resetMonsterDetails();
}

// フィルターアイコン初期化
function initFilterTable() {
  let table = document.getElementById("attribute_list");
  let tr = document.createElement("tr");
  // 属性アイコン
  Object.keys(attribute_data.attributes).map(key => {
    let td = document.createElement("td");
    let span = document.createElement("span");
    let img = document.createElement("img");
    img.src = attribute_data.attributes[key].img_path;
    img.style.width = "46px"
    span.appendChild(img);
    td.dataset.type = key;
    td.dataset.isAttribute = true;
    td.appendChild(span);
    tr.appendChild(td);
  });
  // バツアイコン
  let td = document.createElement("td");
  let span = document.createElement("span");
  let img = document.createElement("img");
  img.src = "../../src/img/icon/clear.png";
  img.style.width = "40px"
  span.appendChild(img);
  td.appendChild(span);
  td.dataset.type = 0;
  td.dataset.isAttribute = false;
  tr.appendChild(td);
  table.appendChild(tr);

  // 歴戦の証アイコン
  tr = document.createElement("tr");
  for(let i = 0; i < 3; i++) {
    let td = document.createElement("td");
    let span = document.createElement("span");
    let text;
    switch(i) {
      case 0:
        text = "証Ⅰ";
        break;
      case 1:
        text = "証Ⅱ";
        break;
      case 2:
        text = "証Ⅲ";
        break;
    }
    span.textContent = text;
    td.appendChild(span);
    td.dataset.type = i+1;
    td.dataset.isAttribute = false;
    td.colSpan = 2;
    tr.appendChild(td);
  }
  table.appendChild(tr);

  table.addEventListener("click", (event) => {
    let td;
    switch (event.target.nodeName) {
      case "TD":
        td = event.target;
        break;
      case "SPAN":
        td = event.target.parentElement;
        break;
      case "IMG":
        td = event.target.parentElement.parentElement;
        break;
    }
    setMonsterList(Number(td.dataset.type), td.dataset.isAttribute === "true");

    if (td.dataset.type === "0") {
      td = null;
    }
    setTableBackgroundColor(table, td);
  });
}

// モンスターリストにコンテンツをセット
function setMonsterList(filter_val = 0, is_attribute = false) {
  let table = document.getElementById("monster_list");
  while(table.firstChild){
    table.removeChild(table.firstChild);
  }

  let col_cnt = 0;
  let tr;
  Object.keys(monster_data).map(key => {
    if (!(col_cnt % 5)) {
      tr = document.createElement("tr");
    }

    if (filter_val !== 0 && ((is_attribute && !monster_data[key].attributes.includes(filter_val)) || (!is_attribute && monster_data[key].symbol_level !== filter_val))) {
      return;
    }

    let td = document.createElement("td");
    td.dataset.id = key;
    td.dataset.symbol_level = monster_data[key].symbol_level;
    td.style.height = "146px";
    let img = document.createElement("img");
    img.src = monster_data[key].img_path;
    img.style.height = "100%";
    td.appendChild(img);
    tr.appendChild(td);

    col_cnt++;
    if (!(col_cnt % 5)) {
      table.appendChild(tr);
      tr = null;
    }
  })
  if (tr != null) {
    table.appendChild(tr);
  }

  // モンスターアイコンクリック時のメソッドセット
  addEventListenerForMonsterList();
}

// 選択中のセル背景色変更
function setTableBackgroundColor(table, td) {
  let tr = table.querySelectorAll("tr");
  for(let i = 0; i < tr.length; i++) {
    let td = tr[i].querySelectorAll("td");
    for (let j = 0; j < td.length; j++) {
      td[j].style.backgroundColor = "#ffffff";
    }
  }
  td.style.backgroundColor = "#70f0f0";
}

// モンスターアイコンクリック時のメソッドセット
function addEventListenerForMonsterList() {
  let table = document.getElementById("monster_list");
  table.addEventListener("click", (event) => {
    let td;
    switch (event.target.nodeName) {
      case "TD":
        setMonsterDetails(event.target);
        td = event.target;
        break;
      case "IMG":
        setMonsterDetails(event.target.parentElement);
        td = event.target.parentElement;
        break;
    }
    setMonsterIconColor(table, td);
  });
}

// 選択中のモンスターアイコン色変更
function setMonsterIconColor(table, td) {
  let tr = table.querySelectorAll("tr");
  for(let i = 0; i < tr.length; i++) {
    let td = tr[i].querySelectorAll("td");
    for (let j = 0; j < td.length; j++) {
      td[j].firstChild.style.filter = "brightness(1)";
    }
  }
  td.firstChild.style.filter = "brightness(1.5)";
}

// モンスター詳細リセット（非表示）
function resetMonsterDetails() {
  let table = document.getElementById("monster_detail");
  table.style.display = "none";
}

// 対象モンスター情報表示
function setMonsterDetails(elem) {
  let table = document.getElementById("monster_detail");
  table.style.display = "table";
  while(table.firstChild){
    table.removeChild(table.firstChild);
  }

  let monster_detail = monster_data[elem.dataset.id];

  // モンスター画像
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let img = document.createElement("img");
  img.src = monster_detail.img_path;
  img.style.width = "446px";
  td.appendChild(img);
  tr.appendChild(td);
  table.appendChild(tr);

  // 弱点属性
  tr = document.createElement("tr");
  tr.appendChild(getMonsterWeakAttributes(monster_detail));
  table.appendChild(tr);
  // 状態異常
  tr = document.createElement("tr");
  tr.appendChild(getMonsterWeakStatusEffects(monster_detail));
  table.appendChild(tr);
  // 罠・アイテム
  tr = document.createElement("tr");
  tr.appendChild(getMonsterWeakTraps(monster_detail));
  table.appendChild(tr);
}

// 弱点属性
function getMonsterWeakAttributes(monster_detail) {
  let td = document.createElement("td");
  let span = document.createElement("span");
  monster_detail.attributes.forEach(attribute => {
    let img = document.createElement("img");
    img.src = attribute_data.attributes[attribute].img_path;
    img.style.width = "66px";
    span.appendChild(img);
  });
  td.appendChild(span);
  return td;
}

// 状態異常
function getMonsterWeakStatusEffects(monster_detail) {
  let td = document.createElement("td");
  let span = document.createElement("span");
  monster_detail.status_effects.forEach(status_effect => {
    let img = document.createElement("img");
    img.src = attribute_data.status_effects[status_effect].img_path;
    img.style.width = "66px";
    span.appendChild(img);
  });
  td.appendChild(span);
  return td;
}

// 罠・アイテム
function getMonsterWeakTraps(monster_detail) {
  let td = document.createElement("td");
  let span = document.createElement("span");
  monster_detail.traps.forEach(trap_id => {
    let img = document.createElement("img");
    img.src = attribute_data.traps[trap_id].img_path;
    img.style.width = "66px";
    span.appendChild(img);
  });
  td.appendChild(span);
  return td;
}