import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import pallette from './pallette';

const Hexagon = ({state, currentStage}) => {

  const [color, setColor] = useState()

  const getStageColor = (stageNum) => {
    switch (stageNum) {
      case 0:
        return pallette.purple
      case 1:
        return pallette.yellow
      case 2:
        return pallette.green     
    }
  }

useEffect(() =>{
  setColor(getStageColor(currentStage))
}, [currentStage])

  return (
    <View style={styles.container}>
      <Svg
        width="30px"
        height="30px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <G clipPath="url(#clip0)" >
          <Path
            d="M6.327 2.774a.6.6 0 01.52-.3h10.307a.6.6 0 01.52.3l5.153 8.926a.6.6 0 010 .6l-5.154 8.926a.6.6 0 01-.52.3H6.847a.6.6 0 01-.52-.3L1.174 12.3a.6.6 0 010-.6l5.154-8.926z"
            fill={state ? color : 'white'}
            stroke="#000"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
        <Defs>
          <ClipPath id="clip0">
            <Path fill="#fff" d="M0 0H24V24H0z" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
};

export default Hexagon;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 25,
    marginHorizontal: 1,
  },
});
