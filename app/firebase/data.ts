'use server'

import app, { db, realTimeDB } from './config';
import { addDoc, collection, query, where, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";
import { VotesSubmit } from '@/lib/vote-submit';
import { convertVoteResponseToVoteState } from '@/lib/utils';
import { ref, get, child, DataSnapshot } from 'firebase/database';

export type CallResponseError = {
  message: string,
};

export type CallResponse = {
  result?: any,
  error?: CallResponseError | null | undefined,
};

const createVote = async (voteData: VotesSubmit): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const collectionRef = collection(db, 'votes');
    await addDoc(collectionRef, voteData);
    return {
      result: 'ok',
    }
  } catch(error) {
    const errorMessage = 'Error happen while saving the vote, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

const getVoteById = async (voteId: string): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const collectionRef = collection(db, 'votes');
    const q = query(collectionRef, where('id', '==', voteId));
    const votesCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(q);

    if (votesCollectionSnapshot.size > 0) {
      const data = votesCollectionSnapshot.docs[0].data();

      return {
        result: convertVoteResponseToVoteState(data.votes),
      }
    }

    return {
      error: {
        message: 'Not found.',
      }
    }
  } catch(error) {
    const errorMessage = 'Error happen while getting the vote, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

const getVotes = async (campaignId: string): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const collectionRef = collection(db, 'votes');
    const q = query(collectionRef, where('campaignId', '==', campaignId));
    const votesCollectionSnapshot: QuerySnapshot<DocumentData, DocumentData> = await getDocs(q);

    const votes = votesCollectionSnapshot.docs.map((doc) => {
      const voteData = doc.data();
      const partiesArray = Object.entries(voteData.parties).map(
        ([id, { count }]: any) => ({
          id,
          count,
        })
      );

      return {
        id: voteData.id,
        campaignId: voteData.campaignId,
        parties: partiesArray,
      };
    });

    return {
      result: votes,
    }
  } catch(error) {
    const errorMessage = 'Error happen while getting the votes, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

const getResults = async (campaignId: string): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const dbRef = ref(realTimeDB);
    const resultsRef = `results/${campaignId}`;

    const snapshot: DataSnapshot = await get(child(dbRef, resultsRef));
    if (snapshot.exists()) {
      const dataResults = snapshot.val();

      return {
        result: {
          totalVotes: dataResults.voteCount,
          totalClassicVotes: dataResults.classicVoteCount,
          participantsCount: dataResults.participantsCount,
        }
      }
    } else {
      return {
        error: {
          message: "Results not found for the specified campaign."
        }
      };
    }

  } catch(error) {
    const errorMessage = 'Error happen while getting the vote results, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

const getParties = async (campaignId: string): Promise<CallResponse> => {
  const auth = getAuth(app);
  try {
    await signInAnonymously(auth);
    const dbRef = ref(realTimeDB);
    const resultsRef = `results/${campaignId}`;
    const partiesRef = `parties/${campaignId}`;
    const snapshotResults: DataSnapshot = await get(child(dbRef, resultsRef));
    const snapshotParties: DataSnapshot = await get(child(dbRef, partiesRef));

    if (snapshotResults.exists() && snapshotParties.exists()) {
      const dataResults = snapshotResults.val();
      const dataParties = snapshotParties.val();

      const parties = Object.keys(dataParties).map((key) => ({
        id: key,
        ...dataParties[key],
        result: dataParties[key].voteCount/dataResults.voteCount,
        classicResult: dataParties[key].classicVoteCount/dataResults.classicVoteCount,
      }));

      return {
        result: parties
      }
    } else {
      return {
        error: {
          message: "Parties not found for the specified campaign."
        }
      };
    }
  } catch(error) {
    const errorMessage = 'Error happen while getting the vote results, please try again.';
    console.log(errorMessage);
    console.error('Error : ', error);

    return {
      error: {
        message: errorMessage,
      }
    }
  }
}

export { createVote, getVoteById, getParties, getResults, getVotes }