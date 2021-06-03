import React from 'react';
import {View, Text} from 'react-native';
import CheckBox from 'react-native-check-box';

export const CheckBoxGroup = props => {
  const checkboxes = props.checkboxes;
  const setCheckboxes = props.setCheckboxes;

  const toggleCheckbox = (id, index) => {
    const checkBoxesData = checkboxes.map(checkbox => {
      checkbox.checked = false;
      return checkbox;
    });
    checkBoxesData[index].checked = true;
    setCheckboxes(checkBoxesData);
  };

  return (
    <View>
      {checkboxes.map((cb, index) => (
        <View key={cb.id}>
          <CheckBox
            isChecked={cb.checked}
            onClick={() => toggleCheckbox(cb.id, index)}
          />
          <Text>{cb.title}</Text>
        </View>
      ))}
    </View>
  );
};
