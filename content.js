function bindSelect() {
  console.log('called')
  var selectArray = document.getElementsByTagName('select');
  for (var select of selectArray) {
    if (!select || !select.id) {
      continue;
    }
    // put buttons next to select tags to open a dialog
    var btnid = 'selectSupport_' + select.id;
    var btn = document.createElement('button');
    btn.id = btnid;
    btn.dataset.srcid = select.id;
    btn.innerText = 'select';
    select.parentNode.insertBefore(btn, select.nextSibling);
    btn.addEventListener('click', function (e) {
      var targetSelect = document.getElementById(e.srcElement.dataset.srcid);
      createModalDialog(targetSelect);
      e.preventDefault();
    });
  }
}

function createModalDialog(srcSelect) {
  // covering whole body
  var cover = document.createElement('div');
  cover.style.position = 'absolute';
  cover.style.top = 0;
  cover.style.left = 0;
  cover.style.height = document.body.clientHeight + 'px';
  cover.style.width = document.body.clientWidth + 'px';
  cover.style.backgroundColor = 'black';
  cover.style.opacity = 0.3;
  cover.id = 'selectSearchCover'
  document.body.appendChild(cover);

  // dialog wrapper
  var baseWrapper = document.createElement('div');
  baseWrapper.style.position = 'absolute';
  baseWrapper.style.top = (window.pageYOffset + 10) + 'px';
  baseWrapper.style.left = '50%';

  var width = 640;
  var marginLeft = (width - width / 2) * -1;

  baseWrapper.style.width = width + 'px';
  baseWrapper.style.marginLeft = marginLeft + 'px';
  baseWrapper.style.padding = '10px';
  baseWrapper.style.border = '2px solid #ccdfff';
  baseWrapper.style.borderRadius = '10px';
  baseWrapper.style.backgroundColor = '#fff';
  baseWrapper.id = 'baseWrapper';
  document.body.appendChild(baseWrapper);

  // dialog base
  var base = document.createElement('div');
  base.style.width = '100%';
  baseWrapper.appendChild(base);

  // input type hidden for holding an id of target select tag
  var srcIdHidden = document.createElement('input');
  srcIdHidden.type = 'hidden';
  srcIdHidden.value = srcSelect.id;
  srcIdHidden.id = 'srcIdHidden';
  base.appendChild(srcIdHidden);

  // textbox
  var inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.style.width = '100%';
  inputBox.id = 'selectSearchInput';
  inputBox.tabIndex = '1000001';
  base.appendChild(inputBox);
  inputBox.focus();

  // select tag for result
  var searchSelect = document.createElement('select');
  searchSelect.style.width = '100%';
  searchSelect.size = 10; // size of select tag
  searchSelect.tabIndex = '1000002';
  var srcChildren = srcSelect.children;
  for (var option of srcChildren) {
    searchSelect.appendChild(option.cloneNode(true));
  }
  searchSelect.id = 'selectSearchSelect';
  base.appendChild(searchSelect);

  var buttonArea = document.createElement('div');
  buttonArea.style.width = '100%';
  buttonArea.style.display = 'flex';
  buttonArea.style.justifyContent = 'space-between';
  base.appendChild(buttonArea);

  // select button
  var selectButton = document.createElement('button');
  selectButton.id = 'selectExecuteButton';
  selectButton.innerText = '決定';
  selectButton.tabIndex = '1000003';
  selectButton.style.display = 'block'
  buttonArea.appendChild(selectButton);

  // close button
  var closeButton = document.createElement('button');
  closeButton.id = 'selectCloseButton';
  closeButton.innerText = '閉じる';
  closeButton.tabIndex = '1000004';
  closeButton.style.display = 'block'
  buttonArea.appendChild(closeButton);

  // もともとの情報を保持するためのセレクトボックス（隠し）
  var originalData = searchSelect.cloneNode();
  originalData.style.display = 'none';
  originalData.id = 'selectSearchSelectOriginal';
  for (var option of srcChildren) {
    originalData.appendChild(option.cloneNode(true));
  }
  base.appendChild(originalData);

  // テキストボックスに入力した場合、エンターでサーチ
  inputBox.addEventListener('keyup', function (e) {
    if (40 === e.keyCode) {
      // ↓キー押下時は、セレクトボックスに移動
      searchSelect.focus();
      return;
    }
    var currentValue = e.srcElement.value;
    var dest = document.getElementById('selectSearchSelect');
    var original = document.getElementById('selectSearchSelectOriginal');
    // セレクトボックスをリセット
    while (dest.childElementCount > 0) {
      // よくわからないけど1回じゃうまくいかないので、本当にchildrenが0になるまで削除を繰り返す。
      for (var option of dest.children) {
        dest.removeChild(option);
      }
    }
    if (!currentValue) {
      // テキストボックスが空の場合は全量表示
      for (var option of original.children) {
        dest.appendChild(option.cloneNode(true));
      }
      return;
    }
    // マッチするものを表示
    for (var option of original.children) {
      if (option && -1 < option.innerText.indexOf(currentValue)) {
        dest.appendChild(option.cloneNode(true));
      }
    }
  });
  // ダイアログ外をクリックした場合は、ダイアログを消す
  cover.addEventListener('click', function () {
    document.body.removeChild(document.getElementById('baseWrapper'));
    document.body.removeChild(document.getElementById('selectSearchCover'));
  });
  // 決定ボタン押下時の処理
  selectButton.addEventListener('click', function () {
    var selectedValue = document.getElementById('selectSearchSelect').value;
    if (selectedValue) {
      var srcId = srcIdHidden.value;
      document.getElementById(srcId).value = selectedValue;
    }
    // ダイアログを消す
    cover.click();
  });
  // 閉じるボタン
  closeButton.addEventListener('click', function () {
    cover.click();
  });
  // セレクトボックスでEnterを押下した場合は、決定と見なす。
  searchSelect.addEventListener('keyup', function (e) {
    if (13 === e.keyCode) {
      selectButton.click();
    }
  });
}

bindSelect();