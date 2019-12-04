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
    listWrapper.classList.add('custom-select__wrapper');
    listWrapper.setAttribute('tabindex', '-1');
    selectСlassList.forEach(function(className) {
      listWrapper.classList.add(className);
    });
    listWrapper.appendChild(createSelectList(select));
    return listWrapper;
  }

  customSelects.forEach(function(select) {
    var state = {
      status: 'initial',
      activOption: 'default',
      countClicks: 0,
      inputValue: '',
      options: [],
      renderedOptions: []
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
    var optionsNumber = selectOptions.length;
    customSelect.insertBefore(selectInput, selectList);

    selectOptions.forEach(function(item, index) {
      state.options.push(item);
      state.renderedOptions.push(item);
      item.addEventListener('click', function() {
        selectOptions.forEach(function(item) {
          if (item.classList.contains('custom-select__option--active')) {
            item.classList.remove('custom-select__option--active');
          }
        });
        toggleCustomSelect();
        selectInput.value = '';
        selectInput.placeholder = item.innerHTML;
        item.classList.add('custom-select__option--active');
        select.value = item.innerHTML;
        state.activOption = index;
      });
    });

    function toggleCustomSelect() {
      selectList.classList.toggle('custom-select__hidden');
      state.status =
        state.status === 'closed' || state.status === 'initial'
          ? 'expanded'
          : 'closed';
    }

    function showCurrentSelectValue() {
      if (selectInput.value !== select.value) {
        selectInput.value = select.value;
      }
    }

    selectInput.addEventListener('click', function() {
      if (state.status === 'closed' && state.countClicks === 0) {
        selectInput.focus();
        state.countClicks = 1;
        if (state.options.length > state.renderedOptions.length) {
          selectList.innerHTML = '';
          state.options.forEach(function(item) {
            selectList.appendChild(item);
          });
        }
      }
      showCurrentSelectValue();
      state.countClicks = 0;
      toggleCustomSelect();
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
        case 'Tab':
          closeAndRemoveKeyListener(event);
          break;
        case 'Enter':
          if (state.status === 'expanded') {
            if (state.activOption !== 'default') {
              selectInput.placeholder =
                selectOptions[state.activOption].innerHTML;
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

    function closeAndRemoveKeyListener(e) {
      var target = e.target;
      if (target !== customSelect && !customSelect.contains(target)) {
        console.log('!!');
        if (state.status === 'expanded') {
          console.log('!!!');
          toggleCustomSelect();
        }
        document.removeEventListener('keyup', keyActions);
      }
      showCurrentSelectValue();
    }

    customSelect.addEventListener('focusin', function() {
      document.addEventListener('keyup', keyActions);
    });

    document.addEventListener('click', function(e) {
      closeAndRemoveKeyListener(e);
    });
    //Search functionality
    selectInput.addEventListener('input', function(e) {
      state.inputValue = selectInput.value;

      state.renderedOptions = state.options.filter(function(item) {
        console.log('filter');
        return item.innerHTML
          .toLowerCase()
          .includes(state.inputValue.toLowerCase());
      });

      if (state.renderedOptions.length > 0) {
        selectList.innerHTML = '';
        state.renderedOptions.forEach(function(item) {
          selectList.appendChild(item);
        });
      }
    });
  });
})();
