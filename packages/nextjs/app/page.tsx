"use client";

import type { NextPage } from "next";
import { NewsletterForm } from "~~/components/aavegotchi-chain-story/NewsletterForm";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 bg-gradient-to-t from-base-100 to-base-200">
        <div className="flex items-center flex-col w-full">
          <p className="text-center text-3xl lg:text-9xl aavegotchi">Avegotchi chain story</p>

          <div className="bg-secondary w-full">
            <p className="kanit-light text-2xl text-center">{"It’s not a cryptocurrency."}</p>
            <p className="kanit-light text-2xl text-center">{"It’s not an NFT."}</p>
            <p className="kanit-light text-2xl text-center">{"It’s not a token."}</p>
            <p className="kanit text-4xl text-center">{"It is a chain story contract."}</p>
          </div>

          <div className="flex flex-wrap justify-center lg:space-x-10">
            <div className="lg:w-1/4 bg-base-300 rounded-lg shadow-md m-4 p-4">
              <p className="text-3xl kanit text-center">What?</p>
              <p className="text-xl kanit-light text-center">
                {`A chain story is an organically grown story created by an increasing group of people using a smart contract.`}
              </p>
            </div>

            <div className="lg:w-1/4 bg-base-300 rounded-lg shadow-md m-4 p-4">
              <p className="text-3xl kanit text-center">How?</p>
              <p className="text-xl kanit-light text-center">
                {`New authors submit their version of the next part of the story. Past authors of the story judge and vote on the story submissions of the new authors.`}
              </p>
            </div>

            <div className="lg:w-1/4 bg-base-300 rounded-lg shadow-md m-4 p-4">
              <p className="text-3xl kanit text-center">Why?</p>
              <p className="text-xl kanit-light text-center">
                {`The idea is to create a continuing story by new authors using a smart contract. It is a story guided by its past authors and written by its new authors. The rules and how it works are enforced by a smart contract.`}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-col space-y-10">
            <div className="m-10">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
