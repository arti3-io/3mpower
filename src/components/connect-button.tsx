import { ConnectKitButton } from "connectkit";
import { Button } from "./ui/button";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <>
            {isConnected ? (
              <Button onClick={show} className='w-full' variant='outline'>
                {address}
              </Button>
            ) : (
              <Button onClick={show} className='w-full'>
                {"Connect"}
              </Button>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
