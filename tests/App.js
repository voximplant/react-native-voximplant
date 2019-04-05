/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Voximplant} from 'react-native-voximplant';
import jet from 'jet/platform/react-native';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTest: null,
        };

        jet.exposeContextProperty('root', this);
        jet.exposeContextProperty('module', Voximplant);
    }

    render() {
        const { currentTest } = this.state;
        if (!currentTest) return null;

        const module = (() => {
            if (currentTest.parent && currentTest.parent.parent) {
                return currentTest.parent.parent.title;
            }
            return currentTest.parent.title;
        })();

        const group = (() => {
            if (currentTest.parent && currentTest.parent.parent) {
                return currentTest.parent.title;
            }
            return '';
        })();

        const retrying = (() => {
            const retry = currentTest.currentRetry();
            if (retry > 0) {
                return `⚠️ Test failed, retrying... (${retry})`;
            }
            return null;
        })();

        return (
            <View style={[styles.container, styles.horizontal]}>
                <Text style={[styles.item, styles.module]} testID="module">
                    {module}
                </Text>
                <Text style={styles.item} testID="group">
                    {group}
                </Text>
                <Text style={styles.item} testID="title">
                    {currentTest.title}
                </Text>
                {retrying && (
                    <Text style={[styles.retry, styles.item]} testID="title">
                        {retrying}
                    </Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    item: {
        marginBottom: 10,
        textAlign: 'center',
    },
    retry: {
        marginTop: 10,
        fontSize: 20,
        color: '#cccc33',
    },
    module: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    group: {
        fontSize: 16,
        color: 'grey',
    }
});
