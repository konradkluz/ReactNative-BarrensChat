import React, {Component} from 'react';
import {Text, View, Platform, Picker, Keyboard} from 'react-native';
import {Button, Item, Input} from 'native-base';
import {Field, reduxForm} from 'redux-form';
import ROOM_TYPE, {getRoomTranslation} from '../../actions/initizalizer/ROOM_TYPE';
import I18n from '../../utils/Dictionary';
import Collapsible from 'react-native-collapsible';
import * as ACTIONS from '../../actions/ACTIONS';
import {validateCreateRoomForm} from './validateCreateRoomForm';


class CreateRoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        }
    }


    static propTypes = {
        createRoom: React.PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.createRoomCollapsed && nextProps.createRoomCollapsed) {
            this.props.reset();
            Keyboard.dismiss();
        }

    }


    renderInput = ({input: {onChange, value}, meta: {touched, error}}) => {
        return (

            <Item underline>
                <Input placeholder={I18n.t('enter_chat_title')}
                       style={{fontSize: 20}} onChangeText={onChange} value={value}/>
                {touched && (error && <Text style={{color: 'orangered'}}>{error}</Text>)}
            </Item>
        )
    };

    renderPicker = (ios) => ({input: {onChange, value}}) => {
        return (

            <Picker
                onValueChange={(value) => {
                    onChange(value);
                    if (ios) {
                        this.setState({collapsed: true})
                    }
                }}
                selectedValue={value}>
                <Picker.Item label={I18n.t(ROOM_TYPE.VERYSMALL.roomType)} value={ROOM_TYPE.VERYSMALL.roomType}/>
                <Picker.Item label={I18n.t(ROOM_TYPE.SMALL.roomType)} value={ROOM_TYPE.SMALL.roomType}/>
                <Picker.Item label={I18n.t(ROOM_TYPE.MEDIUM.roomType)} value={ROOM_TYPE.MEDIUM.roomType}/>
                <Picker.Item label={I18n.t(ROOM_TYPE.LARGE.roomType)} value={ROOM_TYPE.LARGE.roomType}/>
                <Picker.Item label={I18n.t(ROOM_TYPE.VERYLARGE.roomType)} value={ROOM_TYPE.VERYLARGE.roomType}/>
            </Picker>
        );
    };


    submit = (values) => {
        const executeAfterSussccesfulSubmision = () => {
            console.log('submitting form', values);
            const roomPrivacy = 'public';
            this.props.createRoom({...values}, roomPrivacy);
            this.props.dispatch({type: ACTIONS.TOOGLE_ROOM_CREATION, collapsed: true})
        };
        return validateCreateRoomForm(values, executeAfterSussccesfulSubmision);


    };

    renderDependingOnPlatform = () => {
        const {handleSubmit} = this.props;
        if (Platform.OS === 'ios') {
            return (
                <View>
                    <View style={styles.view}>

                        <Field name="title" component={this.renderInput} validate={required}/>
                        <Button block transparent onPress={() => {
                            this.setState({collapsed: !this.state.collapsed})
                        }}>
                            <Text>{getRoomTranslation(this.props.selectedRoomType)}</Text>
                        </Button>
                        <Collapsible collapsed={this.state.collapsed} duration={600}>
                            <Field name="roomType" component={this.renderPicker(true)}/>
                        </Collapsible>
                        <Button block info onPress={handleSubmit(this.submit)}>
                            <Text>{I18n.t('create')}</Text>
                        </Button>
                    </View>

                </View>

            );
        } else {
            return (
                <View style={styles.view}>
                    <Field name="title" component={this.renderInput} validate={required}/>
                    <Field name="roomType" component={this.renderPicker(false)}/>
                    <Button block info onPress={handleSubmit(this.submit)}>
                        <Text>{I18n.t('create')}</Text>
                    </Button>
                </View>
            );
        }
    };


    render() {



        return (
            <View style={{zIndex: 100}}>
                <Collapsible collapsed={this.props.createRoomCollapsed} duration={600}>
                    {this.renderDependingOnPlatform()}
                </Collapsible>
            </View>)
    }
}


const required = value => value ? undefined : I18n.t('required_field_error');

const styles = {
    view: {
        backgroundColor: 'rgb(206,225,248)',
        opacity: 0.8
    }
};

export default reduxForm({
    form: 'createPublicRoom'
})(CreateRoomForm)