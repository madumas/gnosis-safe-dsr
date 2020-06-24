import React, {useEffect} from 'react'
import GlobalStyle from "./style";
import { ThemeProvider } from "styled-components";
import {
  Button,
  Title,
  Section,
  Text,
  TextField,
  Divider,
  Switch,
} from "@gnosis.pm/safe-react-components";
import WidgetWrapper from "./WidgetWrapper";
import { DaiInfo, ButtonContainer } from "./components";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import getTheme from "./customTheme";
import styled from "styled-components";
import { DAI } from '@makerdao/dai-plugin-mcd';

const StyledTitle = styled(Title)`
  margin-top: 0px;
`;

function Dashboard(props) {
  const services = props.services;
  const [DsrBalance, setDsrBalance] = React.useState(undefined);
  const [DaiBalance, setDaiBalance] = React.useState(undefined);
  const [maker, setMaker] = React.useState(undefined);
  const [dsrManager, setDsrManager] = React.useState(undefined);
  const [enabled, setEnabled] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [proxyEnabled, setProxyEnabled] = React.useState(false);
  const [rate, setRate] = React.useState(undefined);

  const theme = getTheme();

  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    let proxy,dsrManager,maker;

    async function updateMaker() {
      dsrManager.balance().then(bal => setDsrBalance(bal.toString()));
      maker.getToken('DAI').balance().then(bal => setDaiBalance(bal.toString()));
      if (proxy) {
        setProxyEnabled(true);
        maker.getToken('DAI').allowance(maker.currentAddress(), proxy).then(allowance =>
          setEnabled(allowance.toNumber() > 1));
      }
    }

    async function initMaker() {
      maker = await services.maker();
      dsrManager = maker.service('mcd:savings');
      setMaker(maker);
      setDsrManager(dsrManager);
      dsrManager.getYearlyRate().then(rate=>setRate(((rate-1)*100).toLocaleString("en-EN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })));
      proxy = await maker.service('proxy').getProxyAddress();

      updateMaker();
      maker.service('web3').onNewBlock(updateMaker);

    }
    initMaker();
  },[services]);

  const toggleApprove = React.useCallback( async () => {
    if (proxyEnabled) {
      const proxy = await maker.service('proxy').getProxyAddress();
      await maker.getToken(DAI).approveUnlimited(proxy);
    }

  },[proxyEnabled,maker]);

  const deployProxy = React.useCallback( async () => {
    await maker.service('proxy').ensureProxy();
  },[maker]);

  const deposit = React.useCallback(async () => {
    await dsrManager.join(DAI(Number(inputValue)));
  },[dsrManager,inputValue]);

  const withdraw = React.useCallback(async () => {
    await dsrManager.exit(DAI(Number(inputValue)));
  },[dsrManager,inputValue]);

  return <>
    <GlobalStyle/>
    <ThemeProvider theme={theme}>
      <WidgetWrapper>
        <StyledTitle size="xs">Your Balances</StyledTitle>

        <Section>
          <DaiInfo>
            <div>
              <Text size="lg">Your Dai Balance</Text>
              <Text size="lg">{DaiBalance}</Text>
            </div>
            <Divider />
            <div>
              <Text size="lg">Your DSR Balance</Text>
              <Text size="lg">{DsrBalance}</Text>
            </div>
            <Divider />
            <div>
              <Text size="lg">Current interest rate</Text>
              <Text size="lg">{rate}% APR</Text>
            </div>
            <Divider />
          </DaiInfo>
        </Section>
        <FormControlLabel label="Enable Proxy"
         control={<Switch checked={proxyEnabled} onChange={deployProxy} />} />
        <FormControlLabel disabled={!proxyEnabled} label="Authorize Dai Transfers"
         control={<Switch checked={enabled} onChange={toggleApprove} />} />

        <Title size="xs">Withdraw or Supply balance</Title>
        <TextField  label="Amount" onChange={onInputChange} value={inputValue}  variant="outlined" />
        <ButtonContainer>
          <Button
            size="lg"
            color="secondary"
            variant="contained"
            onClick={withdraw}
            disabled={!enabled}
          >
            Withdraw
          </Button>
          <Button
            size="lg"
            color="primary"
            variant="contained"
            onClick={deposit}
            disabled={!enabled}
          >
            Deposit
          </Button>
        </ButtonContainer>
      </WidgetWrapper>
    </ThemeProvider>
  </>
}

export default Dashboard;
