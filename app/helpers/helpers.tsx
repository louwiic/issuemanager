import React, {ReactComponentElement, ReactElement} from 'react';
import {View} from 'react-native';
import colorTheme from '../config/theme';

/**
 * Return color status
 * NEW - INPROGRESS - DONE
 * @param status
 * @returns
 */

export const statusColor = (status: string): ReactElement => {
  switch (status) {
    case 'new':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.new,
            borderRadius: 10,
          }}
        />
      );

    case 'inprogress':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.inprogress,
            borderRadius: 10,
          }}
        />
      );

    case 'done':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.done,
            borderRadius: 10,
          }}
        />
      );

    default:
      <View style={{}}>{/* Element */}</View>;
      break;
  }
};

export const typeColor = (status: string): ReactElement => {
  switch (status) {
    case 'Maintenance':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.maintenance,
            borderRadius: 10,
          }}
        />
      );

    default:
      <View style={{}}>{/* Element */}</View>;
      break;
  }
};

export const priorityType = (status: string): ReactElement => {
  switch (status) {
    case 'emergency':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.emergency,
            borderRadius: 10,
          }}
        />
      );

    case 'normal':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.normal,
            borderRadius: 10,
          }}
        />
      );

    case 'higth':
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: colorTheme.higth,
            borderRadius: 10,
          }}
        />
      );
      s;

    default:
      <View style={{}}>{/* Element */}</View>;
      break;
  }
};
