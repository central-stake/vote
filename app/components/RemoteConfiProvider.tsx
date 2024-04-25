"use client"

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, getNumber, getValue, getString } from "firebase/remote-config";
import { CandidateGroup } from "@/lib/candidates";
import defaultCandidateGroup from "@/lib/candidate-group";
import { firebaseConfig } from "../firebase/config";

export type RemoteData = {
  quadratiqueEvolution: number[],
  campaignId: string,
  initialCreditCount: number,
  candidateGroup: CandidateGroup[],
} | null

const RemoteConfigContext = createContext<RemoteData>(null);

export const useRemoteConfig = () => useContext(RemoteConfigContext);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const RemoteConfigProvider: React.FC<{children: ReactNode}> = ({ children }: { children: ReactNode }) => {
  const [remoteConfig, setRemoteConfig] = useState<RemoteData>(null);

  const fetchRemoteConfig = async () => {
    const firebaseRemoteConfig = getRemoteConfig(app);
    // TODO: Uncomment
    // firebaseRemoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    firebaseRemoteConfig.settings.minimumFetchIntervalMillis = 20;

    firebaseRemoteConfig.defaultConfig = {
      campaignId: 'belgium-2024-1',
      initialCreditCount: 30,
      quadratiqueEvolution: "[0, 1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210]",
    };

    await fetchAndActivate(firebaseRemoteConfig);

    const campaignId = getString(firebaseRemoteConfig, "campaignId");
    const initialCreditCount = getNumber(firebaseRemoteConfig, "initialCreditCount");
    const quadratiqueEvolution = getString(firebaseRemoteConfig, "quadratiqueEvolution");
    const candidateGroup = getString(firebaseRemoteConfig, "candidateGroup");

    setRemoteConfig({
      campaignId: campaignId,
      initialCreditCount: initialCreditCount,
      quadratiqueEvolution: JSON.parse(quadratiqueEvolution) as number[],
      candidateGroup: candidateGroup ? JSON.parse(candidateGroup) as CandidateGroup[] : defaultCandidateGroup,
    });
  };

  useEffect(() => {
    fetchRemoteConfig();
  }, []);

  return (
    <RemoteConfigContext.Provider value={remoteConfig}>
      {children}
    </RemoteConfigContext.Provider>
  );
};

