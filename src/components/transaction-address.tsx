import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useApp} from '../contexts/app';
import {useContacts} from '../contexts/contacts';
import {utils} from 'ethers';
import {
  Button,
  ButtonVariant,
  CloseCircle,
  IconButton,
  KeyboardSafeArea,
  QRScanner,
  Spacer,
  TextField,
} from './ui';
import {GRAPHIC_BASE_2, GRAPHIC_GREEN_1} from '../variables';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {AddressRow} from './address-row';
import {AddressHeader} from './address-header';
import {isHexString} from '../utils';
import {hideModal, showModal} from '../helpers/modal';
import {isIOS} from '../helpers';

export type TransactionAddressProps = {
  initial?: string;
  onAddress: (address: string) => void;
};

export const TransactionAddress = ({
  initial = '',
  onAddress,
}: TransactionAddressProps) => {
  const app = useApp();
  const contacts = useContacts();
  const [address, setAddress] = useState(initial);
  const [error, setError] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const contactsList = contacts.getContacts();
  const checked = useMemo(() => utils.isAddress(address.trim()), [address]);

  useEffect(() => {
    const toTrim = address.trim();

    if (toTrim.length >= 2 && !toTrim.startsWith('0x')) {
      return setError(true);
    }

    if (toTrim.length > 2 && !isHexString(toTrim)) {
      return setError(true);
    }

    if (toTrim.length < 42) {
      return setError(false);
    }

    if (!utils.isAddress(toTrim.trim())) {
      return setError(true);
    }

    setError(false);
  }, [address]);

  const handleFocusInput = () => setInputIsFocused(true);
  const handleBlurInput = () => setInputIsFocused(false);

  const onDone = useCallback(async () => {
    onAddress(address.trim());
  }, [onAddress, address]);

  const onPressQR = useCallback(() => {
    const subscription = (value: string) => {
      if (utils.isAddress(value.trim())) {
        setAddress(value.trim());
        app.off('address', subscription);
        hideModal();
      }
    };

    app.on('address', subscription);

    showModal('qr');
  }, [app]);

  const onPressClear = useCallback(() => {
    setAddress('');
  }, []);

  return (
    <ScrollView contentContainerStyle={page.scrollContent} scrollEnabled>
      <KeyboardSafeArea>
        <View>
          <TextField
            onFocus={handleFocusInput}
            onBlur={handleBlurInput}
            label="Send to"
            style={page.input}
            value={address}
            onChangeText={setAddress}
            error={error}
            errorText="Incorrect address"
            autoFocus
            multiline
            rightAction={
              address === '' ? (
                <IconButton onPress={onPressQR}>
                  <QRScanner color={GRAPHIC_GREEN_1} width={25} height={25} />
                </IconButton>
              ) : (
                <IconButton onPress={onPressClear}>
                  <CloseCircle color={GRAPHIC_BASE_2} width={25} height={25} />
                </IconButton>
              )
            }
          />
          {!address && inputIsFocused ? (
            <Text style={page.placeholder}>Enter Address or contact name</Text>
          ) : null}
        </View>

        <Spacer>
          {contactsList.length ? (
            <FlatList
              keyboardShouldPersistTaps="always"
              data={contactsList}
              renderItem={({item}) => (
                <AddressRow item={item} onPress={setAddress} />
              )}
              ListHeaderComponent={AddressHeader}
            />
          ) : null}
        </Spacer>

        <Button
          disabled={!checked}
          variant={ButtonVariant.contained}
          title="Continue"
          onPress={onDone}
          style={page.button}
        />
      </KeyboardSafeArea>
    </ScrollView>
  );
};

const page = StyleSheet.create({
  scrollContent: {flexGrow: 1},
  placeholder: {
    position: 'absolute',
    color: '#aaaaaa',
    left: 37,
    bottom: isIOS ? 21 : 25,
  },
  input: {
    marginBottom: 12,
    marginHorizontal: 20,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
});
