import React from 'react';
import { View, ScrollView } from 'react-native';
import Selection from './Selection'; 

const Stage1 = ({ setPrompts, currentStage, options, selectionCount, setSelectionCount, canSelect, setCanSelect, onDeselection, onSelection }) => {
  console.log(options.filter((opt) => opt.stage == currentStage))
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', height: '75%' }}>
        {options
        .filter((opt) => opt.stage >0)
        .map((opt, i) => (
          <Selection
          key={i}
          currentStage={currentStage}
          canSelect={canSelect}
          setCanSelect={setCanSelect}
          setSelectionCount={setSelectionCount}
          option={opt}
          options={options}
          index={i}
          selectionCount={selectionCount}
          onSelection={onSelection}
          onDeselection={onDeselection}
          setPrompts={setPrompts}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Stage1;