let current_filter = {
  attribute: 0,
  symbol_level: 0,
  weakest: 0,
  is_filtering: false,
};
let data_table_elems = {};
let is_event_already_add = false;

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
  Object.keys(attribute_data.attributes).map((key) => {
    td = document.createElement("td");
    span = document.createElement("span");
    let img = document.createElement("img");
    img.src = attribute_data.attributes[key].img_path;
    img.style.width = "46px";
    span.appendChild(img);
    td.dataset.type = key;
    td.dataset.category = "attribute";
    td.appendChild(span);
    tr.appendChild(td);
  });
  table.appendChild(tr);

  // 歴戦の証アイコン
  tr = document.createElement("tr");
  for (let i = 0; i < 3; i++) {
    td = document.createElement("td");
    span = document.createElement("span");
    let text;
    switch (i) {
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
    td.dataset.type = i + 1;
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
      setCurrentFilter(td.dataset.category, Number(td.dataset.type));
    }
    setMonsterList();
    setTableBackgroundColor(table);
  });
}

// フィルターセット
function setCurrentFilter(category, type) {
  type = current_filter[category] !== type ? type : 0;
  switch (category) {
    case "attribute":
      if (type === 0) {
        current_filter.weakest = 0;
      }
      break;
    case "weakest":
      if (type === 1 && !current_filter.attribute) {
        type = 0;
      }
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
    monster_data.attributes.forEach((attributes) => {
      if (attributes.includes(current_filter.attribute)) {
        is_target = true;
      }
    });
  }
  if (current_filter.symbol_level) {
    is_target =
      is_target && monster_data.symbol_level === current_filter.symbol_level;
  }

  return !is_target;
}

// モンスターリストにコンテンツをセット
function setMonsterList() {
  let table = document.getElementById("monster_list");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  let col_cnt = 0;
  let tr;
  Object.keys(monster_data).map((key) => {
    if (isIgnoreMonsterData(monster_data[key])) {
      return;
    }

    if (!(col_cnt % 5)) {
      tr = document.createElement("tr");
      tr.style.display = "flex";
    }
    let td = document.createElement("td");
    td.dataset.id = key;
    td.dataset.symbol_level = monster_data[key].symbol_level;
    td.style.height = td.style.width = "145px";
    td.style.display = "flex";
    td.style.alignItems = "flex-end";
    td.style.background = `url(${monster_data[key].img_path}) no-repeat center/cover`;

    let span = document.createElement("span");
    let font_size = 120 / monster_data[key].name.length;
    span.textContent = monster_data[key].name;
    span.style.backgroundColor = "#ffffffcc";
    span.style.padding = "10px";
    span.style.marginBottom = "-2px";
    span.style.fontSize = `clamp(12.5px, ${font_size}px, 20px)`;
    span.style.width = "100%";
    span.style.height = "25px";
    td.appendChild(span);

    tr.appendChild(td);

    col_cnt++;
    if (!(col_cnt % 5)) {
      table.appendChild(tr);
      tr = null;
    }
  });
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
  for (let i = 0; i < tr.length; i++) {
    let td = tr[i].querySelectorAll("td");
    for (let j = 0; j < td.length; j++) {
      td[j].style.backgroundColor = "#ffffff";
      if (
        current_filter[td[j].dataset.category] === Number(td[j].dataset.type)
      ) {
        target_elems.push(td[j]);
      }
    }
  }
  target_elems.forEach((elem) => {
    elem.style.backgroundColor = "#70f0f0";
  });
}

// モンスターアイコンクリック時のメソッドセット
function addEventListenerForMonsterList() {
  if (is_event_already_add) {
    return;
  }
  is_event_already_add = true;

  let table = document.getElementById("monster_list");
  table.addEventListener("click", (event) => {
    let td;
    switch (event.target.nodeName) {
      case "TD":
        setMonsterData(event.target);
        td = event.target;
        break;
      case "IMG":
        setMonsterData(event.target.parentElement);
        td = event.target.parentElement;
        break;
      default:
        return;
    }
    setMonsterIconColor(table, td);
  });
}

// 選択中のモンスターアイコン色変更
function setMonsterIconColor(table, td) {
  let tr = table.querySelectorAll("tr");
  for (let i = 0; i < tr.length; i++) {
    let td = tr[i].querySelectorAll("td");
    for (let j = 0; j < td.length; j++) {
      td[j].firstChild.style.filter = "brightness(1)";
    }
  }
  td.firstChild.style.filter = "brightness(1.5)";
}

// モンスター詳細リセット（非表示）
function resetMonsterDetails() {
  let info_table = document.getElementById("monster_info");
  let detail_table = document.getElementById("monster_detail");
  info_table.style.display = detail_table.style.display = "none";
  info_table.nextElementSibling.style.display = "inline-block";
  data_table_elems = {
    info_table_elem: info_table,
    detail_table_elem: detail_table,
    icon_elem: info_table.nextElementSibling,
  };
}

// 対象モンスター情報表示
function setMonsterData(elem) {
  let monster_info = monster_data[elem.dataset.id];

  // モンスター情報表示
  setMonsterInfo(monster_info);
  // モンスター詳細表示
  setMonsterDetail(monster_info.details);
}

