import React, { FC, ReactElement } from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';


type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};
const HomeView: FC<ChildProps> = ({/* destructured props */}): ReactElement => {
 return (
 <view style={styles.container}>
 {/* Add you elements */}
 </View>
 );
};

HomeView.propTypes = {};
HomeView.defaultProps = {};
export default HomeView;





const styles = StyleSheet.create({
  container: {
        flex:1,
        backgroundColor:'#FFF'
       }
   })