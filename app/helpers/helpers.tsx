import React, {ReactComponentElement, ReactElement} from 'react';
import {View} from 'react-native';
import colorTheme from '../config/theme';

/**
 * Return color status
 * NEW - INPROGRESS - DONE
 * @param status
 * @returns
 */
const style = {
  height: 20,
  width: 20,
  borderRadius: 10,
};

export const statusColor = (status: string): ReactElement => {
  switch (status) {
    case 'new':
      return <View style={{...style, backgroundColor: colorTheme.new}} />;
    case 'inprogress':
      return (
        <View style={{...style, backgroundColor: colorTheme.inprogress}} />
      );
    case 'done':
      return <View style={{...style, backgroundColor: colorTheme.done}} />;
    default:
      <View style={{}}>{/* Element */}</View>;
      break;
  }
};

export const typeColor = (status: string): ReactElement => {
  switch (status) {
    case 'Maintenance':
      return (
        <View style={{...style, backgroundColor: colorTheme.maintenance}} />
      );

    default:
      <View style={{}}>{/* Element */}</View>;
      break;
  }
};

export const priorityType = (status: string): ReactElement => {
  switch (status) {
    case 'emergency':
      return <View style={{...style, backgroundColor: colorTheme.emergency}} />;

    case 'normal':
      return <View style={{...style, backgroundColor: colorTheme.normal}} />;

    case 'higth':
      return <View style={{...style, backgroundColor: colorTheme.higth}} />;

    default:
      <View style={{}}>{/* Element */}</View>;
      break;
  }
};

export const statusTypeLabel = (status: string): String => {
  switch (status) {
    case 'new':
      return 'Nouveau';
    case 'inprogress':
      return 'En cours';
    case 'done':
      return 'Terminé';
  }
};
