import React from 'react'
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Assets from './Assets';
import Tokens from './Tokens';

const FirstRoute = () => (
  <Tokens />
);

const SecondRoute = () => (
  <Assets />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const TabViews: React.FC = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Tokens' },
    { key: 'second', title: 'Assets & NFTs' },
  ]);
  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => <TabBar
          {...props}
          renderLabel={({ focused, route }) => {
            return (
              <Text
                style={{
                  // fontSize: 16,
                  color: focused ? '#6B96FE' : '#33333340',
                  fontWeight: '600',
                }}
              >
                {route.title}
              </Text >
            );
          }}
          indicatorStyle={styles.indicatorStyle}
          style={styles.tabbar}
        />}
      />
    </>
  )
}

export default TabViews

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: '#6B96FE',
    padding: 1.5,
    marginBottom: -1.5,
  },
  tabbar: {
    backgroundColor: 'transparent',
  }
})