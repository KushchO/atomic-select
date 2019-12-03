function createlabel(option) {
  var selectLabel = document.createElement('label');
  selectLabel.classList.add('custom-select__label');
  selectLabel.value = option.text;
  return selectLabel;
}
