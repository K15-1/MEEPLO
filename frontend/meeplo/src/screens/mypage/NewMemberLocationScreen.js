import { ScrollView, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot';
import Toast from 'react-native-toast-message';
import MyPageLocationSearch from '../../components/mypage/MyPageLocationSearch';
import { theme } from '../../assets/constant/DesignTheme';
import { createStartLocation, getUserInfo } from '../../redux/userSlice';
import LoadingModal from '../../components/common/LoadingModal';
import { TOAST_MESSAGE } from '../../assets/constant/string';
import { useEffect } from 'react';

const NewMemberLocationScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    address: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [inputBorderColor, setInputBorderColor] = useState(theme.color.disabled);
  const isEditLoading = useSelector(state => state.user.isEditLoading);
  const user = useSelector(state => state.user.info);

  const validateInput = () => {
    if (!form.name || form.name.length === 0) {
      Toast.show({
        type: 'error',
        text1: TOAST_MESSAGE.REQUIRED_FIELD_ERROR,
        text2: TOAST_MESSAGE.START_LOCATION_NO_NAME,
      });
      return false;
    } else if (!form.address || form.address.length === 0) {
      Toast.show({
        type: 'error',
        text1: TOAST_MESSAGE.REQUIRED_FIELD_ERROR,
        text2: TOAST_MESSAGE.START_LOCATION_NO_ADDRESS,
      });
      return false;
    } else if (form.name.length > 10) {
      Toast.show({
        type: 'error',
        text1: TOAST_MESSAGE.INPUT_ERROR,
        text2: TOAST_MESSAGE.START_LOCATION_NAME_LENGTH_EXCESS,
      });
      return false;
    }
    return true;
  };

  const handleOnChange = (text, field) => {
    setForm(prevState => ({ ...prevState, [field]: text }));
  };

  const inputOnBlur = () => {
    setInputBorderColor(theme.color.disabled);
  };

  const inputOnFocus = () => {
    setInputBorderColor(theme.color.bright.red);
  };

  const onPressSearch = () => {
    setIsVisible(true);
  };

  const onPressAdd = () => {
    if (validateInput()) {
      dispatch(createStartLocation({ form })).then(() => {
        dispatch(getUserInfo()).then(() => {
          Toast.show({
            type: 'welcomeToast',
            text1: 'MEEPLO에 오신 것을 환영합니다:)',
            text2: '모든 설정이 완료되었습니다.',
          });
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      });
    }
  };

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  return (
    <>
      <ScrollView style={{ flex: 1, marginHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black', marginVertical: 30 }}>출발지 추가</Text>

        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <Text style={{ color: 'gray', fontSize: 20, fontWeight: 'bold' }}>{user?.nickname}님 안녕하세요!</Text>
          <Text style={{ color: 'gray', marginTop: 20 }}>
            MEEPLO 앱 사용을 위해 기본 출발지 한 곳을 필수로 등록해주세요.
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ height: 36, justifyContent: 'center', marginRight: 10 }}>
            <FontAwesomeIcon icon={faPen} color={'gray'} size={17} />
          </View>
          <TextInput
            onBlur={inputOnBlur}
            onFocus={inputOnFocus}
            placeholder="출발지 이름"
            onChangeText={text => {
              handleOnChange(text, 'name');
            }}
            placeholderTextColor={theme.color.disabled}
            style={{
              width: '100%',
              height: 36,
              borderBottomColor: inputBorderColor,
              borderBottomWidth: 1,
              fontSize: 20,
              marginVertical: 15,
              padding: 0,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ height: 36, justifyContent: 'center', marginRight: 10 }}>
            <FontAwesomeIcon icon={faLocationDot} color={'gray'} size={17} />
          </View>
          <TouchableOpacity
            onPress={onPressSearch}
            style={{
              width: '100%',
              height: 36,
              borderBottomColor: theme.color.disabled,
              borderBottomWidth: 1,
              fontSize: 20,
              marginVertical: 15,
              padding: 0,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: form?.address ? 'black' : theme.color.disabled,
              }}>
              {form?.address ? form.address : '건물, 지번 또는 도로명 검색'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 30 }}>
          <TouchableOpacity
            onPress={onPressAdd}
            activeOpacity={0.6}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 35,
              width: 200,
              borderColor: theme.color.border,
              borderWidth: 2,
              borderRadius: 10,
              backgroundColor: theme.color.pale.green,
              marginHorizontal: 5,
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>추가하기</Text>
          </TouchableOpacity>
        </View>
        <MyPageLocationSearch isVisible={isVisible} setIsVisible={setIsVisible} handleOnChange={handleOnChange} />
      </ScrollView>
      <LoadingModal visible={isEditLoading} />
    </>
  );
};
export default NewMemberLocationScreen;
