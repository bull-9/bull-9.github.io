var current_filter = {
  attribute: 0,
  symbol_level: 0,
  weakest: 0,
  is_filtering: false
};
var current_detail_table_num = 0;
var detail_table_elems = []

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
  let td, span;
// 属性アイコン
  Object.keys(attribute_data.attributes).map(key => {
    td = document.createElement("td");
    span = document.createElement("span");
    let img = document.createElement("img");
    img.src = attribute_data.attributes[key].img_path;
    img.style.width = "46px"
    span.appendChild(img);
    td.dataset.type = key;
    td.dataset.category = "attribute";
    td.appendChild(span);
    tr.appendChild(td);
  });
  table.appendChild(tr);

  // 歴戦の証アイコン
  tr = document.createElement("tr");
  for(let i = 0; i < 3; i++) {
    td = document.createElement("td");
    span = document.createElement("span");
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
    td.dataset.category = "symbol_level";
    tr.appendChild(td);
  }
  // 最適属性のみ
  td = document.createElement("td");
  span = document.createElement("span");
  span.textContent = "最適属性のみ";
  td.appendChild(span);
  td.dataset.type = 1;
  td.dataset.category = "weakest";
  tr.appendChild(td);
  // バツアイコン
  td = document.createElement("td");
  span = document.createElement("span");
  let i = document.createElement("i");
  i.classList.add("fa-solid"); 
  i.classList.add("fa-xmark"); 
  i.style.color = "red";
  i.style.fontSize = "46px";
  span.appendChild(i);
  td.appendChild(span);
  td.dataset.type = 0;
  td.dataset.category = "";
  tr.appendChild(td);
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
      case "I":
      case "IMG":
        td = event.target.parentElement.parentElement;
        break;
    }

    if (td.dataset.type === "0") {
      resetCurrentFilter();
    } else {
      setCurrentFilter(td.dataset.category, Number(td.dataset.type))
    }
    setMonsterList();
    setTableBackgroundColor(table);
  });
}

// フィルターセット
function setCurrentFilter(category, type) {
  type = (current_filter[category] !== type) ? type : 0;
  switch (category) {
    case "attribute":
      if (type === 0) { current_filter.weakest = 0; }
      break;
    case "weakest":
      if (type === 1 && !current_filter.attribute) { type = 0; }
  }
  current_filter[category] = type;
}
// フィルタリセット
function resetCurrentFilter() {
  current_filter = {
    attribute: 0,
    symbol_level: 0,
    weakest: 0,
  };
}

// 対象モンスターがフィルター対象かチェック
function isIgnoreMonsterData(monster_data) {
  let is_target = true;
  if (current_filter.weakest && monster_data.attributes.length) {
    is_target = monster_data.attributes[0].includes(current_filter.attribute);
  } else if (current_filter.attribute) {
    is_target = false;
    monster_data.attributes.forEach((attributes => {if(attributes.includes(current_filter.attribute)) {is_target = true;}}));
  }
  if(current_filter.symbol_level) {
    is_target = is_target && (monster_data.symbol_level === current_filter.symbol_level);
  }

  return !is_target;
}

// モンスターリストにコンテンツをセット
function setMonsterList() {
  let table = document.getElementById("monster_list");
  while(table.firstChild){
    table.removeChild(table.firstChild);
  }

  let col_cnt = 0;
  let tr;
  Object.keys(monster_data).map(key => {
    if (isIgnoreMonsterData(monster_data[key])) {
      return;
    }

    if (!(col_cnt % 5)) {
      tr = document.createElement("tr");
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
function setTableBackgroundColor(table) {
  let target_elems = [];
  let tr = table.querySelectorAll("tr");
  for(let i = 0; i < tr.length; i++) {
    let td = tr[i].querySelectorAll("td");
    for (let j = 0; j < td.length; j++) {
      td[j].style.backgroundColor = "#ffffff";
      if (current_filter[td[j].dataset.category] === Number(td[j].dataset.type)) {
        target_elems.push(td[j]);
      }
    }
  }
  target_elems.forEach(elem => {
    elem.style.backgroundColor = "#70f0f0";
  })
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
  let table = document.getElementById("monster_detail_1");
  table.style.display = "none";
  table.nextElementSibling.style.display = "inline-block";
  detail_table_elems[1] = {
    is_selected: false,
    table_elem: table,
    icon_elem: table.nextElementSibling
  }
  table = document.getElementById("monster_detail_2");
  table.style.display = "none";
  table.nextElementSibling.style.display = "inline-block";
  detail_table_elems[2] = {
    is_selected: false,
    table_elem: table,
    icon_elem: table.nextElementSibling
  }
}

// 対象モンスター情報表示
function setMonsterDetails(elem) {
  let select_detail_index = 0;
  detail_table_elems.forEach((elems, index) => {
    if (elems.is_selected || select_detail_index) { return; }
    elems.is_selected = true;
    select_detail_index = index;
  })
  if (!select_detail_index) {
    select_detail_index = detail_table_elems.length - 1;
    detail_table_elems[select_detail_index].is_selected = true;
  }
  let table = detail_table_elems[select_detail_index].table_elem;
  let icon = detail_table_elems[select_detail_index].icon_elem;
  icon.style.display = "none";
  table.style.display = "table";

  while(table.firstChild){
    table.removeChild(table.firstChild);
  }

  let monster_detail = monster_data[elem.dataset.id];

  // モンスター画像
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  td.style.display = "flex";
  td.style.justifyContent = "end";
  td.style.alignItems = "start";
  td.style.height = "296px";
  td.style.aspectRatio = 1;
  td.style.background = `url(${monster_detail.img_path}) no-repeat center/cover`;
  // バツアイコン
  let i = document.createElement("i");
  i.classList.add("fa-solid");
  i.classList.add("fa-xmark");
  i.style.borderRadius = "5px";
  i.style.padding = "0 6.25px";
  i.style.margin = "5px";
  i.style.fontSize = "50px";
  i.style.color = "red";
  i.style.backgroundColor = "white";
  i.addEventListener('click', () => {
    table.style.display = "none";
    icon.style.display = "inline-block";
    detail_table_elems[select_detail_index].is_selected = false;
  })
  td.appendChild(i);
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
  monster_detail.attributes.forEach((attributes, index) => {
    if (index) {
      let i = document.createElement("i");
      i.classList.add("fa-solid"); 
      i.classList.add("fa-chevron-right"); 
      i.style.fontSize = "20px";
      span.appendChild(i);
    }
    attributes.forEach(attribute => {
      let img = document.createElement("img");
      img.src = attribute_data.attributes[attribute].img_path;
      img.style.width = "46px";
      span.appendChild(img);
    })
  });
  if (!monster_detail.attributes.length) {
    let i = document.createElement("i");
    i.classList.add("fa-solid"); 
    i.classList.add("fa-xmark"); 
    i.style.color = "red";
    i.style.fontSize = "46px";
    span.appendChild(i);
  }
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
    img.style.width = "46px";
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
    img.style.width = "46px";
    span.appendChild(img);
  });
  td.appendChild(span);
  return td;
}