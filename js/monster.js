window.onload = initMonsterView();

function initMonsterView() {
  resetMonsterList();
  resetMonsterDetails();
}

// モンスターリスト初期化
function resetMonsterList() {
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

  let tr = document.createElement("tr");
  let td = document.createElement("td");
  let img = document.createElement("img");
  img.src = monster_detail.img_path;
  img.style.width = "346px";
  td.appendChild(img);
  tr.appendChild(td);
  table.appendChild(tr);

  tr = document.createElement("tr");
  tr.appendChild(getMonsterWeakAttributes(monster_detail));
  table.appendChild(tr);

  tr = document.createElement("tr");
  tr.appendChild(getMonsterWeakStatusEffects(monster_detail));
  table.appendChild(tr);

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
    img.style.width = "46px";
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