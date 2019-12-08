var customicSelect = function(className) {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
  var customSelects = document.querySelectorAll(className);
  if (customSelects.length === 0) {
    return;
  }

  function hideOriginalSelect(select) {
    select.classList.add('custom-select__hidden');
  }

  function createInput(option) {
    var selectInput = document.createElement('input');
    selectInput.classList.add('custom-select__input');
    selectInput.placeholder = option.text;
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
        select.value = option.text;
      } else {
        selectList.appendChild(creatSelectOption(option, index));
      }
    });
    return selectList;
  }

  function creatSelectOption(optionItem, index) {
    var selectOption = document.createElement('li');
    selectOption.classList.add('custom-select__option');
    selectOption.dataset.value = optionItem.value;
    selectOption.dataset.selected = optionItem.selected;
    selectOption.dataset.disabled = optionItem.disabled;
    selectOption.dataset.count = index - 1;
    selectOption.setAttribute('tabindex', '-1');
    selectOption.textContent = optionItem.text;
    return selectOption;
  }

  function createListWrapper(select) {
    var selectСlassList = select.classList;
    var listWrapper = document.createElement('div');
    listWrapper.classList.add('custom-select__wrapper');
    listWrapper.setAttribute('tabindex', '-1');
    for (var i = 0; i < selectСlassList.length; i++) {
      listWrapper.classList.add(selectСlassList[i]);
    }
    listWrapper.appendChild(createSelectList(select));
    return listWrapper;
  }

  customSelects.forEach(function(select) {
    var state = {
      status: 'closed',
      activOption: 'default',
      activeItem: '',
      countClicks: 0,
      inputValue: '',
      options: [],
      renderedOptions: [],
      notFound: '<li class="custom-select__option">Ничего не найдено</li>'
    };
    select.parentElement.appendChild(createListWrapper(select));
    hideOriginalSelect(select);
    var selectWrapper = select.parentElement;
    var customSelect = selectWrapper.querySelector('.custom-select__wrapper');
    customSelect.setAttribute('tabindex', '0');
    var selectList = selectWrapper.querySelector('.custom-select__list');
    var selectInput = selectWrapper.querySelector('.custom-select__input');
    var selectOptions = selectWrapper.querySelectorAll(
      '.custom-select__option'
    );
    customSelect.insertBefore(selectInput, selectList);

    selectOptions.forEach(function(item) {
      state.options.push(item);
      state.renderedOptions.push(item);
    });

    function clickAndEnterChooseHandler(option) {
      var currentLiOption = state.renderedOptions[option.dataset.count];
      if (
        state.activOption !== 'default' &&
        currentLiOption.innerHTML !== select.value &&
        state.activeItem
      ) {
        state.activeItem.classList.remove('custom-select__option--active');
        state.activeItem.dataset.selected = 'false';
      }
      selectInput.value = '';
      selectInput.placeholder = currentLiOption.innerHTML;
      currentLiOption.classList.add('custom-select__option--active');
      currentLiOption.dataset.selected = true;
      state.activeItem = currentLiOption;
      select.value = currentLiOption.innerHTML;
      state.activOption = +currentLiOption.dataset.count;
    }

    function toggleCustomSelect() {
      selectList.classList.toggle('custom-select__hidden');
      state.status = state.status === 'closed' ? 'expanded' : 'closed';
    }

    function showCurrentSelectValue() {
      if (selectInput.value !== select.value) {
        selectInput.value = select.value;
      }
    }

    function renderAll() {
      selectList.innerHTML = '';
      state.renderedOptions = [];
      state.options.forEach(function(item, index) {
        item.dataset.count = index;
        state.renderedOptions.push(item);
        selectList.appendChild(item);
        if (state.activeItem) {
          state.activOption = state.activeItem.dataset.count;
        }
      });
    }

    function clickAndEnterHandler() {
      if (state.status === 'closed' && state.countClicks === 0) {
        selectInput.focus();
        state.countClicks = 1;
        if (state.options.length > state.renderedOptions.length) {
          renderAll();
        }
      }
      showCurrentSelectValue();
      state.countClicks = 0;
      toggleCustomSelect();
    }

    function focusItemAndResetActiveOption(activOption) {
      state.activOption = activOption;
      state.renderedOptions[state.activOption].focus();
    }

    function selectNext() {
      if (state.activOption !== 'default') {
        if (state.activOption === state.renderedOptions.length - 1) {
          focusItemAndResetActiveOption(0);
        } else state.activOption += 1;
        state.renderedOptions[state.activOption].focus();
      } else {
        focusItemAndResetActiveOption(0);
      }
    }

    function selectPrevious() {
      if (state.activOption !== 'default') {
        if (state.activOption === 0) {
          focusItemAndResetActiveOption(state.renderedOptions.length - 1);
        } else state.activOption -= 1;
        state.renderedOptions[state.activOption].focus();
      } else {
        focusItemAndResetActiveOption(0);
      }
    }

    function keyActions(event) {
      var key = event.keyCode;
      switch (key) {
        case 27:
          if (state.status === 'expanded') {
            selectInput.focus();
            toggleCustomSelect();
          }
          break;
        case 9:
          closeAndRemoveKeyListener(event);
          break;
        case 13:
          if (
            state.status !== 'closed' &&
            document.activeElement.tagName === 'LI'
          ) {
            clickAndEnterChooseHandler(document.activeElement);
          }
          clickAndEnterHandler();
          break;
        case 40:
          if (state.status === 'expanded') {
            selectNext();
            break;
          }
          toggleCustomSelect();
          selectNext();
          break;
        case 39:
          if (state.status === 'expanded') {
            selectNext();
            break;
          }
          toggleCustomSelect();
          selectNext();
          break;
        case 38:
          if (state.status === 'expanded') {
            selectPrevious();
            break;
          }
          toggleCustomSelect();
          selectPrevious();
          break;
        case 37:
          if (state.status === 'expanded') {
            selectPrevious();
            break;
          }
          toggleCustomSelect();
          selectPrevious();
          break;
      }
    }

    function closeAndRemoveKeyListener(e) {
      var target = e.target;
      if (target !== customSelect && !customSelect.contains(target)) {
        if (state.status === 'expanded') {
          toggleCustomSelect();
        }
        document.removeEventListener('keyup', keyActions);
      }
      showCurrentSelectValue();
    }

    customSelect.addEventListener('focusin', function(e) {
      e.stopPropagation();
      document.addEventListener('keyup', keyActions);
    });

    selectList.addEventListener('click', function(e) {
      var currentOption = e.target;
      if (currentOption.tagName === 'LI') {
        clickAndEnterChooseHandler(currentOption);
        toggleCustomSelect();
      }
    });

    selectInput.addEventListener('click', function() {
      clickAndEnterHandler();
    });

    document.addEventListener('click', function(e) {
      closeAndRemoveKeyListener(e);
    });

    //Search functionality
    selectInput.addEventListener('input', function(e) {
      state.inputValue = selectInput.value;
      state.renderedOptions = [];
      if (state.inputValue) {
        state.options.forEach(function(item) {
          if (
            item.innerHTML
              .toLowerCase()
              .indexOf(state.inputValue.toLowerCase()) !== -1
          ) {
            state.renderedOptions.push(item);
          } else {
            return;
          }
        });
      }
      if (state.renderedOptions.length > 0) {
        selectList.innerHTML = '';
        state.renderedOptions.forEach(function(item, index) {
          item.dataset.count = index;
          selectList.appendChild(item);
        });
        state.activOption = 0;
      }
      if (state.renderedOptions.length === 0) {
        selectList.innerHTML = state.notFound;
        state.activOption = 0;
      }
      if (selectInput.value === '') {
        renderAll();
        state.activOption = 0;
      }
    });
  });
};

customicSelect('.customic-select');
