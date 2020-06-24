import React from 'react'
import Safe from './safe'

const SafeContext = React.createContext(undefined);

export const SafeProvider = ({ loading, children }) => {
  const [safe] = React.useState(new Safe());
  const [connected, setConnected] = React.useState(false);
  React.useEffect(() => {
    safe.activate(() => {
      setConnected(safe.isConnected())
    });

    return () => safe.deactivate();
  }, [safe]);

  return (
    <div className="App">
      {(connected ?
          <SafeContext.Provider value={safe}>
            {children}
          </SafeContext.Provider> :
          loading
      )}
    </div>
  )
};

export const useSafe = () => {
  const value = React.useContext(SafeContext);
  if (value === undefined) {
    throw new Error('You probably forgot to put <SafeProvider>.');
  }
  return value;
};

export default SafeProvider
