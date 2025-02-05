import React, {useEffect, useRef} from 'react';
import {LottieWrap, PopupContainer, Text} from '../ui';
import {Dimensions, StyleSheet} from 'react-native';
import {useWallet} from '../../contexts/wallets';
import {EthNetwork} from '../../services/eth-network';
import {TransactionResponse} from '@ethersproject/abstract-provider';
import {getText, I18N} from '../../i18n';

export type TransactionVerifyProps = {
  from: string;
  to: string;
  amount: number;
  onDone: (transaction: TransactionResponse) => void;
};

export const TransactionLedger = ({
  from,
  to,
  amount,
  onDone,
}: TransactionVerifyProps) => {
  const wallet = useWallet(from);
  const ethNetworkProvider = useRef(new EthNetwork(wallet!)).current;

  useEffect(() => {
    requestAnimationFrame(async () => {
      try {
        const transaction = await ethNetworkProvider.sendTransaction(
          to,
          amount,
        );

        if (transaction) {
          onDone(transaction);
        }
      } catch (e) {
        console.log('onDone', e);
      }
    });
    return () => {
      ethNetworkProvider.stop = true;
    };
  }, [amount, ethNetworkProvider, onDone, to]);

  return (
    <PopupContainer style={styles.container}>
      <Text t9 style={styles.text}>
        {getText(I18N.transactionLedgerBluetoothConfirmation)}
      </Text>
      <LottieWrap
        style={styles.lottie}
        source={require('../../../assets/animations/transaction-ledger.json')}
        autoPlay
        loop={false}
      />
    </PopupContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: Dimensions.get('window').width,
  },
  text: {
    textAlign: 'center',
  },
});
