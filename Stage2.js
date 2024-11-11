import React, {useState} from 'react';
import { View, ScrollView } from 'react-native';
import Selection from './Selection';

const Stage2 = ({ onDeselection, selectionLimit, setSelectionCount, onSelection, stageSelections, currentStage, selectionCount }) => {
  const [purple] = useState('#c956ff')

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', height: '75%' }}>
      {stageSelections && stageSelections[currentStage-1] && stageSelections[currentStage-1].map((opt, i) => (
          <Selection
            key={i}
            option={opt}
            canSelect={true}
            selectionLimit={selectionLimit}
            setSelectionCount={setSelectionCount}
            onSelection={onSelection}
            selected={stageSelections[currentStage].includes(opt)}
            selectionCount={selectionCount}
            currentStage={currentStage}
            onDeselection={onDeselection}
          />
        ))}
        {stageSelections && stageSelections[currentStage-2] && stageSelections[currentStage-2]
        .filter((opt) => !stageSelections[currentStage-1].includes(opt))
        .map((opt, i) => (
          <Selection
            key={i}
            option={opt}
            canSelect={false}
            selectionLimit={selectionLimit}
            setSelectionCount={setSelectionCount}
            onSelection={onSelection}
            selected={stageSelections[currentStage].includes(opt)}
            selectionCount={selectionCount}
            currentStage={currentStage}
            onDeselection={onDeselection}
            optColor={purple}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Stage2;