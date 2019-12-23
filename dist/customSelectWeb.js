//Use atomicSelect('Your class for custom selects') to activate library
var atomicSelect = function(className) {
  //NodeList forEach suppor for IE11
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
  //Collect all selects to NodeList customSelects
  var customSelects = document.querySelectorAll(className);
  if (customSelects.length === 0) {
    return;
  }
  //Function for hiding original selects, replaced by custom one.
  function hideOriginalSelect(select) {
    select.classList.add('custom-select__hidden');
  }
  //Function for creating input in custom select and returns it
  //Takes selected option as argument to create start placeholder
  function createInput(option) {
    var selectInput = document.createElement('input');
    selectInput.tabIndex = -1;
    selectInput.classList.add('custom-select__input');
    selectInput.placeholder = option.text;
    selectInput.setAttribute('aria-label', option.text);
    return selectInput;
  }
  //Function which creates list for options and returns it
  //It takes original select as argument
  //We also initiate creating and appending input and options here
  function createSelectList(select, customSelect) {
    var selectList = document.createElement('ul');
    var selectOptions = select.querySelectorAll('option');
    selectList.classList.add('custom-select__list');
    selectList.classList.add('custom-select__hidden');
    selectOptions.forEach(function(option, index) {
      if (option.selected === true) {
        customSelect.appendChild(createInput(option));
      }
      selectList.appendChild(creatSelectOption(option, index));
    });
    return selectList;
  }
  //Function which creates each options from original one and returns it
  //Takes original option and its index as arguments
  function creatSelectOption(optionItem, index) {
    var selectOption = document.createElement('li');
    selectOption.classList.add('custom-select__option');
    if (optionItem.disabled === true) {
      selectOption.classList.add('custom-select__option--disabled');
    }
    selectOption.dataset.value = optionItem.value;
    selectOption.dataset.selected = optionItem.selected;
    selectOption.dataset.disabled = optionItem.disabled;
    selectOption.dataset.count = index;
    selectOption.setAttribute('tabindex', '-1');
    selectOption.textContent = optionItem.text;
    return selectOption;
  }
  //Function creates custom select wrapper and returns it
  //initiates creating select list of options
  function createcustomSelect(select) {
    var selectСlassList = select.classList;
    var customSelect = document.createElement('div');
    customSelect.classList.add('custom-select__wrapper');
    customSelect.setAttribute('tabindex', '-1');
    for (var i = 0; i < selectСlassList.length; i++) {
      customSelect.classList.add(selectСlassList[i]);
    }
    customSelect.appendChild(createSelectList(select, customSelect));
    return customSelect;
  }
  //In this cycle we go through each select and add listeners to its components
  customSelects.forEach(function(select, index) {
    //Create "not found" li for search functionality
    var notFound = document.createElement('li');
    notFound.classList.add('custom-select__option');
    notFound.classList.add('custom-select__option--not-found');
    notFound.textContent = 'Ничего не найдено';
    //state object
    var state = {
      status: 'closed',
      activOption: 'default',
      activeItem: '',
      countClicks: 0,
      inputValue: '',
      options: [],
      renderedOptions: [],
      notFound: notFound
    };
    //Assigne all elements for each instanse of custom select instances
    var customSelect = createcustomSelect(select);

    select.parentElement.insertBefore(customSelect, select);
    hideOriginalSelect(select);
    customSelect.setAttribute('tabindex', '0');
    var selectList = customSelect.querySelector('.custom-select__list');
    var selectInput = customSelect.querySelector('.custom-select__input');
    console.log(selectInput);
    var selectOptions = customSelect.querySelectorAll('.custom-select__option');
    customSelect.appendChild(selectInput);
    if (select.disabled) {
      selectInput.disabled = true;
    }

    selectOptions.forEach(function(item) {
      state.options.push(item);
      state.renderedOptions.push(item);
    });
    //Here is all functionallity for choose option
    function clickAndEnterChooseHandler(option) {
      //we do anything only if option isn't disabled
      if (option.dataset.disabled !== 'true') {
        //If it is not first click or enter we remove active satuts
        //from previous item
        if (
          state.activOption !== 'default' &&
          option.textContent !== select.value &&
          state.activeItem
        ) {
          state.activeItem.classList.remove('custom-select__option--active');
          state.activeItem.dataset.selected = 'false';
        }
        //Here we set active status to choosen item
        //And send new value to our original select
        selectInput.value = '';
        selectInput.placeholder = option.textContent;
        option.classList.add('custom-select__option--active');
        option.dataset.selected = true;
        state.activeItem = option;
        select.value = option.dataset.value;
        var event = new Event('change');
        select.dispatchEvent(event);
        state.activOption = +option.dataset.count;
      }
    }
    //Just toggle our list
    function toggleCustomSelect() {
      selectList.classList.toggle('custom-select__hidden');
      state.status = state.status === 'closed' ? 'expanded' : 'closed';
      if (state.status === 'closed') {
        customSelect.focus();
        selectInput.style.zIndex = 0;
      } else {
        selectInput.style.zIndex = 10;
      }
    }
    //Show our cussrent select value
    function showCurrentSelectPlaceholder() {
      if (
        state.activeItem &&
        selectInput.placeholder !== state.activeItem.textContent
      ) {
        selectInput.placeholder = state.activeItem.textContent;
      }
    }
    //Render all items of our select
    //We need this function after using our search functionallity
    //We always store all items in state.options
    //state.renderedOptions only changes
    function renderAll() {
      selectList.textContent = '';
      state.renderedOptions = [];
      state.options.forEach(function(item, index) {
        item.dataset.count = index;
        state.renderedOptions.push(item);
        selectList.appendChild(item);
        if (state.activeItem) {
          state.activOption = +state.activeItem.dataset.count;
        }
      });
    }
    //Function to wich handles clicks and enters on our select
    //Here we initiate renderAll if our state.renderedOptions sjoter
    //then state.options after search
    //And we use state.countClicks to learn if itn't first click
    //and we should test our lists
    function clickAndEnterHandler() {
      selectInput.focus();
      if (state.status === 'closed' && state.countClicks === 0) {
        state.countClicks = 1;
        if (state.options.length > state.renderedOptions.length) {
          renderAll();
        }
      }
      showCurrentSelectPlaceholder();
      state.countClicks = 0;
      toggleCustomSelect();
    }
    //Move focus and update state.activOption
    function focusItemAndUpdateActiveOption(activOption) {
      state.activOption = +activOption;
      state.renderedOptions[state.activOption].focus();
    }
    //Selects next option using keyboard
    //We use state.activOption for this porpuses
    function selectNext() {
      if (state.activOption !== 'default') {
        if (state.activOption === state.renderedOptions.length - 1) {
          focusItemAndUpdateActiveOption(0);
        } else state.activOption += 1;
        state.renderedOptions[state.activOption].focus();
      } else {
        focusItemAndUpdateActiveOption(0);
      }
    }
    //Selects previous option using keyboard
    //We use state.activOption for this porpuses
    function selectPrevious() {
      if (state.activOption !== 'default') {
        if (state.activOption === 0) {
          focusItemAndUpdateActiveOption(state.renderedOptions.length - 1);
        } else state.activOption -= 1;
        state.renderedOptions[state.activOption].focus();
      } else {
        focusItemAndUpdateActiveOption(0);
      }
    }
    //Keyboard handler
    function keyActions(e) {
      var key = e.keyCode;
      switch (key) {
        //Escape
        case 27:
          if (state.status === 'expanded') {
            selectInput.focus();
            toggleCustomSelect();
          }
          break;
        //Tab
        case 9:
          closeAndRemoveKeyListener(e);
          break;
        //Enter
        case 13:
          e.preventDefault();
          if (
            state.status !== 'closed' &&
            document.activeElement.tagName === 'LI'
          ) {
            clickAndEnterChooseHandler(document.activeElement);
          }
          clickAndEnterHandler();
          break;
        //KeyDown
        case 40:
          if (state.status === 'expanded') {
            selectNext();
            break;
          }
          toggleCustomSelect();
          selectNext();
          break;
        //KeyRight
        case 39:
          if (state.status === 'expanded') {
            selectNext();
            break;
          }
          toggleCustomSelect();
          selectNext();
          break;
        //KeyUp
        case 38:
          if (state.status === 'expanded') {
            selectPrevious();
            break;
          }
          toggleCustomSelect();
          selectPrevious();
          break;
        //KeyLeft
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
    //We remove focus and key listeners if user
    //clicks out of customSelect or press "Tab" key
    function closeAndRemoveKeyListener(e) {
      var target = e.target;
      if (target !== customSelect && !customSelect.contains(target)) {
        if (state.status === 'expanded') {
          toggleCustomSelect();
        }
        document.removeEventListener('keydown', keyActions);
      }
      showCurrentSelectPlaceholder();
    }
    //All Click Focus and input Listeners
    customSelect.addEventListener('focusin', function(e) {
      document.addEventListener('keydown', keyActions);
    });

    selectList.addEventListener('click', function(e) {
      var currentOption = e.target;
      if (
        currentOption.tagName === 'LI' &&
        currentOption.dataset.disabled !== 'true'
      ) {
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
    selectInput.addEventListener('input', function() {
      //Prepare for searching if start input
      //Reset state.inputValue and state.renderedOptions
      state.inputValue = selectInput.value;
      state.renderedOptions = [];
      if (state.inputValue) {
        //use forEach insted of filter for IE11 support
        state.options.forEach(function(item) {
          //Push new list of options which contain our substring
          //To state.renderedOptions
          if (
            item.textContent
              .toLowerCase()
              .indexOf(state.inputValue.toLowerCase()) !== -1
          ) {
            state.renderedOptions.push(item);
          } else {
            return;
          }
        });
      }
      //Add all options if state.renderedOptions length > 0
      if (state.renderedOptions.length > 0) {
        selectList.textContent = '';
        state.renderedOptions.forEach(function(item, index) {
          item.dataset.count = index;
          selectList.appendChild(item);
        });
        state.activOption = 'default';
      }
      //Show "Not found" item if state.renderedOptions.length === 0
      if (state.renderedOptions.length === 0) {
        selectList.textContent = '';
        selectList.appendChild(state.notFound);
        state.activOption = 'default';
      }
      //RenderAll if our input is empty
      if (selectInput.value === '') {
        renderAll();
        state.activOption = 'default';
      }
    });

    // create an observer instance for original select disabled attribute
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        selectInput.disabled = select.disabled === true ? true : false;
      });
    });

    // observer config: only attributes change
    var config = { attributes: true, childList: false, characterData: false };

    // observer listener foe our original select
    observer.observe(select, config);
  });
};
