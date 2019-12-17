/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/customSelectWeb.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/customSelectWeb.js":
/*!********************************!*\
  !*** ./src/customSelectWeb.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//Use atomicSelect('Your class for custom selects') to activate library\nvar atomicSelect = function (className) {\n  //NodeList forEach suppor for IE11\n  if (window.NodeList && !NodeList.prototype.forEach) {\n    NodeList.prototype.forEach = function (callback, thisArg) {\n      thisArg = thisArg || window;\n\n      for (var i = 0; i < this.length; i++) {\n        callback.call(thisArg, this[i], i, this);\n      }\n    };\n  } //Collect all selects to NodeList customSelects\n\n\n  var customSelects = document.querySelectorAll(className);\n\n  if (customSelects.length === 0) {\n    return;\n  } //Function for hiding original selects, replaced by custom one.\n\n\n  function hideOriginalSelect(select) {\n    select.classList.add('custom-select__hidden');\n  } //Function for creating input in custom select and returns it\n  //Takes selected option as argument to create start placeholder\n\n\n  function createInput(option) {\n    var selectInput = document.createElement('input');\n    selectInput.tabIndex = -1;\n    selectInput.classList.add('custom-select__input');\n    selectInput.placeholder = option.text;\n    selectInput.setAttribute('aria-label', option.text);\n    return selectInput;\n  } //Function which creates list for options and returns it\n  //It takes original select as argument\n  //We also initiate creating and appending input and options here\n\n\n  function createSelectList(select, customSelect) {\n    var selectList = document.createElement('ul');\n    var selectOptions = select.querySelectorAll('option');\n    selectList.classList.add('custom-select__list');\n    selectList.classList.add('custom-select__hidden');\n    selectOptions.forEach(function (option, index) {\n      if (option.selected === true) {\n        customSelect.appendChild(createInput(option));\n      }\n\n      selectList.appendChild(creatSelectOption(option, index));\n    });\n    return selectList;\n  } //Function which creates each options from original one and returns it\n  //Takes original option and its index as arguments\n\n\n  function creatSelectOption(optionItem, index) {\n    var selectOption = document.createElement('li');\n    selectOption.classList.add('custom-select__option');\n\n    if (optionItem.disabled === true) {\n      selectOption.classList.add('custom-select__option--disabled');\n    }\n\n    selectOption.dataset.value = optionItem.value;\n    selectOption.dataset.selected = optionItem.selected;\n    selectOption.dataset.disabled = optionItem.disabled;\n    selectOption.dataset.count = index;\n    selectOption.setAttribute('tabindex', '-1');\n    selectOption.textContent = optionItem.text;\n    return selectOption;\n  } //Function creates custom select wrapper and returns it\n  //initiates creating select list of options\n\n\n  function createcustomSelect(select) {\n    var selectСlassList = select.classList;\n    var customSelect = document.createElement('div');\n    customSelect.classList.add('custom-select__wrapper');\n    customSelect.setAttribute('tabindex', '-1');\n\n    for (var i = 0; i < selectСlassList.length; i++) {\n      customSelect.classList.add(selectСlassList[i]);\n    }\n\n    customSelect.appendChild(createSelectList(select, customSelect));\n    return customSelect;\n  } //In this cycle we go through each select and add listeners to its components\n\n\n  customSelects.forEach(function (select, index) {\n    //Create \"not found\" li for search functionality\n    var notFound = document.createElement('li');\n    notFound.classList.add('custom-select__option');\n    notFound.classList.add('custom-select__option--not-found');\n    notFound.textContent = 'Ничего не найдено'; //state object\n\n    var state = {\n      status: 'closed',\n      activOption: 'default',\n      activeItem: '',\n      countClicks: 0,\n      inputValue: '',\n      options: [],\n      renderedOptions: [],\n      notFound: notFound\n    }; //Assigne all elements for each instanse of custom select instances\n\n    var customSelect = createcustomSelect(select);\n    select.parentElement.insertBefore(customSelect, select);\n    hideOriginalSelect(select);\n    customSelect.setAttribute('tabindex', '0');\n    var selectList = customSelect.querySelector('.custom-select__list');\n    var selectInput = customSelect.querySelector('.custom-select__input');\n    console.log(selectInput);\n    var selectOptions = customSelect.querySelectorAll('.custom-select__option');\n    customSelect.appendChild(selectInput);\n\n    if (select.disabled) {\n      selectInput.disabled = true;\n    }\n\n    selectOptions.forEach(function (item) {\n      state.options.push(item);\n      state.renderedOptions.push(item);\n    }); //Here is all functionallity for choose option\n\n    function clickAndEnterChooseHandler(option) {\n      //we do anything only if option isn't disabled\n      if (option.dataset.disabled !== 'true') {\n        //If it is not first click or enter we remove active satuts\n        //from previous item\n        if (state.activOption !== 'default' && option.textContent !== select.value && state.activeItem) {\n          state.activeItem.classList.remove('custom-select__option--active');\n          state.activeItem.dataset.selected = 'false';\n        } //Here we set active status to choosen item\n        //And send new value to our original select\n\n\n        selectInput.value = '';\n        selectInput.placeholder = option.textContent;\n        option.classList.add('custom-select__option--active');\n        option.dataset.selected = true;\n        state.activeItem = option;\n        select.value = option.dataset.value;\n        state.activOption = +option.dataset.count;\n      }\n    } //Just toggle our list\n\n\n    function toggleCustomSelect() {\n      selectList.classList.toggle('custom-select__hidden');\n      state.status = state.status === 'closed' ? 'expanded' : 'closed';\n\n      if (state.status === 'closed') {\n        customSelect.focus();\n        selectInput.style.zIndex = 0;\n      } else {\n        selectInput.style.zIndex = 10;\n      }\n    } //Show our cussrent select value\n\n\n    function showCurrentSelectPlaceholder() {\n      if (selectInput.placeholder !== select.value) {\n        selectInput.placeholder = select.value;\n      }\n    } //Render all items of our select\n    //We need this function after using our search functionallity\n    //We always store all items in state.options\n    //state.renderedOptions only changes\n\n\n    function renderAll() {\n      selectList.textContent = '';\n      state.renderedOptions = [];\n      state.options.forEach(function (item, index) {\n        item.dataset.count = index;\n        state.renderedOptions.push(item);\n        selectList.appendChild(item);\n\n        if (state.activeItem) {\n          state.activOption = +state.activeItem.dataset.count;\n        }\n      });\n    } //Function to wich handles clicks and enters on our select\n    //Here we initiate renderAll if our state.renderedOptions sjoter\n    //then state.options after search\n    //And we use state.countClicks to learn if itn't first click\n    //and we should test our lists\n\n\n    function clickAndEnterHandler() {\n      selectInput.focus();\n\n      if (state.status === 'closed' && state.countClicks === 0) {\n        state.countClicks = 1;\n\n        if (state.options.length > state.renderedOptions.length) {\n          renderAll();\n        }\n      }\n\n      showCurrentSelectPlaceholder();\n      state.countClicks = 0;\n      toggleCustomSelect();\n    } //Move focus and update state.activOption\n\n\n    function focusItemAndUpdateActiveOption(activOption) {\n      state.activOption = +activOption;\n      state.renderedOptions[state.activOption].focus();\n    } //Selects next option using keyboard\n    //We use state.activOption for this porpuses\n\n\n    function selectNext() {\n      if (state.activOption !== 'default') {\n        if (state.activOption === state.renderedOptions.length - 1) {\n          focusItemAndUpdateActiveOption(0);\n        } else state.activOption += 1;\n\n        state.renderedOptions[state.activOption].focus();\n      } else {\n        focusItemAndUpdateActiveOption(0);\n      }\n    } //Selects previous option using keyboard\n    //We use state.activOption for this porpuses\n\n\n    function selectPrevious() {\n      if (state.activOption !== 'default') {\n        if (state.activOption === 0) {\n          focusItemAndUpdateActiveOption(state.renderedOptions.length - 1);\n        } else state.activOption -= 1;\n\n        state.renderedOptions[state.activOption].focus();\n      } else {\n        focusItemAndUpdateActiveOption(0);\n      }\n    } //Keyboard handler\n\n\n    function keyActions(e) {\n      var key = e.keyCode;\n\n      switch (key) {\n        //Escape\n        case 27:\n          if (state.status === 'expanded') {\n            selectInput.focus();\n            toggleCustomSelect();\n          }\n\n          break;\n        //Tab\n\n        case 9:\n          closeAndRemoveKeyListener(e);\n          break;\n        //Enter\n\n        case 13:\n          e.preventDefault();\n\n          if (state.status !== 'closed' && document.activeElement.tagName === 'LI') {\n            clickAndEnterChooseHandler(document.activeElement);\n          }\n\n          clickAndEnterHandler();\n          break;\n        //KeyDown\n\n        case 40:\n          if (state.status === 'expanded') {\n            selectNext();\n            break;\n          }\n\n          toggleCustomSelect();\n          selectNext();\n          break;\n        //KeyRight\n\n        case 39:\n          if (state.status === 'expanded') {\n            selectNext();\n            break;\n          }\n\n          toggleCustomSelect();\n          selectNext();\n          break;\n        //KeyUp\n\n        case 38:\n          if (state.status === 'expanded') {\n            selectPrevious();\n            break;\n          }\n\n          toggleCustomSelect();\n          selectPrevious();\n          break;\n        //KeyLeft\n\n        case 37:\n          if (state.status === 'expanded') {\n            selectPrevious();\n            break;\n          }\n\n          toggleCustomSelect();\n          selectPrevious();\n          break;\n      }\n    } //We remove focus and key listeners if user\n    //clicks out of customSelect or press \"Tab\" key\n\n\n    function closeAndRemoveKeyListener(e) {\n      var target = e.target;\n\n      if (target !== customSelect && !customSelect.contains(target)) {\n        if (state.status === 'expanded') {\n          toggleCustomSelect();\n        }\n\n        document.removeEventListener('keydown', keyActions);\n      }\n\n      showCurrentSelectPlaceholder();\n    } //All Click Focus and input Listeners\n\n\n    customSelect.addEventListener('focusin', function (e) {\n      document.addEventListener('keydown', keyActions);\n    });\n    selectList.addEventListener('click', function (e) {\n      var currentOption = e.target;\n\n      if (currentOption.tagName === 'LI' && currentOption.dataset.disabled !== 'true') {\n        clickAndEnterChooseHandler(currentOption);\n        toggleCustomSelect();\n      }\n    });\n    selectInput.addEventListener('click', function () {\n      clickAndEnterHandler();\n    });\n    document.addEventListener('click', function (e) {\n      closeAndRemoveKeyListener(e);\n    }); //Search functionality\n\n    selectInput.addEventListener('input', function () {\n      //Prepare for searching if start input\n      //Reset state.inputValue and state.renderedOptions\n      state.inputValue = selectInput.value;\n      state.renderedOptions = [];\n\n      if (state.inputValue) {\n        //use forEach insted of filter for IE11 support\n        state.options.forEach(function (item) {\n          //Push new list of options which contain our substring\n          //To state.renderedOptions\n          if (item.textContent.toLowerCase().indexOf(state.inputValue.toLowerCase()) !== -1) {\n            state.renderedOptions.push(item);\n          } else {\n            return;\n          }\n        });\n      } //Add all options if state.renderedOptions length > 0\n\n\n      if (state.renderedOptions.length > 0) {\n        selectList.textContent = '';\n        state.renderedOptions.forEach(function (item, index) {\n          item.dataset.count = index;\n          selectList.appendChild(item);\n        });\n        state.activOption = 'default';\n      } //Show \"Not found\" item if state.renderedOptions.length === 0\n\n\n      if (state.renderedOptions.length === 0) {\n        selectList.textContent = '';\n        selectList.appendChild(state.notFound);\n        state.activOption = 'default';\n      } //RenderAll if our input is empty\n\n\n      if (selectInput.value === '') {\n        renderAll();\n        state.activOption = 'default';\n      }\n    }); // create an observer instance for original select disabled attribute\n\n    var observer = new MutationObserver(function (mutations) {\n      mutations.forEach(function (mutation) {\n        selectInput.disabled = select.disabled === true ? true : false;\n      });\n    }); // observer config: only attributes change\n\n    var config = {\n      attributes: true,\n      childList: false,\n      characterData: false\n    }; // observer listener foe our original select\n\n    observer.observe(select, config);\n  });\n};\n\n//# sourceURL=webpack:///./src/customSelectWeb.js?");

/***/ })

/******/ });