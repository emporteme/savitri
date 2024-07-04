import React from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
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
    const screenWidth = layout.width;
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
                style={{flexGrow:3.1}}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        renderLabel={({ focused, route }) => (
                            <View style={[focused ? styles.focusedTab : styles.defaultTab, { width: (screenWidth / routes.length) -15}]}>
                                <View style={focused ? styles.focusedTab : styles.defaultTab}>
                                    <Text
                                        style={{
                                            color: focused ? '#A84DFF' : '#C0C0C0',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {route.title}
                                    </Text>
                                </View>
                            </View>
                        )}
                        indicatorStyle={styles.indicatorStyle}
                        style={styles.tabbar}
                    />
                )}
            />
        </>
    );
};

export default TabViews;

const styles = StyleSheet.create({
    focusedTab: {
        backgroundColor: '#F1E4FF',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems:"center",

    },
    defaultTab: {
        width:"100%",
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems:"center",
        borderRadius: 8,
    },
    indicatorStyle: {
        backgroundColor: 'transparent',
    },
    tabbar: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
});

