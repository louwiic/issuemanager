import React, {forwardRef, useState} from 'react';
import {View} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

interface MyBottomSheetProps {
  snapPoints: number[];
  initialSnap: number;
  children: React.Node;
  onChange: (index: number) => {};
}

const MyBottomSheet: React.FC<MyBottomSheetProps> = forwardRef((props, ref) => {
  const {snapPoints, initialSnap, children, onChange} = props;

  return (
    <BottomSheet
      onChange={onChange}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      ref={ref}>
      {children}
    </BottomSheet>
  );
});

export default MyBottomSheet;
