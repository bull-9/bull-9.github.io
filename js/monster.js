window.onload = initMonsterView();

function initMonsterView() {
  initFilterTable();
  setMonsterList();
  resetMonsterDetails();
}

// フィルターアイコン初期化
function initFilterTable() {
  // 属性アイコン
  let table = document.getElementById("attribute_list");
  let tr = document.createElement("tr");
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
  td.dataset.type = 0;
  td.dataset.isAttribute = false;
  td.appendChild(span);
  tr.appendChild(td);

  table.appendChild(tr);

  table.addEventListener("click", (event) => {
    switch (event.target.nodeName) {
      case "TD":
        setMonsterList(Number(event.target.dataset.type), event.target.dataset.isAttribute);
        break;
      case "IMG":
        setMonsterList(Number(event.target.parentElement.parentElement.dataset.type), event.target.parentElement.parentElement.dataset.isAttribute);
        break;
      case "SPAN":
        setMonsterList(Number(event.target.parentElement.dataset.type), event.target.parentElement.dataset.isAttribute);
      break;
    }
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

// モンスターアイコンクリック時のメソッドセット
function addEventListenerForMonsterList() {
  let table = document.getElementById("monster_list");
  table.addEventListener("click", (event) => {
    switch (event.target.nodeName) {
      case "TD":
        setMonsterDetails(event.target);
        break;
      case "IMG":
        setMonsterDetails(event.target.parentElement);
        break;
    }
  });
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