import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Selection from './Selection';

const Stage = ({ currentStage, options, selectionCount, setSelectionCount, canSelect, setCanSelect, selectionLimit, onDeselection, onSelection }) => { 
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', height: '75%' }}>
        {options && options.map((opt, i) => {
          if (i < 20) {
            return (
              <Selection
                key={i}
                currentStage={currentStage}
                canSelect={canSelect}
                setCanSelect={setCanSelect}
                selectionLimit={selectionLimit}
                setSelectionCount={setSelectionCount}
                option={opt}
                index={i}
                selectionCount={selectionCount}
                onSelection={onSelection}
                onDeselection={onDeselection}
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
