import React, {Component} from 'react';
import {StyleSheet, ScrollView, LayoutAnimation} from 'react-native';
import {
  Assets,
  Colors,
  Typography,
  View,
  Drawer,
  Text,
  Button,
  Avatar,
  Badge
} from 'react-native-ui-lib'; //eslint-disable-line
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import conversations from '../../data/conversations';

import {
  renderBooleanOption,
  renderSliderOption,
  renderColorOption
} from '../ExampleScreenPresenter';

const ITEMS = {
  read: {
    icon: require('../../assets/icons/mail.png'),
    text: 'Read',
    background: Colors.green30
  },
  archive: {
    icon: require('../../assets/icons/archive.png'),
    text: 'Archive',
    background: Colors.blue30
  },
  delete: {
    icon: require('../../assets/icons/delete.png'),
    text: 'Delete',
    background: Colors.red30
  }
};

class DrawerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideItem: false,
      showRightItems: true,
      fullSwipeRight: true,
      showLeftItem: true,
      fullSwipeLeft: true,
      unread: true
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hideItem && prevState.hideItem) {
      this.showItem();
    }
  }

  deleteItem = () => {
    // TODO: consider including this functionality as part of the drawer component
    setTimeout(() => {
      LayoutAnimation.configureNext({
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleY
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleY,
          duration: 2000
        },
        duration: 120
      });
      this.setState({hideItem: true});
    }, 200);
  };

  toggleReadState = () => {
    this.setState({unread: !this.state.unread}); // setState will close the Drawer
  }

  triggerLeftToggleHaptic = () => {
    // console.warn('haptic trigger here');
  }

  showItem = () => {
    this.setState({hideItem: false});
  };

  openLeftDrawer = () => {
    if (this.ref) {
      this.ref.openLeft();
    }
  };
  openLeftDrawerFull = () => {
    if (this.ref) {
      this.ref.openLeftFull();
    }
  };
  toggleLeftDrawer = () => {
    if (this.ref) {
      this.ref.toggleLeft();
    }
  };
  openRightDrawer = () => {
    if (this.ref) {
      this.ref.openRight();
    }
  };
  openRightDrawerFull = () => {
    if (this.ref) {
      this.ref.openRightFull();
    }
  };
  closeDrawer = () => {
    if (this.ref) {
      this.ref.closeDrawer();
    }
  };

  renderActions() {
    return (
      <View center marginB-s4>
        <Text text70>Actions</Text>
        <View row>
          <View>
            <Button
              onPress={this.openLeftDrawer}
              label="Open left"
              style={{margin: 3}}
              size={'xSmall'}
            />
            <Button
              onPress={this.openLeftDrawerFull}
              label="Full left swipe"
              style={{margin: 3}}
              size={'xSmall'}
            />
            <Button
              onPress={this.toggleLeftDrawer}
              label="Left toggle"
              style={{margin: 3}}
              size={'xSmall'}
            />
          </View>

          <View marginH-20>
            <Button
              onPress={this.closeDrawer}
              label="Close"
              style={{margin: 3}}
              size={'xSmall'}
            />
          </View>

          <View>
            <Button
              onPress={this.openRightDrawer}
              label="Open right"
              style={{margin: 3}}
              size={'xSmall'}
            />
            <Button
              onPress={this.openRightDrawerFull}
              label="Full right swipe"
              style={{margin: 3}}
              size={'xSmall'}
            />
          </View>
        </View>
      </View>
    );
  }

  renderListItem() {
    return (
      <View
        bg-grey80
        paddingH-20
        paddingV-10
        row
        centerV
        style={{borderBottomWidth: 1, borderColor: Colors.grey60}}
      >
        {this.state.unread && <Badge size={'pimpleBig'} backgroundColor={Colors.purple30} containerStyle={{marginRight: 8}}/>}
        <Avatar source={{uri: conversations[0].thumbnail}}/>
        <View marginL-20>
          <Text text70R={!this.state.unread} text70BO={this.state.unread}>{conversations[0].name}</Text>
          <Text text80 marginT-2>
            {conversations[0].text}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      showRightItems,
      fullSwipeRight,
      showLeftItem,
      fullSwipeLeft,
      itemsTintColor,
      bounciness,
      itemsIconSize,
      hideItem
    } = this.state;

    const drawerProps = {
      itemsTintColor,
      itemsIconSize,
      bounciness,
      ref: (component) => (this.ref = component),
      fullSwipeRight,
      onFullSwipeRight: this.deleteItem,
      fullSwipeLeft,
      onWillFullSwipeLeft: this.deleteItem,
      onToggleSwipeLeft: this.toggleReadState,
      leftToggleHapticTrigger: this.triggerLeftToggleHaptic
    };
    if (showRightItems) {
      drawerProps.rightItems = [{...ITEMS.delete, onPress: this.deleteItem}, ITEMS.archive];
    }

    if (showLeftItem) {
      drawerProps.leftItem = {
        icon: require('../../assets/icons/mail.png'),
        text: this.state.unread ? 'Read' : 'Unread', 
        background: this.state.unread ? Colors.green30 : Colors.purple30,
        onPress: this.toggleReadState
      };
    }

    return (
      <View flex>
        <View row padding-20 paddingB-0 marginB-20 centerV>
          <Text text40>Drawer</Text>
          <Button
            link
            grey10
            marginL-s1
            marginT-2
            iconSource={Assets.icons.demo.refresh}
            onPress={this.showItem}
            disabled={!hideItem}
          />
        </View>
        {!hideItem && (
          <>
            <Drawer key={Date.now()} {...drawerProps}>
              {this.renderListItem()}
            </Drawer>
          </>
        )}

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View padding-20>
            {this.renderActions()}
            {renderBooleanOption.call(this, 'rightItems', 'showRightItems')}
            {showRightItems &&
              renderBooleanOption.call(
                this,
                'fullSwipeRight',
                'fullSwipeRight'
              )}
            {renderBooleanOption.call(this, 'leftItem', 'showLeftItem')}
            {showLeftItem &&
              renderBooleanOption.call(this, 'fullSwipeLeft', 'fullSwipeLeft')}
            {renderColorOption.call(this, 'icon+text color', 'itemsTintColor')}
            {renderSliderOption.call(this, 'bounciness', 'bounciness', {
              min: 5,
              max: 15,
              step: 1,
              initial: 5
            })}
            {renderSliderOption.call(this, 'iconSize', 'itemsIconSize', {
              min: 15,
              max: 25,
              step: 1,
              initial: 20
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white
  },
  contentContainer: {
    paddingBottom: 50
  },
  drawer: {
    marginTop: 20
  },
  listContent: {
    backgroundColor: Colors.dark80
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark80
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.violet40,
    margin: 20
  },
  rowTitle: {
    ...Typography.text70,
    fontWeight: 'bold',
    color: Colors.dark20
  },
  rowSubtitle: {
    ...Typography.text80,
    color: Colors.dark30
  },
  rowButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    padding: 10
  }
});

export default gestureHandlerRootHOC(DrawerScreen);
