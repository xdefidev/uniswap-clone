import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Web3Status from 'components/Web3Status'
import { chainIdToBackendName } from 'graphql/data/util'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useIsPoolsPage } from 'hooks/useIsPoolsPage'
import { useAtomValue } from 'jotai/utils'
import { Box } from 'nft/components/Box'
import { Row } from 'nft/components/Flex'
import { UniIcon } from 'nft/components/icons'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { ReactNode } from 'react'
import { NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import { shouldDisableNFTRoutesAtom } from 'state/application/atoms'
import styled from 'styled-components/macro'

import { useIsNavSearchInputVisible } from '../../nft/hooks/useIsNavSearchInputVisible'
import { Bag } from './Bag'
import Blur from './Blur'
import { ChainSelector } from './ChainSelector'
import { MenuDropdown } from './MenuDropdown'
import { SearchBar } from './SearchBar'
import * as styles from './style.css'

const Nav = styled.nav`
  padding: ${({ theme }) => `${theme.navVerticalPad}px 12px`};
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children }: MenuItemProps) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId}
    >
      {children}
    </NavLink>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation()
  const { chainId: connectedChainId } = useWeb3React()
  const chainName = chainIdToBackendName(connectedChainId)

  const isPoolActive = useIsPoolsPage()
  const isNftPage = useIsNftPage()

  const shouldDisableNFTRoutes = useAtomValue(shouldDisableNFTRoutesAtom)

  return (
    <>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        <Trans>Swap</Trans>
      </MenuItem>
      {/* <MenuItem href={`/tokens/${chainName.toLowerCase()}`} isActive={pathname.startsWith('/tokens')}>
        <Trans>Tokens</Trans>
      </MenuItem> */}
      {/* {!shouldDisableNFTRoutes && (
        <MenuItem dataTestId="nft-nav" href="/nfts" isActive={isNftPage}>
          <Trans>NFTs</Trans>
        </MenuItem>
      )} */}
      <Box display={{ sm: 'flex', lg: 'none', xxl: 'flex' }} width="full">
        <MenuItem href="/add/v2/ETH" dataTestId="pool-nav-link" isActive={isPoolActive}>
          <Trans>Pools</Trans>
        </MenuItem>
      </Box>
      {/* <MenuItem href="/pools" dataTestId="pool-nav-link" isActive={isPoolActive}>
          <Trans>Farm</Trans>
        </MenuItem> */}
      <Box display={{ sm: 'flex', lg: 'none', xxl: 'flex' }} width="full">
        <a href="https://app.testnet.live/stake" style={{ textDecoration: "none", textAlign: "center", alignSelf: "center", padding: "8px 14px", margin: "4px 0px" }}>

          <Trans>Stake</Trans>

          {/* <MenuItem href="https://app.testnet.live/stake" aria-diabled="true" dataTestId="pool-nav-link" isActive={false} >
  
</MenuItem> */}

        </a>
      </Box>


      <a href="https://app.testnet.live/farm" style={{ textDecoration: "none", textAlign: "center", alignSelf: "center", padding: "8px 14px" }}>

        <Trans>Farm</Trans>
        {/* <MenuItem href="https://app.testnet.live/farm" dataTestId="pool-nav-link" isActive={false} >
          
        </MenuItem> */}
      </a>


      {/* <Box marginY={{ sm: '4', md: 'unset' }}>
        <MenuDropdown />
      </Box> */}
    </>
  )
}

const Navbar = ({ blur }: { blur: boolean }) => {
  const isNftPage = useIsNftPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const navigate = useNavigate()
  const isNavSearchInputVisible = useIsNavSearchInputVisible()

  return (
    <>
      {blur && <Blur />}
      <Nav>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
            <Box className={styles.logoContainer}>
              <a href="https://renq.io" target="_blank" >
                <UniIcon
                  width="48"
                  height="48"
                  data-testid="uniswap-logo"
                  className={styles.logo}
                // onClick={() => {
                //   navigate({
                //     pathname: '/',
                //     search: '?intro=true',
                //   })
                // }}
                />
              </a>

              {/* Renq Logo */}
            </Box>
            {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )}
            <Row display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box
            className={styles.searchContainer}
            {...(isNavSearchInputVisible && {
              display: 'flex',
            })}
          >
            {/* <SearchBar /> */}
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box position="relative" display={isNavSearchInputVisible ? 'none' : { sm: 'flex' }}>
                <SearchBar />
              </Box>
              {isNftPage && sellPageState !== ProfilePageStateType.LISTING && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  {/* <ChainSelector /> */}
                </Box>
              )}

              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
