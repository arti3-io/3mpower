import { LogOut, Link2Off, Link2, Wallet, RefreshCcw } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VerifyWalletsDialogue } from './verify-wallets-dialogue';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useModal } from 'connectkit';
import { useAccount } from 'wagmi';
import { truncatedAddr } from '@/lib/utils';
import { motion } from 'framer-motion';

export function UserNav() {
  const [verifyWalletsOpen, setVerifyWalletsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { openProfile } = useModal();
  const { data: session, status } = useSession();
  const [bindWallet, setBindWallet] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      setBindWallet(session?.user?.bindWallet);
      if (!isConnected && !session?.user?.bindWallet) {
        openProfile();
      }
      // else if (!session?.user?.bindWallet) {
      //   setVerifyWalletsOpen(true);
      // }
    }
  }, [status]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={String(session?.user?.image)}
                  alt={`@${session?.user?.name}`}
                />
                <AvatarFallback>3M</AvatarFallback>
              </Avatar>
              {isConnected && !(bindWallet === String(address)) && (
                <div className="absolute -bottom-1 -right-1 bg-red-400 rounded-full p-0.5">
                  <Link2Off className="h-3 w-3 text-red-900" />
                </div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              {/* <p className='text-sm font-medium leading-none'>{user?.fullName}</p> */}
              <p className="text-sm font-normal leading-none">
                {session?.user?.name}
              </p>
              {/* <p className='text-[11px] leading-none text-muted-foreground'>{address}</p> */}
              {isConnected && (
                <div className="flex flex-row items-center">
                  <p className="text-[11px] leading-none text-muted-foreground">
                    {truncatedAddr(String(address))}
                  </p>
                  {bindWallet === String(address) ? (
                    <Link2 className="ml-1 h-3 w-3" color="#94949c" />
                  ) : (
                    <Link2Off
                      className="ml-1 h-3 w-3 text-red-400"
                      onClick={() => {
                        setVerifyWalletsOpen(true);
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isConnected && !(bindWallet === String(address)) && (
              <DropdownMenuItem
                onClick={() => {
                  setVerifyWalletsOpen(true);
                }}
              >
                <motion.div
                  className="flex items-center"
                  animate={{
                    x: [0, 20, 0],
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeOut',
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  <span>Bind Wallet</span>
                </motion.div>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={openProfile}>
              {isConnected ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  <span>Switch Wallet</span>
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Verify Wallet</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <VerifyWalletsDialogue
        open={verifyWalletsOpen}
        setOpen={setVerifyWalletsOpen}
        setBindWallet={setBindWallet}
      />
    </>
  );
}
