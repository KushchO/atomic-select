var customicSelect = (function() {
  var customSelects = document.querySelectorAll('.customic-select');

  if (customSelects.length === 0) {
    return;
  }

  function hideOriginalSelect(select) {
    select.classList.add('custom-select__hidden');
  }

  function createInput(option) {
    var selectInput = document.createElement('input');
    selectInput.classList.add('custom-select__input');
    selectInput.value = option.text;
    selectInput.setAttribute('aria-label', option.text);
    return selectInput;
  }

  function createSelectList(select) {
    var selectList = document.createElement('ul');
    var selectOptions = select.querySelectorAll('option');
    selectList.classList.add('custom-select__list');
    selectList.classList.add('custom-select__hidden');
    selectOptions.forEach(function(option, index) {
      if (index === 0) {
        select.parentElement.appendChild(createInput(option));
      } else {
        selectList.appendChild(creatSelectOption(option));
      }
    });
    return selectList;
  }

  function creatSelectOption(optionItem) {
    var selectOption = document.createElement('li');
    selectOption.classList.add('custom-select__option');
    selectOption.dataset.value = optionItem.value;
    selectOption.dataset.selected = optionItem.selected;
    selectOption.dataset.disabled = optionItem.disabled;
    selectOption.setAttribute('tabindex', '-1');
    selectOption.textContent = optionItem.text;
    return selectOption;
  }

  function createListWrapper(select) {
    var selectСlassList = select.classList;
    var listWrapper = document.createElement('div');
    selectСlassList.forEach(function(className) {
      listWrapper.classList.add(className);
    });
    listWrapper.appendChild(createSelectList(select));
    return listWrapper;
  }

  customSelects.forEach(function(select) {
    select.parentElement.appendChild(createListWrapper(select));
    hideOriginalSelect(select);
    var customSelect = document.querySelector('.custom-select__wrapper');
    var selectList = customSelect.querySelector('.custom-select__list');
    var selectInput = customSelect.querySelector('.custom-select__input');
    var selectOptions = customSelect.querySelectorAll('.custom-select__option');
    var optionsNumber = selectOptions.length;
    var state = {
      status: 'closed',
      activOption: 'default'
    };

    function toggleCustomSelect() {
      selectList.classList.toggle('custom-select__hidden');
      state.status = state.status === 'closed' ? 'expanded' : 'closed';
      if (state.status === 'expanded') {
        if (state.activOption !== 'default')
          selectOptions[state.activOption].focus();
      }
    }

    selectInput.addEventListener('click', toggleCustomSelect);

    selectOptions.forEach(function(item, index) {
      item.addEventListener('click', function() {
        toggleCustomSelect();
        selectInput.value = item.innerHTML;
        select.value = item.innerHTML;
        state.activOption = index;
      });
    });

    function selectNext() {
      if (state.activOption !== 'default') {
        if (state.activOption === optionsNumber - 1) {
          state.activOption = 0;
          selectOptions[state.activOption].focus();
        } else state.activOption += 1;
        selectOptions[state.activOption].focus();
      } else {
        state.activOption = 0;
        selectOptions[state.activOption].focus();
      }
    }

    function selectPrevious() {
      if (state.activOption !== 'default') {
        if (state.activOption === 0) {
          state.activOption = optionsNumber - 1;
          selectOptions[state.activOption].focus();
        } else state.activOption -= 1;
        selectOptions[state.activOption].focus();
      } else {
        state.activOption = 0;
        selectOptions[state.activOption].focus();
      }
    }

    function keyActions(event) {
      var key = event.code;
      switch (key) {
        case 'Escape':
          if (state.status === 'expanded') {
            selectInput.focus();
            toggleCustomSelect();
          }
          break;
        case 'Enter':
          if (state.status === 'expanded') {
            if (state.activOption !== 'default') {
              selectInput.value = selectOptions[state.activOption].innerHTML;
              select.value = selectOptions[state.activOption].innerHTML;
            }
            toggleCustomSelect();
            break;
          }
          toggleCustomSelect();
          break;
        case 'ArrowDown':
          if (state.status === 'expanded') {
            selectNext();
            break;
          }
          toggleCustomSelect();
          selectNext();
          break;
        case 'ArrowRight':
          if (state.status === 'expanded') {
            selectNext();
            break;
          }
          toggleCustomSelect();
          selectNext();
          break;
        case 'ArrowUp':
          if (state.status === 'expanded') {
            selectPrevious();
            break;
          }
          toggleCustomSelect();
          selectPrevious();
          break;
        case 'ArrowLeft':
          if (state.status === 'expanded') {
            selectPrevious();
            break;
          }
          toggleCustomSelect();
          selectPrevious();
          break;
      }
    }

    customSelect.addEventListener('focusin', function() {
      document.addEventListener('keyup', keyActions);
    });

    customSelect.addEventListener('focusout', function() {
      document.removeEventListener('keyup', keyActions);
      if (state.status === 'expanded') {
        toggleCustomSelect();
      }
    });
  });
})();
