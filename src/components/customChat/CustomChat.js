import React, {Component} from 'react';
import {View} from 'react-native';
import {GiftedChat, Composer, LoadEarlier} from 'react-native-gifted-chat';
import {Spinner} from 'native-base';
import CustomBubble from './CustomBubble';
import CustomDay from './CustomDay';
import CustomTime from './CustomTime';
import CustomCameraActions from './CustomCameraActions';
import I18n from '../../utils/Dictionary';

export default class CustomChat extends Component {

    renderBubble(props) {

        const {friendProps} = this.props.chatProps;

        const bubbleProps = Object.assign({}, props, {friendProps, wrapperStyle: {
            left: {
                backgroundColor: '#fff',
            },
            right: {
                backgroundColor: '#a5b0b4'
            }
        }});

        return <CustomBubble {...bubbleProps}/>
    }

    renderActions(props) {
        return <CustomCameraActions {...props}/>
    }

    renderLoadEarlier(props) {
        return <LoadEarlier {...props} label={I18n.t('load_earlier')}/>
    }

    renderDay(props) {
        return <CustomDay {...props} locale={I18n.locale.substr(0, 2)}/>;
    }

    renderTime(props) {
        return <CustomTime {...props} locale={I18n.locale.substr(0, 2)}/>;
    }

    renderComposer(props) {
        return (
            <Composer
                {...props} placeholder={I18n.t('type_message')}
            />
        )
    }

    renderLoading = () => {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Spinner color={'#3a7094'}/>
            </View>
        );
    };

    onLoadEarlier() {
        this.props.chatProps.onLoadEarlier();
    };

    render() {
        const {user, room, onSend, onLongPress} = this.props.chatProps;
        return (
            <GiftedChat style={{paddingTop: 50}}
                        messages={room.msgs}
                        onSend={onSend}
                        loadEarlier={room.loadEarlier}
                        isLoadingEarlier={room.isLoadingEarlierMsgs}
                        renderLoading={this.renderLoading}
                        onLoadEarlier={this.onLoadEarlier.bind(this)}
                        user={{
                            _id: user.uid,
                            name: user.displayName,
                            avatar: user.photoURL
                        }}
                        renderBubble={this.renderBubble.bind(this)}
                        onLongPress={onLongPress}
                        renderActions={this.renderActions}
                        renderComposer={this.renderComposer}
                        renderLoadEarlier={this.renderLoadEarlier}
                        renderDay={this.renderDay}
                        renderTime={this.renderTime}
            />);
    };
}
