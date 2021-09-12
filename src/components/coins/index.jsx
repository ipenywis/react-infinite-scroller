import axios from "axios";
import React, { useEffect, useState } from "react";
import { PER_PAGE } from "./constants";
import tw from "twin.macro";
import { wait } from "../../utils/app";

import InfiniteScroll from "react-infinite-scroller";

const CoinsCardContainer = tw.article`
  w-full
  max-w-5xl
  flex 
  flex-col 
  items-center  
  shadow-lg 
  bg-white
  overflow-y-auto
`;

const LoadingContainer = tw.div`
  w-full
  flex
  items-center
  justify-center
  text-blue-400
  text-base
  p-6
`;

const CoinItem = tw.div`
  h-10
  w-full
  flex
  items-center
  justify-between
  border-b-2
  border-gray-200
  p-6
`;

const HorizontalContainer = tw.div`
  flex
  items-center
  w-32
`;

const CoinImg = tw.img`
  h-9
  w-auto
`;

const CoinRank = tw.b`
  w-5
  text-black
  text-sm
`;

const CoinName = tw.h4`
  w-20  
text-black
  text-base
`;

const CoinInfo = tw.h6`
  w-32 
text-gray-500
  text-base
`;

export function Coins(props) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(200);
  const [offset, setOffset] = useState(-PER_PAGE);

  const isEmptyCoins = !coins || coins.length === 0;

  const getCoinImageUrl = (symbol) =>
    `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;

  const fetchCoins = async () => {
    setLoading(true);

    const newOffset = offset + PER_PAGE;

    const response = await axios
      .get("https://api.coincap.io/v2/assets", {
        params: { limit: PER_PAGE, offset: newOffset },
      })
      .catch((err) => {
        console.log("Error: ", err);
      });

    // await wait(2000);

    if (response && response.data) {
      const newCoins = [...coins, ...response.data.data];

      if (newCoins.length >= totalCount) {
        setHasMore(false);
      }

      setCoins(newCoins);
      console.log("Coins: ", coins);

      setOffset(newOffset);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <CoinsCardContainer>
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchCoins}
        hasMore={hasMore}
        loader={<LoadingContainer>Loading...</LoadingContainer>}
        threshold={350}
        initialLoad={true}
        style={{ width: "100%" }}
      >
        {!isEmptyCoins &&
          coins.map((coin, idx) => (
            <CoinItem key={idx}>
              <CoinRank>{coin.rank}</CoinRank>
              <CoinImg src={getCoinImageUrl(coin.symbol)} />
              <CoinName>{coin.name}</CoinName>
              <CoinInfo>{Number(coin.priceUsd).toFixed(2)}</CoinInfo>
              <CoinInfo>{Number(coin.marketCapUsd).toFixed(2)}</CoinInfo>
            </CoinItem>
          ))}
      </InfiniteScroll>
    </CoinsCardContainer>
  );
}
