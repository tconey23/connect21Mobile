import React from 'react';
import { View, ScrollView } from 'react-native';
import Selection from './Selection';

const Stage = ({
  setPrompts,
  currentStage,
  options,
  selectionCount,
  setSelectionCount,
  canSelect,
  setCanSelect,
  onDeselection,
  onSelection,
}) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          height: '75%',
        }}
      >
        {options &&
          options
            .sort((a, b) => {
              const stageA = a.stage ?? Infinity;
              const stageB = b.stage ?? Infinity;

              return stageA - stageB; 
            })
            .map((opt, i) => {
              if (i < 21) {
                return (
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
                );
              }
              return null;
            })}
      </View>
    </ScrollView>
  );
};

export default Stage;