atomicSelect('.customic-select');

var disabledSelect = document.querySelector('#custom-select2');
var toggleButton = document.querySelector('.toggle-disabled');

toggleButton.addEventListener('click', function() {
  disabledSelect.disabled = disabledSelect.disabled === true ? false : true;
  console.log(disabledSelect.disabled);
});