// モンスター情報表示
function setMonsterInfo(monster_info) {
  let info_table = data_table_elems.info_table_elem;
  let icon = data_table_elems.icon_elem;

  info_table.style.display = "table";
  icon.style.display = "none";
  while (info_table.firstChild) {
    info_table.removeChild(info_table.firstChild);
  }

  // モンスター画像
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let span = document.createElement("span");
  td.style.display = "flex";
  td.style.justifyContent = "flex-end";
  td.style.flexDirection = "column";
  td.style.height = "296px";
  td.style.aspectRatio = 1;
  td.style.background = `url(${monster_info.img_path}) no-repeat center/cover`;
  span.textContent = monster_info.name;
  span.style.backgroundColor = "#ffffffcc";
  span.style.padding = "10px";
  span.style.marginBottom = "-2px";
  span.style.fontSize = "30px";
  span.style.whiteSpace = "nowrap";
  td.appendChild(span);
  tr.appendChild(td);
  info_table.appendChild(tr);

  // 弱点属性
  tr = document.createElement("tr");
  tr.appendChild(convertMonsterWeakAttributes(monster_info));
  info_table.appendChild(tr);
  // 状態異常
  tr = document.createElement("tr");
  tr.appendChild(convertMonsterWeakStatusEffects(monster_info));
  info_table.appendChild(tr);
  // 罠・アイテム
  tr = document.createElement("tr");
  tr.appendChild(convertMonsterWeakTraps(monster_info));
  info_table.appendChild(tr);
}

// モンスター詳細表示
function setMonsterDetail(monster_detail) {
  let table = data_table_elems.detail_table_elem;

  table.style.display = "table";
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  // エキス採取部位
  convertMonsterEssenceParts(monster_detail.essence, table);
  // モンスター肉質
  convertMonsterWeakParts(monster_detail.weaks, table);
}

// エキス採取部位
function convertMonsterEssenceParts(monster_essence, table) {
  Object.entries(monster_essence).forEach(([color, parts]) => {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let span = document.createElement("span");
    let img = document.createElement("img");
    img.src = "../../src/img/icon/insect.png";
    img.style.filter = "drop-shadow(0 0 1px rgba(0, 0, 0))";
    img.style.width = "46px";

    td.style.backgroundColor = color;
    td.style.width = "60px";
    span.appendChild(img);
    td.appendChild(span);
    tr.appendChild(td);

    td = document.createElement("td");
    span = document.createElement("span");
    let text = "";
    parts.forEach((name) => {
      text += name + ",";
    });
    text = text.slice(0, -1);
    if (!text.length) {
      let i = document.createElement("i");
      i.classList.add("fa-solid");
      i.classList.add("fa-xmark");
      i.style.color = "red";
      i.style.fontSize = "46px";
      span.appendChild(i);
    } else {
      let p = document.createElement("p");
      p.textContent = text;
      span.appendChild(p);
    }
    td.style.padding = "7.5px";

    td.appendChild(span);
    tr.appendChild(td);
    table.appendChild(tr);
  });
}

// モンスター肉質
function convertMonsterWeakParts(monster_weaks, table) {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let span = document.createElement("span");
  let p = document.createElement("p");

  // 武器属性別の弱点肉質
  Object.entries(monster_weaks).forEach(([attack_type, details]) => {
    tr = document.createElement("tr");
    td = document.createElement("td");
    span = document.createElement("span");

    let img = document.createElement("img");
    img.src = attribute_data.attack_type[attack_type].img_path;
    img.style.width = "46px";
    span.appendChild(img);
    td.appendChild(span);
    tr.appendChild(td);

    td = document.createElement("td");
    span = document.createElement("span");
    details.forEach((_details, index) => {
      if (index) {
        let i = document.createElement("i");
        i.classList.add("fa-solid");
        i.classList.add("fa-chevron-right");
        span.appendChild(i);
      }
      let text = "";
      _details.forEach((name) => {
        text += name + ",";
      });
      text = text.slice(0, -1);

      if (!text.length) {
        return;
      }

      p = document.createElement("p");
      p.textContent = text;
      span.appendChild(p);
    });

    td.appendChild(span);
    tr.appendChild(td);
    table.appendChild(tr);
  });
}

// 弱点属性
function convertMonsterWeakAttributes(monster_detail) {
  let td = document.createElement("td");
  let span = document.createElement("span");
  monster_detail.attributes.forEach((attributes, index) => {
    if (index) {
      let i = document.createElement("i");
      i.classList.add("fa-solid");
      i.classList.add("fa-chevron-right");
      span.appendChild(i);
    }
    attributes.forEach((attribute) => {
      let img = document.createElement("img");
      img.src = attribute_data.attributes[attribute].img_path;
      img.style.width = "46px";
      span.appendChild(img);
    });
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
function convertMonsterWeakStatusEffects(monster_detail) {
  let td = document.createElement("td");
  let span = document.createElement("span");
  monster_detail.status_effects.forEach((status_effect) => {
    let img = document.createElement("img");
    img.src = attribute_data.status_effects[status_effect].img_path;
    img.style.width = "46px";
    span.appendChild(img);
  });
  td.appendChild(span);
  return td;
}

// 罠・アイテム
function convertMonsterWeakTraps(monster_detail) {
  let td = document.createElement("td");
  let span = document.createElement("span");
  monster_detail.traps.forEach((trap_id) => {
    let img = document.createElement("img");
    img.src = attribute_data.traps[trap_id].img_path;
    img.style.width = "46px";
    span.appendChild(img);
  });
  td.appendChild(span);
  return td;
}
