import React from 'react';
import { View, ScrollView } from 'react-native';
import Selection from './Selection';

const Stage2 = ({ options, canSelect, selectionLimit, setSelectionCount, onSelection, stageSelections, currentStage, selectionCount }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', height: '75%' }}>
      {stageSelections && stageSelections[currentStage-1] && stageSelections[currentStage-1].map((opt, i) => (
          <Selection
            key={i}
            option={opt}
            canSelect={canSelect}
            selectionLimit={selectionLimit}
            setSelectionCount={setSelectionCount}
            onSelection={onSelection}
            selected={stageSelections[currentStage].includes(opt)}
            selectionCount={selectionCount}
            currentStage={currentStage}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Stage2;